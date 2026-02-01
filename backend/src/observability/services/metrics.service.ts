import * as client from 'prom-client';

import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsService {
  private readonly register: client.Registry;
  private readonly httpRequestDuration: client.Histogram<string>;
  private readonly httpRequestTotal: client.Counter<string>;
  private readonly httpRequestErrors: client.Counter<string>;
  private readonly websocketConnections: client.Gauge<string>;

  constructor() {
    this.register = new client.Registry();
    client.collectDefaultMetrics({ register: this.register });

    this.httpRequestDuration = new client.Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status'],
      registers: [this.register],
    });

    this.httpRequestTotal = new client.Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
      registers: [this.register],
    });

    this.httpRequestErrors = new client.Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route'],
      registers: [this.register],
    });

    this.websocketConnections = new client.Gauge({
      name: 'websocket_connections_active',
      help: 'Number of active WebSocket connections',
      registers: [this.register],
    });
  }

  incrementCounter(name: string, labels?: Record<string, string>): void {
    this.httpRequestTotal.inc(labels || {});
  }

  recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    this.httpRequestDuration.observe(labels || {}, value);
  }

  setGauge(name: string, value: number, labels?: Record<string, string>): void {
    if (name === 'websocket_connections') {
      this.websocketConnections.set(labels || {}, value);
    }
  }

  recordTiming(method: string, route: string, duration: number, status: number): void {
    const labels = { method, route, status: status.toString() };
    this.httpRequestDuration.observe(labels, duration);
    this.httpRequestTotal.inc(labels);
  }

  recordError(method: string, route: string): void {
    this.httpRequestErrors.inc({ method, route });
  }

  exportMetrics(): Promise<string> {
    return this.register.metrics();
  }
}
