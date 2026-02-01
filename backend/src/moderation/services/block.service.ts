import { Repository } from 'typeorm';

import {
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateBlockDto } from '../dto/create-block.dto';
import { Block } from '../entities/block.entity';

@Injectable()
export class BlockService {
  constructor(
    @InjectRepository(Block)
    private blocksRepository: Repository<Block>,
  ) {}

  async blockUser(blockerId: string, dto: CreateBlockDto): Promise<Block> {
    if (blockerId === dto.blockedUserId) {
      throw new ConflictException('Cannot block yourself');
    }

    const existing = await this.blocksRepository.findOne({
      where: { blockerId, blockedUserId: dto.blockedUserId },
    });

    if (existing) {
      throw new ConflictException('User is already blocked');
    }

    const block = this.blocksRepository.create({
      blockerId,
      blockedUserId: dto.blockedUserId,
      reason: dto.reason,
    });

    return this.blocksRepository.save(block);
  }

  async unblockUser(blockerId: string, blockedUserId: string): Promise<void> {
    await this.blocksRepository.delete({ blockerId, blockedUserId });
  }

  async isBlocked(blockerId: string, blockedUserId: string): Promise<boolean> {
    const block = await this.blocksRepository.findOne({
      where: { blockerId, blockedUserId },
    });
    return !!block;
  }

  async getBlockedUsers(userId: string): Promise<Block[]> {
    return this.blocksRepository.find({
      where: { blockerId: userId },
      relations: ['blockedUser'],
    });
  }

  async getBlockedByUsers(userId: string): Promise<Block[]> {
    return this.blocksRepository.find({
      where: { blockedUserId: userId },
      relations: ['blocker'],
    });
  }
}
