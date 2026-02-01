import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { googleId } });
  }

  async updateGoogleId(userId: string, googleId: string): Promise<User> {
    const user = await this.findById(userId);
    user.googleId = googleId;
    return this.usersRepository.save(user);
  }

  async updateFromGoogleProfile(
    userId: string,
    data: { firstName?: string | null; lastName?: string | null; avatarUrl?: string | null },
  ): Promise<User> {
    const user = await this.findById(userId);
    if (data.firstName !== undefined) user.firstName = data.firstName;
    if (data.lastName !== undefined) user.lastName = data.lastName;
    if (data.avatarUrl !== undefined) user.avatarUrl = data.avatarUrl;
    return this.usersRepository.save(user);
  }

  async create(userData: Partial<User>): Promise<User> {
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async updateProfile(userId: string, dto: UpdateProfileDto): Promise<User> {
    const user = await this.findById(userId);
    Object.assign(user, dto);
    return this.usersRepository.save(user);
  }

  async getProfile(userId: string): Promise<User> {
    return this.findById(userId);
  }

  async updateSettings(
    userId: string,
    settings: Record<string, any>,
  ): Promise<User> {
    const user = await this.findById(userId);
    user.settings = { ...user.settings, ...settings };
    return this.usersRepository.save(user);
  }

  async getSettings(userId: string): Promise<Record<string, any>> {
    const user = await this.findById(userId);
    return user.settings || {};
  }
}
