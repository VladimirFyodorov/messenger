import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
  NotificationPreference,
} from '../entities/notification-preference.entity';
import {
  NotificationChannel,
  NotificationType,
} from '../entities/notification.entity';

@Injectable()
export class NotificationPreferencesService {
  constructor(
    @InjectRepository(NotificationPreference)
    private preferencesRepository: Repository<NotificationPreference>,
  ) {}

  async getPreferences(userId: string): Promise<NotificationPreference[]> {
    return this.preferencesRepository.find({ where: { userId } });
  }

  async updatePreferences(
    userId: string,
    type: NotificationType,
    channels: Record<NotificationChannel, boolean>,
    enabled: boolean,
  ): Promise<NotificationPreference> {
    let preference = await this.preferencesRepository.findOne({
      where: { userId, type },
    });

    if (!preference) {
      preference = this.preferencesRepository.create({
        userId,
        type,
        channels,
        enabled,
      });
    } else {
      preference.channels = channels;
      preference.enabled = enabled;
    }

    return this.preferencesRepository.save(preference);
  }

  async shouldSendNotification(
    userId: string,
    type: NotificationType,
    channel: NotificationChannel,
  ): Promise<boolean> {
    const preference = await this.preferencesRepository.findOne({
      where: { userId, type },
    });

    if (!preference || !preference.enabled) {
      return false;
    }

    return preference.channels[channel] === true;
  }

  getDefaultPreferences(): Record<NotificationChannel, boolean> {
    return {
      [NotificationChannel.IN_APP]: true,
      [NotificationChannel.PUSH]: true,
      [NotificationChannel.EMAIL]: false,
    };
  }
}
