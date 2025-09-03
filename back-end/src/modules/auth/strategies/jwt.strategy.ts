import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { JwtConfig } from '@/config/jwt.config';
import { RedisService } from '@/shared/redis/redis.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    const jwtConfig = config.get<JwtConfig>('jwt');
    if (!jwtConfig?.secret) {
      throw new Error('JWT configuration is not properly set');
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret,
    });
  }

  async validate(payload: JWTPayload): Promise<JWTPayload> {
    // 验证必要字段是否存在
    if (!payload.userId || !payload.username) {
      throw new UnauthorizedException('无效的token载荷');
    }

    // 构造Redis键，与生成时保持一致
    const redisKey = `${payload.username}&${payload.userId}`;

    try {
      const token = await this.redis.get(redisKey);
      if (!token) {
        throw new UnauthorizedException('Token已过期或无效，请重新登录');
      }

      // 返回验证通过的payload
      return payload;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      // Redis连接错误等其他异常
      throw new UnauthorizedException('Token验证失败，请重新登录');
    }
  }
}
