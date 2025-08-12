import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../system/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from '@/config/jwt.config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from '../../common/guards/jwt.guard';
import { RepeatSubmitGuard } from '../../common/guards/repeat-submit.guard';

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const jwtConfig = configService.get<JwtConfig>('jwt');
        if (!jwtConfig) {
          throw new Error('JWT configuration is not defined');
        }
        const { secret, expiresIn } = jwtConfig;
        return {
          global: true,
          secret,
          signOptions: { expiresIn },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    { provide: 'APP_GUARD', useClass: JwtAuthGuard },
    { provide: 'APP_GUARD', useClass: RepeatSubmitGuard },
  ],
})
export class AuthModule {}
