import {
  Injectable,
  LoggerService as NestLoggerService,
} from '@nestjs/common';

@Injectable()
export class LoggerService implements NestLoggerService {
  private context?: string;

  setContext(context: string): void {
    this.context = context;
  }

  log(message: any, context?: string): void {
    console.log(`[${context || this.context || 'App'}] ${message}`);
  }

  error(message: any, trace?: string, context?: string): void {
    console.error(`[${context || this.context || 'App'}] ${message}`, trace);
  }

  warn(message: any, context?: string): void {
    console.warn(`[${context || this.context || 'App'}] ${message}`);
  }

  debug(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`[${context || this.context || 'App'}] ${message}`);
    }
  }

  verbose(message: any, context?: string): void {
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[${context || this.context || 'App'}] VERBOSE: ${message}`);
    }
  }
}
