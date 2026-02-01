import { Request as ExpressRequest } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { ChatMembersService } from './services/chat-members.service';
import { ChatsService } from './services/chats.service';

@Controller('chats')
@UseGuards(JwtAuthGuard)
export class ChatsController {
  constructor(
    private chatsService: ChatsService,
    private chatMembersService: ChatMembersService,
  ) {}

  @Post()
  async createChat(@Request() req: ExpressRequest & { user: { id: string } }, @Body() dto: CreateChatDto) {
    return this.chatsService.createChat(req.user.id, dto);
  }

  @Get()
  async getChats(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.chatsService.getUserChats(req.user.id);
  }

  @Get('search')
  async searchChats(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Query('q') q: string,
  ) {
    return this.chatsService.searchChats(req.user.id, q ?? '');
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatsService.findById(id);
  }

  @Patch(':id')
  async updateChat(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() dto: UpdateChatDto,
  ) {
    return this.chatsService.updateChat(id, req.user.id, dto);
  }

  @Delete(':id')
  async deleteChat(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: string } }) {
    await this.chatsService.deleteChat(id, req.user.id);
    return { message: 'Chat deleted' };
  }

  @Post(':id/members')
  async addMember(
    @Param('id') chatId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() body: { userId: string },
  ) {
    return this.chatMembersService.addMember(chatId, body.userId, req.user.id);
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') chatId: string,
    @Param('userId') userId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
  ) {
    await this.chatMembersService.removeMember(chatId, userId, req.user.id);
    return { message: 'Member removed' };
  }

  @Patch(':id/members/:userId/role')
  async updateMemberRole(
    @Param('id') chatId: string,
    @Param('userId') userId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.chatMembersService.updateMemberRole(
      chatId,
      userId,
      dto,
      req.user.id,
    );
  }

  @Get(':id/members')
  async getMembers(@Param('id') chatId: string) {
    return this.chatMembersService.getMembers(chatId);
  }
}
