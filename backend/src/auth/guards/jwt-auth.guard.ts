import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private configService: ConfigService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers?.authorization;
    const hasBearer = typeof authHeader === 'string' && authHeader.startsWith('Bearer ');
    if (hasBearer) {
      const token = authHeader.slice(7);
      const secret = this.configService.get<string>('auth.jwt.secret') ?? 'your-secret-key';
      try {
        jwt.verify(token, secret);
      } catch (e) {
        throw new UnauthorizedException((e as Error).message);
      }
    }
    return super.canActivate(context) as Promise<boolean>;
  }

  handleRequest<TUser>(err: Error | null, user: TUser | false): TUser {
    if (err) {
      throw err instanceof UnauthorizedException ? err : new UnauthorizedException(err.message);
    }
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}
