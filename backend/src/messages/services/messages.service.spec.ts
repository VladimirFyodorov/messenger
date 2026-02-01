import { Repository } from 'typeorm';

import { ForbiddenException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { ChatsService } from '../../chats/services/chats.service';
import {
  Message,
  MessageStatus,
} from '../entities/message.entity';
import { MessagesService } from './messages.service';

describe('MessagesService', () => {
  let service: MessagesService;
  let messageRepository: Repository<Message>;
  let chatsService: ChatsService;

  const mockMessage: Message = {
    id: '1',
    chatId: '1',
    senderId: '1',
    content: 'Test message',
    status: MessageStatus.SENT,
    deleted: false,
    chat: null,
    sender: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockMessageRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    find: jest.fn(),
  };

  const mockChatsService = {
    isUserMember: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        {
          provide: getRepositoryToken(Message),
          useValue: mockMessageRepository,
        },
        {
          provide: ChatsService,
          useValue: mockChatsService,
        },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
    messageRepository = module.get<Repository<Message>>(
      getRepositoryToken(Message),
    );
    chatsService = module.get<ChatsService>(ChatsService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('createMessage', () => {
    it('should create a message when user is a member', async () => {
      const createDto = { content: 'New message' };

      mockChatsService.isUserMember.mockResolvedValue(true);
      mockMessageRepository.create.mockReturnValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(mockMessage);

      const result = await service.createMessage('1', '1', createDto);

      expect(result).toEqual(mockMessage);
      expect(mockMessageRepository.create).toHaveBeenCalled();
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      const createDto = { content: 'New message' };

      mockChatsService.isUserMember.mockResolvedValue(false);

      await expect(
        service.createMessage('1', '2', createDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getChatMessages', () => {
    it('should return messages when user is a member', async () => {
      mockChatsService.isUserMember.mockResolvedValue(true);
      mockMessageRepository.find.mockResolvedValue([mockMessage]);

      const result = await service.getChatMessages('1', '1', 50, 0);

      expect(result).toEqual([mockMessage]);
    });

    it('should throw ForbiddenException when user is not a member', async () => {
      mockChatsService.isUserMember.mockResolvedValue(false);

      await expect(
        service.getChatMessages('1', '2', 50, 0),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('updateMessage', () => {
    it('should update message when user is the sender', async () => {
      const updateDto = { content: 'Updated message' };
      const updatedMessage = { ...mockMessage, content: 'Updated message' };

      mockMessageRepository.findOne.mockResolvedValue(mockMessage);
      mockMessageRepository.save.mockResolvedValue(updatedMessage);

      const result = await service.updateMessage('1', '1', '1', updateDto);

      expect(result.content).toBe('Updated message');
    });

    it('should throw ForbiddenException when user is not the sender', async () => {
      const updateDto = { content: 'Updated message' };

      mockMessageRepository.findOne.mockResolvedValue(mockMessage);

      await expect(
        service.updateMessage('1', '1', '2', updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });
});
