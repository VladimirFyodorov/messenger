import {
  Global,
  Module,
} from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthController } from './health.controller';
import { MetricsController } from './metrics.controller';
import { LoggerService } from './services/logger.service';
import { MetricsService } from './services/metrics.service';

@Global()
@Module({
  imports: [TerminusModule],
  controllers: [HealthController, MetricsController],
  providers: [MetricsService, LoggerService],
  exports: [MetricsService, LoggerService],
})
export class ObservabilityModule {}
