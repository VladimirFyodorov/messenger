import {
  ExtractJwt,
  Strategy,
} from 'passport-jwt';

import {
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { UsersService } from '../../users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    configService: ConfigService,
  ) {
    const secret = configService.get<string>('auth.jwt.secret') ?? 'your-secret-key';
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,
    });
  }

  async validate(payload: { sub?: string; email?: string }) {
    if (!payload?.sub) {
      throw new UnauthorizedException();
    }
    try {
      const user = await this.usersService.findById(payload.sub);
      return { id: user.id, email: user.email };
    } catch {
      throw new UnauthorizedException();
    }
  }
}
