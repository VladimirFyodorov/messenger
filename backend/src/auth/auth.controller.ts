import {
  Request as ExpressRequest,
  Response,
} from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

import { Config } from '../config/types';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { GoogleProfile } from './strategies/google.strategy';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
    private configService: ConfigService<Config>,
  ) {}

  @Post('register')
  async register(
    @Body() dto: RegisterDto,
    @Request() req: ExpressRequest,
  ) {
    return this.authService.register(
      dto,
      req.headers['user-agent'],
      req.ip,
    );
  }

  @Post('login')
  async login(@Body() dto: LoginDto, @Request() req: ExpressRequest) {
    return this.authService.login(dto, req.headers['user-agent'], req.ip);
  }

  @Post('refresh')
  @UseGuards(JwtAuthGuard)
  async refresh(@Body() dto: RefreshTokenDto, @Request() req: ExpressRequest & { user: { id: string } }) {
    return this.authService.refreshToken(dto.refreshToken, req.user.id);
  }

  @Post('logout')
  @UseGuards(JwtAuthGuard)
  async logout(@Request() _req: ExpressRequest & { user: { id: string } }) {
    // In a real implementation, you'd get sessionId from token
    return { message: 'Logged out successfully' };
  }

  @Get('sessions')
  @UseGuards(JwtAuthGuard)
  async getSessions(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.sessionService.getUserSessions(req.user.id);
  }

  @Delete('sessions/:id')
  @UseGuards(JwtAuthGuard)
  async deleteSession(@Param('id') id: string) {
    await this.sessionService.revokeSession(id);
    return { message: 'Session revoked' };
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async google() {
    this.logger.log('GET /auth/google — redirecting to Google');
    // Guard redirects to Google; handler unused
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Request() req: ExpressRequest & { user: GoogleProfile },
    @Res() res: Response,
  ) {
    this.logger.log(`GET /auth/google/callback — profile email=${req.user.email} googleId=${req.user.googleId}`);
    const result = await this.authService.googleAuth(
      req.user,
      req.headers['user-agent'] as string,
      req.ip,
    );
    const base = this.configService.get('auth.oauthSuccessRedirectUrl', { infer: true });
    if (!base) {
      throw new Error('OAuth success redirect URL is not configured');
    }
    const accessToken = result.accessToken;
    const refreshToken = result.refreshToken;
    this.logger.log(`GET /auth/google/callback — redirecting to ${base}#access_token=...&refresh_token=... (lengths: ${accessToken.length}, ${refreshToken.length})`);
    const hash = `#access_token=${encodeURIComponent(accessToken)}&refresh_token=${encodeURIComponent(refreshToken)}`;
    return res.redirect(`${base}${hash}`);
  }
}
