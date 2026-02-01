import { Injectable } from '@nestjs/common';

@Injectable()
export class TypingService {
  private typingUsers = new Map<string, Set<string>>(); // chatId -> Set<userId>

  startTyping(chatId: string, userId: string): void {
    if (!this.typingUsers.has(chatId)) {
      this.typingUsers.set(chatId, new Set());
    }
    this.typingUsers.get(chatId)!.add(userId);
  }

  stopTyping(chatId: string, userId: string): void {
    this.typingUsers.get(chatId)?.delete(userId);
  }

  getTypingUsers(chatId: string): string[] {
    return Array.from(this.typingUsers.get(chatId) || []);
  }

  clearTyping(chatId: string): void {
    this.typingUsers.delete(chatId);
  }
}
