import { Repository } from 'typeorm';

import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateMemberRoleDto } from '../dto/update-member-role.dto';
import {
  ChatMember,
  ChatRole,
} from '../entities/chat-member.entity';
import { ChatsService } from './chats.service';

@Injectable()
export class ChatMembersService {
  constructor(
    @InjectRepository(ChatMember)
    private chatMembersRepository: Repository<ChatMember>,
    private chatsService: ChatsService,
  ) {}

  async addMember(chatId: string, userId: string, requesterId: string): Promise<ChatMember> {
    const requester = await this.chatsService.getChatMember(chatId, requesterId);
    if (requester.role !== ChatRole.OWNER && requester.role !== ChatRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to add members');
    }

    const existing = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });
    if (existing) {
      throw new ForbiddenException('User is already a member');
    }

    const member = this.chatMembersRepository.create({
      chatId,
      userId,
      role: ChatRole.MEMBER,
    });
    return this.chatMembersRepository.save(member);
  }

  async removeMember(
    chatId: string,
    userId: string,
    requesterId: string,
  ): Promise<void> {
    const requester = await this.chatsService.getChatMember(chatId, requesterId);
    const member = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });

    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.role === ChatRole.OWNER) {
      throw new ForbiddenException('Cannot remove owner');
    }

    if (requester.role !== ChatRole.OWNER && requester.role !== ChatRole.ADMIN) {
      throw new ForbiddenException('You do not have permission to remove members');
    }

    await this.chatMembersRepository.delete(member.id);
  }

  async getMembers(chatId: string): Promise<ChatMember[]> {
    return this.chatMembersRepository.find({
      where: { chatId },
      relations: ['user'],
    });
  }

  async updateMemberRole(
    chatId: string,
    userId: string,
    dto: UpdateMemberRoleDto,
    requesterId: string,
  ): Promise<ChatMember> {
    const requester = await this.chatsService.getChatMember(chatId, requesterId);
    if (requester.role !== ChatRole.OWNER) {
      throw new ForbiddenException('Only owner can change roles');
    }

    const member = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }

    if (member.role === ChatRole.OWNER && dto.role !== ChatRole.OWNER) {
      throw new ForbiddenException('Cannot change owner role');
    }

    member.role = dto.role;
    return this.chatMembersRepository.save(member);
  }

  async getMemberRole(chatId: string, userId: string): Promise<ChatRole> {
    const member = await this.chatMembersRepository.findOne({
      where: { chatId, userId },
    });
    if (!member) {
      throw new NotFoundException('Member not found');
    }
    return member.role;
  }
}
