import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { ApiErrorResponse } from '@tomato/types';
import type { Response } from 'express';
import { HttpStatusErrorCode } from '../common.constants';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const code = HttpStatusErrorCode[status] ?? ErrorCode.INTERNAL_ERROR;

    const body = exception instanceof HttpException ? exception.getResponse() : undefined;
    const details =
      typeof body === 'object' && body !== null && 'details' in body ? body.details : undefined;

    const payload: ApiErrorResponse = { error: { code, details } };
    response.status(status).json(payload);
  }
}
