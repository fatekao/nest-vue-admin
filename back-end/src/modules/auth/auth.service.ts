import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@/shared/prisma/prisma.service';
import { RedisService } from '@/shared/redis/redis.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '@/modules/system/user/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '@/config/jwt.config';
import { arrayToTree } from '@/utils/treeData';
import { AuthUserInfoDto } from './dto/res-auth.dto';
import { PermissionListResDto, PermissionTreeResDto } from '../system/permission/dto/res-permission.dto';

/**
 * 认证服务类
 * 处理用户身份验证、token生成和验证等相关功能
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  /**
   * 验证用户身份
   * 根据用户名和密码验证用户是否存在且有效
   * @param username - 用户名
   * @param password - 密码
   * @returns Promise<User> - 验证成功的用户信息
   * @throws UnauthorizedException - 当用户不存在、密码错误或用户状态异常时抛出
   */
  async validateUser(username: string, pass: string): Promise<UserEntity> {
    // 查询用户信息，确保用户未被删除且处于激活状态
    const user = await this.prisma.sysUser.findUnique({
      where: {
        username,
        isDeleted: false, // 确保用户未被删除
        status: 1, // 确保用户处于激活状态
      },
    });

    // 用户不存在时抛出异常
    if (!user) throw new UnauthorizedException('用户不存在');

    const { password, ...result } = user;

    // 用户密码未设置时抛出异常
    if (!password) throw new UnauthorizedException('用户密码未设置');

    // 验证密码是否匹配
    const isMatch = await bcrypt.compare(pass, password);
    if (!isMatch) throw new UnauthorizedException('用户名或密码错误');

    return result;
  }

  /**
   * 用户登录处理
   * 生成JWT token并存储到Redis中
   * @param loginDto - 登录数据传输对象
   * @param user - 已验证的用户信息
   * @returns Promise<{ accessToken: string }> - 包含访问令牌的响应对象
   */
  async signIn(user: JWTPayload): Promise<{ accessToken: string }> {
    // 构造JWT payload数据
    const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
      userId: user.userId,
      username: user.username,
      roleIds: user.roleIds,
    };

    // 生成JWT token，设置7天过期时间
    const jwtConfig = this.config.get<JwtConfig>('jwt');
    const token = this.jwt.sign(payload, { expiresIn: jwtConfig?.expiresIn });

    // 将token存入Redis，过期时间与JWT同步（7天）
    await this.redis.set(`${payload.username}&${payload.userId}`, `Bearer ${token}`, 60 * 60 * 24 * 7); // 7天过期
    return { accessToken: token };
  }

  /**
   * 用户登出处理
   * 从Redis中删除用户的token
   * @param payload - JWT载荷信息
   * @returns Promise<void>
   */
  async signOut(payload: Pick<JWTPayload, 'username' | 'userId'>): Promise<void> {
    const redisKey = `${payload.username}&${payload.userId}`;
    await this.redis.del(redisKey);
  }

  /**
   * 根据用户ID获取用户信息
   * 用于已通过JWT验证后获取用户详细信息
   * @param id - 用户ID
   * @returns Promise<User | null> - 用户信息或null
   * @throws UnauthorizedException - 当用户不存在或状态异常时抛出
   */
  async getUserInfo(id: number): Promise<AuthUserInfoDto> {
    // 获取用户信息，确保用户未被删除且处于激活状态
    const user = await this.prisma.sysUser.findUnique({
      where: {
        id,
        isDeleted: false,
        status: 1, // 确保用户状态正常
      },
      include: {
        creator: {
          select: { nickName: true },
        },
        updater: {
          select: { nickName: true },
        },
        roles: {
          where: { isDeleted: false, status: 0 }, // 确保角色未被删除
          include: {
            creator: {
              select: { nickName: true },
            },
            updater: {
              select: { nickName: true },
            },
            permissions: {
              where: { isDeleted: false }, // 确保菜单未被删除
              orderBy: { orderNum: 'asc' },
            },
          },
        },
      },
    });

    // 用户不存在时抛出异常
    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    // 收集用户的按钮权限和路由
    const buttons: string[] = [];
    const menus: PermissionListResDto[] = [];
    const menuSet = new Set<number>();

    // 遍历用户的角色和菜单
    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        // 使用Set确保菜单不重复
        if (!menuSet.has(permission.id)) {
          menuSet.add(permission.id);

          // 如果菜单有路径，则认为是路由
          if (permission.path) {
            menus.push({
              id: permission.id,
              name: permission.name,
              path: permission.path,
              component: permission.component,
              icon: permission.icon,
              isCacheable: permission.isCacheable,
              isVisible: permission.isVisible,
              orderNum: permission.orderNum,
              parentId: permission.parentId,
            });
          }
        }
      });
    });

    // 去除密码字段并添加按钮和路由信息
    const { password: _password, ...userInfo } = user;

    const menusTree: PermissionTreeResDto[] = arrayToTree(menus, { idKey: 'id', parentIdKey: 'parentId' });

    // 获取创建人和更新人名称
    const createByName = user.creator.nickName || '';
    const updateByName = user.updater.nickName || '';

    return {
      ...userInfo,
      createByName,
      updateByName,
      roles: [],
      menus: menusTree,
      buttons,
    };
  }
}
