import { Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UsersService } from '../../users/users.service';
import {
  ChatMember,
  ChatRole,
} from '../entities/chat-member.entity';
import { Chat } from '../entities/chat.entity';
import { ChatsService } from './chats.service';

describe('ChatsService', () => {
  let service: ChatsService;
  let chatRepository: Repository<Chat>;
  let chatMemberRepository: Repository<ChatMember>;

  const mockChat: Chat = {
    id: '1',
    name: 'Test Chat',
    type: 'group' as any,
    description: null,
    avatarUrl: null,
    members: [],
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChatMember: ChatMember = {
    id: '1',
    chatId: '1',
    userId: '1',
    role: ChatRole.OWNER,
    chat: mockChat,
    user: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockChatRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  const mockChatMemberRepository = {
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockUsersService = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatsService,
        {
          provide: getRepositoryToken(Chat),
          useValue: mockChatRepository,
        },
        {
          provide: getRepositoryToken(ChatMember),
          useValue: mockChatMemberRepository,
        },
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<ChatsService>(ChatsService);
    chatRepository = module.get<Repository<Chat>>(getRepositoryToken(Chat));
    chatMemberRepository = module.get<Repository<ChatMember>>(
      getRepositoryToken(ChatMember),
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createChat', () => {
    it('should create a chat with owner and members', async () => {
      const createDto = {
        name: 'New Chat',
        type: 'group' as any,
        memberIds: ['2', '3'],
      };

      mockChatRepository.create.mockReturnValue(mockChat);
      mockChatRepository.save.mockResolvedValue(mockChat);
      mockChatRepository.findOne.mockResolvedValue({
        ...mockChat,
        members: [mockChatMember],
      });
      mockChatMemberRepository.save.mockResolvedValue(mockChatMember);

      const result = await service.createChat('1', createDto);

      expect(result).toBeDefined();
      expect(mockChatRepository.create).toHaveBeenCalled();
      expect(mockChatMemberRepository.save).toHaveBeenCalledTimes(3); // owner + 2 members
    });
  });

  describe('findById', () => {
    it('should return a chat when found', async () => {
      mockChatRepository.findOne.mockResolvedValue(mockChat);

      const result = await service.findById('1');

      expect(result).toEqual(mockChat);
    });

    it('should throw NotFoundException when chat not found', async () => {
      mockChatRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('isUserMember', () => {
    it('should return true when user is a member', async () => {
      mockChatMemberRepository.findOne.mockResolvedValue(mockChatMember);

      const result = await service.isUserMember('1', '1');

      expect(result).toBe(true);
    });

    it('should return false when user is not a member', async () => {
      mockChatMemberRepository.findOne.mockResolvedValue(null);

      const result = await service.isUserMember('1', '2');

      expect(result).toBe(false);
    });
  });
});
