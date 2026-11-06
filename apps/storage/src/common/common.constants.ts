import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';

export const HttpStatusErrorCode: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_FAILED,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
  [HttpStatus.CONFLICT]: ErrorCode.CONFLICT,
  [HttpStatus.PAYLOAD_TOO_LARGE]: ErrorCode.VALIDATION_FAILED,
};

export const GLOBAL_PREFIX = 'rest';
export const SWAGGER_PATH = 'docs';
export const SWAGGER_TITLE = 'Tomato Storage API';
export const DEFAULT_PAGE = 1;
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const NAME_MIN_LENGTH = 1;
export const NAME_MAX_LENGTH = 255;
