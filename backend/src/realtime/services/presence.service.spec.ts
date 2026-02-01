import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { PresenceService } from './presence.service';

describe('PresenceService', () => {
  let service: PresenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PresenceService],
    }).compile();

    service = module.get<PresenceService>(PresenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('setOnline', () => {
    it('should set user as online', () => {
      service.setOnline('1');
      expect(service.getUserStatus('1')).toBe('online');
    });
  });

  describe('setOffline', () => {
    it('should set user as offline', () => {
      service.setOnline('1');
      service.setOffline('1');
      expect(service.getUserStatus('1')).toBe('offline');
    });
  });

  describe('getOnlineUsers', () => {
    it('should return list of online users', () => {
      service.setOnline('1');
      service.setOnline('2');
      const onlineUsers = service.getOnlineUsers();
      expect(onlineUsers).toContain('1');
      expect(onlineUsers).toContain('2');
    });
  });
});
