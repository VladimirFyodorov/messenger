import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { ChatsService } from '../../chats/services/chats.service';
import { CreateMessageDto } from '../dto/create-message.dto';
import { UpdateMessageDto } from '../dto/update-message.dto';
import {
  Message,
  MessageStatus,
} from '../entities/message.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Message)
    private messagesRepository: Repository<Message>,
    private chatsService: ChatsService,
    private eventEmitter: EventEmitter2,
  ) {}

  async createMessage(
    chatId: string,
    senderId: string,
    dto: CreateMessageDto,
  ): Promise<Message> {
    const isMember = await this.chatsService.isUserMember(chatId, senderId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    const message = this.messagesRepository.create({
      chatId,
      senderId,
      content: dto.content,
      status: MessageStatus.SENT,
    });

    const saved = await this.messagesRepository.save(message);
    const full = await this.findById(saved.id);
    this.eventEmitter.emit('message.created', { chatId, message: full });
    return full;
  }

  async findById(id: string): Promise<Message> {
    const message = await this.messagesRepository.findOne({
      where: { id },
      relations: ['sender', 'chat'],
    });
    if (!message) {
      throw new NotFoundException('Message not found');
    }
    return message;
  }

  async getChatMessages(
    chatId: string,
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Message[]> {
    const isMember = await this.chatsService.isUserMember(chatId, userId);
    if (!isMember) {
      throw new ForbiddenException('You are not a member of this chat');
    }

    return this.messagesRepository.find({
      where: { chatId, deleted: false },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async updateMessage(
    chatId: string,
    messageId: string,
    userId: string,
    dto: UpdateMessageDto,
  ): Promise<Message> {
    const message = await this.findById(messageId);
    if (message.chatId !== chatId) {
      throw new NotFoundException('Message not found in this chat');
    }
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only edit your own messages');
    }

    message.content = dto.content;
    return this.messagesRepository.save(message);
  }

  async deleteMessage(
    chatId: string,
    messageId: string,
    userId: string,
  ): Promise<void> {
    const message = await this.findById(messageId);
    if (message.chatId !== chatId) {
      throw new NotFoundException('Message not found in this chat');
    }
    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    message.deleted = true;
    await this.messagesRepository.save(message);
  }
}
