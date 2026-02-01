import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RealtimeService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitMessage(chatId: string, message: unknown) {
    if (!this.server) return;
    this.server.to(`chat:${chatId}`).emit('message:new', message);
  }

  emitTyping(chatId: string, userId: string, isTyping: boolean) {
    if (!this.server) return;
    this.server.to(`chat:${chatId}`).emit('typing:update', {
      userId,
      isTyping,
    });
  }

  emitPresenceUpdate(userId: string, status: 'online' | 'offline') {
    if (!this.server) return;
    this.server.emit('presence:update', { userId, status });
  }

  joinChatRoom(socketId: string, chatId: string) {
    if (!this.server) return;
    this.server.sockets.sockets.get(socketId)?.join(`chat:${chatId}`);
  }

  leaveChatRoom(socketId: string, chatId: string) {
    if (!this.server) return;
    this.server.sockets.sockets.get(socketId)?.leave(`chat:${chatId}`);
  }

  broadcastToChat(chatId: string, event: string, data: unknown) {
    if (!this.server) return;
    this.server.to(`chat:${chatId}`).emit(event, data);
  }

  emitToUsers(userIds: string[], event: string, data: unknown) {
    if (!this.server) return;
    for (const uid of userIds) {
      this.server.to(`user:${uid}`).emit(event, data);
    }
  }
}
