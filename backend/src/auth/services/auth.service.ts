import * as bcrypt from 'bcrypt';

import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';

import { UsersService } from '../../users/users.service';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import { GoogleProfile } from '../strategies/google.strategy';
import { SessionService } from './session.service';
import { TokenService } from './token.service';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
    private sessionService: SessionService,
  ) {}

  async register(
    dto: RegisterDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    if (dto.password !== dto.confirmPassword) {
      throw new ConflictException('Passwords do not match');
    }

    if (!dto.password || dto.password.length < 8) {
      throw new ConflictException('Password must be at least 8 characters');
    }

    const existingUser = await this.usersService.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      password: hashedPassword,
    });

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
    });

    await this.sessionService.createSession(
      user.id,
      refreshToken,
      deviceInfo,
      ipAddress,
    );

    const { password, ...userWithoutPassword } = user;
    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    const { password: _, ...result } = user;
    return result;
  }

  async login(
    dto: LoginDto,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    const user = await this.validateUser(dto.email, dto.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
    });

    await this.sessionService.createSession(
      user.id,
      refreshToken,
      deviceInfo,
      ipAddress,
    );

    return {
      accessToken,
      refreshToken,
      user,
    };
  }

  async refreshToken(
    refreshToken: string,
    userId: string,
  ): Promise<{ accessToken: string }> {
    const session = await this.sessionService.findSessionByToken(
      userId,
      refreshToken,
    );
    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.usersService.findById(userId);
    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });

    return { accessToken };
  }

  async logout(sessionId: string): Promise<void> {
    await this.sessionService.revokeSession(sessionId);
  }

  async googleAuth(
    profile: GoogleProfile,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<AuthResponseDto> {
    this.logger.log(`googleAuth profile email=${profile.email} googleId=${profile.googleId}`);
    let user = await this.usersService.findByGoogleId(profile.googleId);
    if (user) {
      this.logger.log(`googleAuth found user by googleId id=${user.id}`);
      await this.usersService.updateFromGoogleProfile(user.id, {
        firstName: profile.firstName,
        lastName: profile.lastName,
        avatarUrl: profile.avatarUrl,
      });
      user = await this.usersService.findById(user.id);
    } else {
      const byEmail = await this.usersService.findByEmail(profile.email);
      if (byEmail) {
        this.logger.log(`googleAuth linked existing user by email id=${byEmail.id}`);
        await this.usersService.updateGoogleId(byEmail.id, profile.googleId);
        await this.usersService.updateFromGoogleProfile(byEmail.id, {
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        });
        user = await this.usersService.findById(byEmail.id);
      } else {
        user = await this.usersService.create({
          email: profile.email,
          googleId: profile.googleId,
          firstName: profile.firstName,
          lastName: profile.lastName,
          avatarUrl: profile.avatarUrl,
        });
        this.logger.log(`googleAuth created new user id=${user.id}`);
      }
    }

    const accessToken = await this.tokenService.generateAccessToken({
      sub: user.id,
      email: user.email,
    });
    const refreshToken = await this.tokenService.generateRefreshToken({
      sub: user.id,
    });
    await this.sessionService.createSession(
      user.id,
      refreshToken,
      deviceInfo,
      ipAddress,
    );

    const { password: _, ...userWithoutPassword } = user;
    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }
}
