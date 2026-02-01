import { Request as ExpressRequest, Response } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthService } from './services/auth.service';
import { SessionService } from './services/session.service';
import { GoogleProfile } from './strategies/google.strategy';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private sessionService: SessionService,
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
    // Guard redirects to Google; handler unused
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(
    @Request() req: ExpressRequest & { user: GoogleProfile },
    @Res() res: Response,
  ) {
    const result = await this.authService.googleAuth(
      req.user,
      req.headers['user-agent'] as string,
      req.ip,
    );
    const base = process.env.OAUTH_SUCCESS_REDIRECT_URL ?? 'http://localhost:3001';
    const q = new URLSearchParams({
      access_token: result.accessToken,
      refresh_token: result.refreshToken,
    });
    return res.redirect(`${base}?${q.toString()}`);
  }
}
