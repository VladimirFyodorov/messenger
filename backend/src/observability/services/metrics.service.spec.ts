import {
  Test,
  TestingModule,
} from '@nestjs/testing';

import { MetricsService } from './metrics.service';

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MetricsService],
    }).compile();

    service = module.get<MetricsService>(MetricsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('recordTiming', () => {
    it('should record timing metrics', () => {
      expect(() => {
        service.recordTiming('GET', '/test', 0.1, 200);
      }).not.toThrow();
    });
  });

  describe('recordError', () => {
    it('should record error metrics', () => {
      expect(() => {
        service.recordError('GET', '/test');
      }).not.toThrow();
    });
  });

  describe('setGauge', () => {
    it('should set gauge metrics', () => {
      expect(() => {
        service.setGauge('websocket_connections', 10);
      }).not.toThrow();
    });
  });

  describe('exportMetrics', () => {
    it('should export metrics in Prometheus format', async () => {
      const metrics = await service.exportMetrics();
      expect(typeof metrics).toBe('string');
      expect(metrics.length).toBeGreaterThan(0);
    });
  });
});
