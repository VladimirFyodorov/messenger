import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UsersService } from '../../users/users.service';
import { CreateChatDto } from '../dto/create-chat.dto';
import { UpdateChatDto } from '../dto/update-chat.dto';
import {
  ChatMember,
  ChatRole,
} from '../entities/chat-member.entity';
import { Chat } from '../entities/chat.entity';

@Injectable()
export class ChatsService {
  constructor(
    @InjectRepository(Chat)
    private chatsRepository: Repository<Chat>,
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    private usersService: UsersService,
  ) {}

  async createChat(userId: string, dto: CreateChatDto): Promise<Chat> {
    const chat = this.chatsRepository.create({
      name: dto.name,
      type: dto.type,
      description: dto.description,
    });
    const savedChat = await this.chatsRepository.save(chat);

    // Add creator as owner
    await this.chatMembersRepository.save({
      chatId: savedChat.id,
      userId,
      role: ChatRole.OWNER,
    });

    // Add other members
    for (const memberId of dto.memberIds) {
      if (memberId !== userId) {
        await this.chatMembersRepository.save({
          chatId: savedChat.id,
          userId: memberId,
          role: ChatRole.MEMBER,
        });
      }
    }

    return this.findById(savedChat.id);
  }

  async findById(id: string): Promise<Chat> {
    const chat = await this.chatsRepository.findOne({
      where: { id },
      relations: ['members', 'members.user'],
    });
    if (!chat) {
      throw new NotFoundException('Chat not found');
    }
    return chat;
  }

  async getUserChats(userId: string): Promise<Chat[]> {
    const members = await this.chatMembersRepository.find({
      where: { userId },
      relations: ['chat', 'chat.members', 'chat.members.user'],
    });
    return members.map((member) => member.chat);
  }

  async updateChat(
    chatId: string,
    userId: string,
    dto: UpdateChatDto,
  ): Promise<Chat> {
    const member = await this.getChatMember(chatId, userId);
    if (!this.canEditChat(member.role)) {
      throw new ForbiddenException('You do not have permission to edit this chat');
    }

    const chat = await this.findById(chatId);
    Object.assign(chat, dto);
    return this.chatsRepository.save(chat);
  }

  async deleteChat(chatId: string, userId: string): Promise<void> {
    const member = await this.getChatMember(chatId, userId);
    if (member.role !== ChatRole.OWNER) {
      throw new ForbiddenException('Only owner can delete the chat');
    }
    await this.chatsRepository.delete(chatId);
  }

  async isUserMember(chatId: string, userId: string): Promise<boolean> {
    const member = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });
    return !!member;
  }

  async getChatMember(chatId: string, userId: string): Promise<ChatMember> {
    const member = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });
    if (!member) {
      throw new ForbiddenException('You are not a member of this chat');
    }
    return member;
  }

  private canEditChat(role: ChatRole): boolean {
    return role === ChatRole.OWNER || role === ChatRole.ADMIN;
  }
}
