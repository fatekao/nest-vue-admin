import { ApiProperty, OmitType } from '@nestjs/swagger';
import { UserInfoResDto } from '@/modules/system/user/dto/res-user.dto';
import { MenuTreeResDto } from '@/modules/system/menu/dto/res-menu.dto';

/**
 * 用户认证数据传输对象
 * 用于创建新用户的登录请求数据验证
 */
export class LoginTokenDto {
  @ApiProperty({ description: 'JWT Token' })
  token: string;
}

export class AuthUserInfoDto extends OmitType(UserInfoResDto, [
  'createBy',
  'updateBy',
  'createTime',
  'updateTime',
] as const) {
  @ApiProperty({ description: '用户权限' })
  buttons: string[];

  @ApiProperty({ description: '用户菜单', type: [MenuTreeResDto] })
  menus: MenuTreeResDto[];
}
