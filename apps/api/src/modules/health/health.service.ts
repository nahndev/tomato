import { Injectable } from '@nestjs/common';
import type { HealthStatus } from '@tomato/types';

@Injectable()
export class HealthService {
  check(): HealthStatus {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
