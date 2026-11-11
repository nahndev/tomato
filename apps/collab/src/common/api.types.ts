import type { ErrorCode } from '@tomato/constants';

export interface ApiError {
  code: ErrorCode;
  details?: unknown;
}

export interface ApiErrorResponse {
  error: ApiError;
}
