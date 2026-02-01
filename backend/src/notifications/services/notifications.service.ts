import { Queue } from 'bull';
import { Repository } from 'typeorm';

import { InjectQueue } from '@nestjs/bull';
import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  Notification,
  NotificationType,
} from '../entities/notification.entity';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Notification)
    private notificationsRepository: Repository<Notification>,
    @InjectQueue('notifications')
    private notificationsQueue: Queue,
  ) {}

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    const notification = this.notificationsRepository.create({
      userId,
      type,
      title,
      body,
      data: data || {},
      read: false,
    });

    const saved = await this.notificationsRepository.save(notification);

    // Add to queue for delivery
    await this.notificationsQueue.add('send', {
      notificationId: saved.id,
      userId,
      type,
      title,
      body,
      data,
    });

    return saved;
  }

  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0,
  ): Promise<Notification[]> {
    return this.notificationsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
      skip: offset,
    });
  }

  async getNotification(id: string, userId: string): Promise<Notification> {
    const notification = await this.notificationsRepository.findOne({
      where: { id, userId },
    });
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    return notification;
  }

  async markAsRead(id: string, userId: string): Promise<Notification> {
    const notification = await this.getNotification(id, userId);
    notification.read = true;
    return this.notificationsRepository.save(notification);
  }

  async deleteNotification(id: string, userId: string): Promise<void> {
    const notification = await this.getNotification(id, userId);
    await this.notificationsRepository.delete(notification.id);
  }

  async sendNotification(
    userId: string,
    type: NotificationType,
    title: string,
    body: string,
    data?: Record<string, any>,
  ): Promise<Notification> {
    return this.createNotification(userId, type, title, body, data);
  }
}
