import { Job } from 'bull';

import {
  Process,
  Processor,
} from '@nestjs/bull';

import { NotificationsService } from '../services/notifications.service';

@Processor('notifications')
export class NotificationProcessor {
  constructor(private notificationsService: NotificationsService) {}

  @Process('send')
  async handleSendNotification(job: Job) {
    const { notificationId, userId, type, title, body, data } = job.data;

    // In a real implementation, this would send via different channels
    // (push, email, etc.) based on user preferences
    console.log(`Sending notification ${notificationId} to user ${userId}`);

    return { success: true, notificationId };
  }
}
