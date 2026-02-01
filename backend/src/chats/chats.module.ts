import {
  forwardRef,
  Module,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { ChatsController } from './chats.controller';
import { ChatMember } from './entities/chat-member.entity';
import { Chat } from './entities/chat.entity';
import { ChatMembersService } from './services/chat-members.service';
import { ChatsService } from './services/chats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Chat, ChatMember]),
    forwardRef(() => AuthModule),
    forwardRef(() => UsersModule),
  ],
  controllers: [ChatsController],
  providers: [ChatsService, ChatMembersService],
  exports: [ChatsService],
})
export class ChatsModule {}
