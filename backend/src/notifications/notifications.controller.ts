import { Request as ExpressRequest } from 'express';

import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import {
  NotificationChannel,
  NotificationType,
} from './entities/notification.entity';
import {
  NotificationPreferencesService,
} from './services/notification-preferences.service';
import { NotificationsService } from './services/notifications.service';

@Controller('notifications')
@UseGuards(JwtAuthGuard)
export class NotificationsController {
  constructor(
    private notificationsService: NotificationsService,
    private preferencesService: NotificationPreferencesService,
  ) {}

  @Get()
  async getNotifications(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.notificationsService.getUserNotifications(
      req.user.id,
      limit ? parseInt(limit, 10) : 50,
      offset ? parseInt(offset, 10) : 0,
    );
  }

  @Get(':id')
  async getNotification(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: string } }) {
    return this.notificationsService.getNotification(id, req.user.id);
  }

  @Patch(':id/read')
  async markAsRead(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: string } }) {
    return this.notificationsService.markAsRead(id, req.user.id);
  }

  @Delete(':id')
  async deleteNotification(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: string } }) {
    await this.notificationsService.deleteNotification(id, req.user.id);
    return { message: 'Notification deleted' };
  }

  @Get('preferences')
  async getPreferences(@Request() req: ExpressRequest & { user: { id: string } }) {
    return this.preferencesService.getPreferences(req.user.id);
  }

  @Patch('preferences')
  async updatePreferences(
    @Request() req: ExpressRequest & { user: { id: string } },
    @Body() body: {
      type: NotificationType;
      channels: Record<NotificationChannel, boolean>;
      enabled: boolean;
    },
  ) {
    return this.preferencesService.updatePreferences(
      req.user.id,
      body.type,
      body.channels,
      body.enabled,
    );
  }
}
