import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { asyncConfigFactory } from './config.factory';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [asyncConfigFactory],
    }),
  ],
})
export class ConfigurationModule {}
