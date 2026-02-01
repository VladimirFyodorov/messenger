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
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { MessageStatusService } from './services/message-status.service';
import { MessagesService } from './services/messages.service';

@Controller('chats/:chatId/messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(
    private messagesService: MessagesService,
    private messageStatusService: MessageStatusService,
  ) {}

  @Post()
  async createMessage(
    @Param('chatId') chatId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() dto: CreateMessageDto,
  ) {
    return this.messagesService.createMessage(chatId, req.user.id, dto);
  }

  @Get()
  async getMessages(
    @Param('chatId') chatId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.messagesService.getChatMessages(
      chatId,
      req.user.id,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get(':id')
  async getMessage(@Param('chatId') chatId: string, @Param('id') id: string) {
    return this.messagesService.findById(id);
  }

  @Patch(':id')
  async updateMessage(
    @Param('chatId') chatId: string,
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() dto: UpdateMessageDto,
  ) {
    return this.messagesService.updateMessage(chatId, id, req.user.id, dto);
  }

  @Delete(':id')
  async deleteMessage(
    @Param('chatId') chatId: string,
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: { id: string } },
  ) {
    await this.messagesService.deleteMessage(chatId, id, req.user.id);
    return { message: 'Message deleted' };
  }

  @Post(':id/read')
  async markAsRead(@Param('id') id: string) {
    return this.messageStatusService.markAsRead(id);
  }
}
