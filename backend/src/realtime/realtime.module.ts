import { Module } from '@nestjs/common';

import { ChatsModule } from '../chats/chats.module';
import { MessagesModule } from '../messages/messages.module';
import { RealtimeGateway } from './realtime.gateway';
import { PresenceService } from './services/presence.service';
import { RealtimeService } from './services/realtime.service';
import { TypingService } from './services/typing.service';

@Module({
  imports: [MessagesModule, ChatsModule],
  providers: [
    RealtimeGateway,
    RealtimeService,
    PresenceService,
    TypingService,
  ],
  exports: [RealtimeService],
})
export class RealtimeModule {}
