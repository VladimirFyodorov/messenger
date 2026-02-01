import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { Block } from './entities/block.entity';
import { Report } from './entities/report.entity';
import { ModerationController } from './moderation.controller';
import { BlockService } from './services/block.service';
import { ReportService } from './services/report.service';

@Module({
  imports: [TypeOrmModule.forFeature([Report, Block]), AuthModule],
  controllers: [ModerationController],
  providers: [ReportService, BlockService],
  exports: [BlockService],
})
export class ModerationModule {}
