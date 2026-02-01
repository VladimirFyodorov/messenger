import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { TypingService } from './typing.service';

describe('TypingService', () => {
  let service: TypingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TypingService],
    }).compile();

    service = module.get<TypingService>(TypingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('startTyping', () => {
    it('should add user to typing list', () => {
      service.startTyping('chat1', 'user1');
      const typingUsers = service.getTypingUsers('chat1');
      expect(typingUsers).toContain('user1');
    });
  });

  describe('stopTyping', () => {
    it('should remove user from typing list', () => {
      service.startTyping('chat1', 'user1');
      service.stopTyping('chat1', 'user1');
      const typingUsers = service.getTypingUsers('chat1');
      expect(typingUsers).not.toContain('user1');
    });
  });

  describe('clearTyping', () => {
    it('should clear all typing users for a chat', () => {
      service.startTyping('chat1', 'user1');
      service.startTyping('chat1', 'user2');
      service.clearTyping('chat1');
      const typingUsers = service.getTypingUsers('chat1');
      expect(typingUsers).toHaveLength(0);
    });
  });
});
