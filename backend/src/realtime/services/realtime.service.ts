import { Server } from 'socket.io';

import { Injectable } from '@nestjs/common';

@Injectable()
export class RealtimeService {
  private server: Server;

  setServer(server: Server) {
    this.server = server;
  }

  emitMessage(chatId: string, message: any) {
    this.server.to(`chat:${chatId}`).emit('message:new', message);
  }

  emitTyping(chatId: string, userId: string, isTyping: boolean) {
    this.server.to(`chat:${chatId}`).emit('typing:update', {
      userId,
      isTyping,
    });
  }

  emitPresenceUpdate(userId: string, status: 'online' | 'offline') {
    this.server.emit('presence:update', { userId, status });
  }

  joinChatRoom(socketId: string, chatId: string) {
    this.server.sockets.sockets.get(socketId)?.join(`chat:${chatId}`);
  }

  leaveChatRoom(socketId: string, chatId: string) {
    this.server.sockets.sockets.get(socketId)?.leave(`chat:${chatId}`);
  }

  broadcastToChat(chatId: string, event: string, data: any) {
    this.server.to(`chat:${chatId}`).emit(event, data);
  }
}
