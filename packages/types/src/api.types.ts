import type { ErrorCode } from '@tomato/constants';

export interface ApiError {
  code: ErrorCode;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
}

export interface HealthStatus {
  status: 'ok';
  timestamp: string;
}
