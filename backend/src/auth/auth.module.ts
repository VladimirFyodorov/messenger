import { Module } from '@nestjs/common';
import {
  ConfigModule,
  ConfigService,
} from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Config } from '../config/types';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { Session } from './entities/session.entity';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    TypeOrmModule.forFeature([Session]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService<Config>) => ({
        secret: config.get('auth.jwt.secret', { infer: true }),
        signOptions: {
          expiresIn: config.get('auth.jwt.expiresIn', { infer: true }),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, TokenService, SessionService, JwtStrategy, JwtAuthGuard, GoogleStrategy],
  exports: [AuthService, TokenService, SessionService, JwtAuthGuard],
})
export class AuthModule {}
