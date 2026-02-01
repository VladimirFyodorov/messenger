import { Injectable } from '@nestjs/common';

@Injectable()
export class PresenceService {
  private onlineUsers = new Set<string>();

  setOnline(userId: string): void {
    this.onlineUsers.add(userId);
  }

  setOffline(userId: string): void {
    this.onlineUsers.delete(userId);
  }

  getUserStatus(userId: string): 'online' | 'offline' {
    return this.onlineUsers.has(userId) ? 'online' : 'offline';
  }

  getOnlineUsers(): string[] {
    return Array.from(this.onlineUsers);
  }

  trackUserActivity(userId: string): void {
    this.setOnline(userId);
  }
}
