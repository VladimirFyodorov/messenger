import { Repository } from 'typeorm';

import { ConflictException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { Block } from '../entities/block.entity';
import { BlockService } from './block.service';

describe('BlockService', () => {
  let service: BlockService;
  let repository: Repository<Block>;

  const mockBlock: Block = {
    id: '1',
    blockerId: '1',
    blockedUserId: '2',
    blocker: null,
    blockedUser: null,
    reason: 'Test reason',
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        {
          provide: getRepositoryToken(Block),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<BlockService>(BlockService);
    repository = module.get<Repository<Block>>(getRepositoryToken(Block));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('blockUser', () => {
    it('should block a user successfully', async () => {
      const createDto = { blockedUserId: '2', reason: 'Test' };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockBlock);
      mockRepository.save.mockResolvedValue(mockBlock);

      const result = await service.blockUser('1', createDto);

      expect(result).toEqual(mockBlock);
    });

    it('should throw ConflictException when blocking yourself', async () => {
      const createDto = { blockedUserId: '1', reason: 'Test' };

      await expect(service.blockUser('1', createDto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException when user already blocked', async () => {
      const createDto = { blockedUserId: '2', reason: 'Test' };

      mockRepository.findOne.mockResolvedValue(mockBlock);

      await expect(service.blockUser('1', createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('isBlocked', () => {
    it('should return true when user is blocked', async () => {
      mockRepository.findOne.mockResolvedValue(mockBlock);

      const result = await service.isBlocked('1', '2');

      expect(result).toBe(true);
    });

    it('should return false when user is not blocked', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.isBlocked('1', '2');

      expect(result).toBe(false);
    });
  });
});
