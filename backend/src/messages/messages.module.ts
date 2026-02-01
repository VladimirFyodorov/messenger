import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { ChatsModule } from '../chats/chats.module';
import { Message } from './entities/message.entity';
import { MessagesController } from './messages.controller';
import { MessageStatusService } from './services/message-status.service';
import { MessagesService } from './services/messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([Message]), AuthModule, ChatsModule],
  controllers: [MessagesController],
  providers: [MessagesService, MessageStatusService],
  exports: [MessagesService],
})
export class MessagesModule {}
