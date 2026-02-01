import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateReportDto } from '../dto/create-report.dto';
import {
  Report,
  ReportStatus,
} from '../entities/report.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
  ) {}

  async createReport(reporterId: string, dto: CreateReportDto): Promise<Report> {
    const report = this.reportsRepository.create({
      reporterId,
      type: dto.type,
      reason: dto.reason,
      reportedUserId: dto.reportedUserId,
      reportedMessageId: dto.reportedMessageId,
      reportedChatId: dto.reportedChatId,
      status: ReportStatus.PENDING,
    });

    return this.reportsRepository.save(report);
  }

  async getReport(id: string): Promise<Report> {
    const report = await this.reportsRepository.findOne({
      where: { id },
      relations: ['reporter', 'reportedUser', 'moderator'],
    });
    if (!report) {
      throw new NotFoundException('Report not found');
    }
    return report;
  }

  async getReports(
    status?: ReportStatus,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Report[]> {
    const where = status ? { status } : {};
    return this.reportsRepository.find({
      where,
      relations: ['reporter', 'reportedUser'],
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getUserReports(userId: string): Promise<Report[]> {
    return this.reportsRepository.find({
      where: { reporterId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  async updateReportStatus(
    id: string,
    status: ReportStatus,
    moderatorId: string,
  ): Promise<Report> {
    const report = await this.getReport(id);
    report.status = status;
    report.moderatorId = moderatorId;
    return this.reportsRepository.save(report);
  }

  async resolveReport(id: string, moderatorId: string): Promise<Report> {
    return this.updateReportStatus(id, ReportStatus.RESOLVED, moderatorId);
  }
}
