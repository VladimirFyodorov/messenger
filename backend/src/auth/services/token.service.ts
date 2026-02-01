import * as bcrypt from 'bcrypt';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async generateAccessToken(payload: { sub: string; email: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('auth.jwt.expiresIn') ?? '7d',
    });
  }

  async generateRefreshToken(payload: { sub: string }): Promise<string> {
    return this.jwtService.signAsync(payload, {
      expiresIn: this.configService.get<string>('auth.jwt.refreshExpiresIn') ?? '30d',
    });
  }

  async hashRefreshToken(token: string): Promise<string> {
    return bcrypt.hash(token, 10);
  }

  async validateRefreshToken(
    token: string,
    hashedToken: string,
  ): Promise<boolean> {
    return bcrypt.compare(token, hashedToken);
  }

  async validateToken(token: string): Promise<any> {
    try {
      return await this.jwtService.verifyAsync(token);
    } catch {
      return null;
    }
  }

  decodeToken(token: string): any {
    return this.jwtService.decode(token);
  }
}
