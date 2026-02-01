import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { ChatsModule } from './chats/chats.module';
import { ConfigurationModule } from './config';
import { FilesModule } from './files/files.module';
import { MessagesModule } from './messages/messages.module';
import { ModerationModule } from './moderation/moderation.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ObservabilityModule } from './observability/observability.module';
import { RealtimeModule } from './realtime/realtime.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigurationModule,
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('infra.db.host') ?? 'localhost',
        port: config.get<number>('infra.db.port') ?? 5432,
        username: config.get<string>('infra.db.username') ?? 'postgres',
        password: config.get<string>('infra.db.password') ?? 'postgres',
        database: config.get<string>('infra.db.database') ?? 'messenger',
        autoLoadEntities: true,
        synchronize: config.get<boolean>('infra.db.synchronize') ?? true,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        redis: {
          host: config.get<string>('infra.redis.host') ?? 'localhost',
          port: config.get<number>('infra.redis.port') ?? 6379,
          password: config.get<string>('infra.redis.password') || undefined,
        },
      }),
      inject: [ConfigService],
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
