import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Message,
  MessageStatus,
} from '../entities/message.entity';

@Injectable()
export class MessageStatusService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
  ) {}

  async markAsSent(messageId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }
    message.status = MessageStatus.SENT;
    return this.messagesRepository.save(message);
  }

  async markAsDelivered(messageId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }
    message.status = MessageStatus.DELIVERED;
    return this.messagesRepository.save(message);
  }

  async markAsRead(messageId: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }
    message.status = MessageStatus.READ;
    return this.messagesRepository.save(message);
  }

  async getMessageStatus(messageId: string): Promise<MessageStatus> {
    const message = await this.messagesRepository.findOne({
      where: { id: messageId },
    });
    if (!message) {
      throw new Error('Message not found');
    }
    return message.status;
  }

  async getUnreadCount(chatId: string, userId: string): Promise<number> {
    return this.messagesRepository.count({
      where: {
        chatId,
        status: MessageStatus.DELIVERED,
      },
    });
  }
}
