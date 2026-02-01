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
import { CreateBlockDto } from './dto/create-block.dto';
import { CreateReportDto } from './dto/create-report.dto';
import { ReportStatus } from './entities/report.entity';
import { BlockService } from './services/block.service';
import { ReportService } from './services/report.service';

@Controller('moderation')
@UseGuards(JwtAuthGuard)
export class ModerationController {
  constructor(
    private reportService: ReportService,
    private blockService: BlockService,
  ) {}

  @Post('reports')
  async createReport(@Request() req: ExpressRequest & { user: { id: string } }, @Body() dto: CreateReportDto) {
    return this.reportService.createReport(req.user.id, dto);
  }

  @Get('reports')
  async getReports(
    @Query('status') status?: ReportStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.reportService.getReports(
      status,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Patch('reports/:id')
  async processReport(
    @Param('id') id: string,
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() body: { status: ReportStatus },
  ) {
    return this.reportService.updateReportStatus(
      id,
      body.status,
      req.user.id,
    );
  }

  @Post('blocks')
  async blockUser(@Request() req: ExpressRequest & { user: { id: string } }, @Body() dto: CreateBlockDto) {
    return this.blockService.blockUser(req.user.id, dto);
  }

  @Delete('blocks/:userId')
  async unblockUser(
    @Param('userId') userId: string,
    @Request() req: ExpressRequest & { user: { id: string } },
  ) {
    await this.blockService.unblockUser(req.user.id, userId);
    return { message: 'User unblocked' };
  }

  @Get('blocks')
  async getBlocks(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.blockService.getBlockedUsers(req.user.id);
  }
}
