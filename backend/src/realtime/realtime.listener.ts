import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { RealtimeService } from './services/realtime.service';

@Injectable()
export class RealtimeListener {
  constructor(private realtimeService: RealtimeService) {}

  @OnEvent('message.created')
  onMessageCreated(payload: { chatId: string; message: any }) {
    this.realtimeService.emitMessage(payload.chatId, this.toMessageDto(payload.message));
  }

  @OnEvent('chat.created')
  onChatCreated(payload: { chat: any; memberIds: string[] }) {
    const dto = this.toChatDto(payload.chat);
    this.realtimeService.emitToUsers(payload.memberIds, 'chat:created', dto);
  }

  private toMessageDto(m: any) {
    return {
      id: m.id,
      chatId: m.chatId,
      senderId: m.senderId,
      content: m.content,
      status: m.status,
      deleted: m.deleted ?? false,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
      sender: m.sender
        ? {
            id: m.sender.id,
            email: m.sender.email,
            firstName: m.sender.firstName,
            lastName: m.sender.lastName,
            avatarUrl: m.sender.avatarUrl,
          }
        : null,
    };
  }

  private toChatDto(c: any) {
    return {
      id: c.id,
      name: c.name,
      type: c.type,
      description: c.description,
      avatarUrl: c.avatarUrl,
      members: c.members,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
    };
  }
}
