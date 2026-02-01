import {
  Server,
  Socket,
} from 'socket.io';

import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { ChatsService } from '../chats/services/chats.service';
import { MessagesService } from '../messages/services/messages.service';
import { PresenceService } from './services/presence.service';
import { RealtimeService } from './services/realtime.service';
import { TypingService } from './services/typing.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RealtimeGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  constructor(
    private realtimeService: RealtimeService,
    private presenceService: PresenceService,
    private typingService: TypingService,
    private messagesService: MessagesService,
    private chatsService: ChatsService,
  ) {}

  afterInit(server: Server) {
    this.realtimeService.setServer(server);
  }

  handleConnection(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (userId) {
      client.join(`user:${userId}`);
      this.presenceService.setOnline(userId);
      this.realtimeService.emitPresenceUpdate(userId, 'online');
    }
  }

  handleDisconnect(client: Socket) {
    const userId = client.handshake.auth?.userId;
    if (userId) {
      this.presenceService.setOffline(userId);
      this.realtimeService.emitPresenceUpdate(userId, 'offline');
    }
  }

  @SubscribeMessage('message:send')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; content: string },
  ) {
    const userId = client.handshake.auth?.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    try {
      const message = await this.messagesService.createMessage(
        data.chatId,
        userId,
        { content: data.content },
      );
      return { success: true, message };
    } catch (error) {
      return { error: error.message };
    }
  }

  @SubscribeMessage('message:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string; isTyping: boolean },
  ) {
    const userId = client.handshake.auth?.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    if (data.isTyping) {
      this.typingService.startTyping(data.chatId, userId);
    } else {
      this.typingService.stopTyping(data.chatId, userId);
    }

    this.realtimeService.emitTyping(data.chatId, userId, data.isTyping);
    return { success: true };
  }

  @SubscribeMessage('presence:update')
  handlePresenceUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { status: 'online' | 'offline' },
  ) {
    const userId = client.handshake.auth?.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    if (data.status === 'online') {
      this.presenceService.setOnline(userId);
    } else {
      this.presenceService.setOffline(userId);
    }

    this.realtimeService.emitPresenceUpdate(userId, data.status);
    return { success: true };
  }

  @SubscribeMessage('chat:join')
  handleChatJoin(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    const userId = client.handshake.auth?.userId;
    if (!userId) {
      return { error: 'Unauthorized' };
    }

    this.realtimeService.joinChatRoom(client.id, data.chatId);
    return { success: true };
  }

  @SubscribeMessage('chat:leave')
  handleChatLeave(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { chatId: string },
  ) {
    this.realtimeService.leaveChatRoom(client.id, data.chatId);
    return { success: true };
  }
}
