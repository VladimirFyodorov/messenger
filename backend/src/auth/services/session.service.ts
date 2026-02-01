import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Session } from '../entities/session.entity';
import { TokenService } from './token.service';

@Injectable()
export class SessionService {
  constructor(
    @InjectRepository(Session)
    private sessionRepository: Repository<Session>,
    private tokenService: TokenService,
  ) {}

  async createSession(
    userId: string,
    refreshToken: string,
    deviceInfo?: string,
    ipAddress?: string,
  ): Promise<Session> {
    const hashedToken = await this.tokenService.hashRefreshToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

    const session = this.sessionRepository.create({
      userId,
      refreshToken: hashedToken,
      deviceInfo,
      ipAddress,
      expiresAt,
    });

    return this.sessionRepository.save(session);
  }

  async getUserSessions(userId: string): Promise<Session[]> {
    return this.sessionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findSessionByToken(
    userId: string,
    refreshToken: string,
  ): Promise<Session | null> {
    const sessions = await this.getUserSessions(userId);
    for (const session of sessions) {
      const isValid = await this.tokenService.validateRefreshToken(
        refreshToken,
        session.refreshToken,
      );
      if (isValid && session.expiresAt > new Date()) {
        return session;
      }
    }
    return null;
  }

  async revokeSession(sessionId: string): Promise<void> {
    await this.sessionRepository.delete(sessionId);
  }

  async revokeAllSessions(userId: string): Promise<void> {
    await this.sessionRepository.delete({ userId });
  }
}
