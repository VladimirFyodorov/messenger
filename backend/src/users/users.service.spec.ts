import { Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { SessionService } from '../auth/services/session.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser: User = {
    id: '1',
    email: 'test@example.com',
    password: 'hashed',
    googleId: null,
    firstName: 'Test',
    lastName: 'User',
    avatarUrl: null,
    settings: {},
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    remove: jest.fn(),
  };

  const mockSessionService = {
    revokeAllSessions: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
        {
          provide: SessionService,
          useValue: mockSessionService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findById', () => {
    it('should return a user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findById('1');

      expect(result).toEqual(mockUser);
      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByEmail', () => {
    it('should return a user when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByEmail('test@example.com');

      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const result = await service.findByEmail('test@example.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return a user', async () => {
      const userData = { email: 'new@example.com', password: 'hashed' };
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(userData);

      expect(result).toEqual(mockUser);
      expect(mockRepository.create).toHaveBeenCalledWith(userData);
      expect(mockRepository.save).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('updateProfile', () => {
    it('should update and return user profile', async () => {
      const updateDto = { firstName: 'Updated' };
      const updatedUser = { ...mockUser, ...updateDto };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateProfile('1', updateDto);

      expect(result).toEqual(updatedUser);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('deleteAccount', () => {
    it('should revoke all sessions and remove user', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockSessionService.revokeAllSessions.mockResolvedValue(undefined);
      mockRepository.remove.mockResolvedValue(mockUser);

      await service.deleteAccount('1');

      expect(mockSessionService.revokeAllSessions).toHaveBeenCalledWith('1');
      expect(mockRepository.remove).toHaveBeenCalledWith(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.deleteAccount('1')).rejects.toThrow(NotFoundException);
      expect(mockSessionService.revokeAllSessions).not.toHaveBeenCalled();
    });
  });
});
