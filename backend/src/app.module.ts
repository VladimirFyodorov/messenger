import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { FilesModule } from './files/files.module';
import { MessagesModule } from './messages/messages.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ObservabilityModule } from './observability/observability.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST ?? 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER ?? 'postgres',
      password: process.env.DB_PASSWORD ?? 'postgres',
      database: process.env.DB_NAME ?? 'messenger',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production',
    }),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST ?? 'localhost',
        port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
      },
    }),
    AuthModule,
    UsersModule,
    ChatsModule,
    MessagesModule,
    RealtimeModule,
    FilesModule,
    NotificationsModule,
    ModerationModule,
    ObservabilityModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
