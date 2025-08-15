import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { JwtConfig } from '@/config/jwt.config';
import { RedisService } from '@/shared/redis/redis.service';

// 定义 JWT payload 的类型
interface JwtPayload {
  username: string;
  userId: number;
  [key: string]: any;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get<JwtConfig>('jwt')!.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const token = await this.redis.get(`${payload.username}&${payload.userId}`);
    if (!token) {
      throw new UnauthorizedException('Token已过期或无效，请重新登录');
    }
    return payload;
  }
}
