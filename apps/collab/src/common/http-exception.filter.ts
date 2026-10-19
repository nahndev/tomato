import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '@tomato/constants';
import type { ApiErrorResponse } from '@tomato/types';
import type { Response } from 'express';

const HttpStatusErrorCode: Partial<Record<number, ErrorCode>> = {
  [HttpStatus.BAD_REQUEST]: ErrorCode.VALIDATION_FAILED,
  [HttpStatus.NOT_FOUND]: ErrorCode.NOT_FOUND,
};

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    const status =
      exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const payload: ApiErrorResponse = { error: { code: HttpStatusErrorCode[status] ?? ErrorCode.INTERNAL_ERROR } };
    response.status(status).json(payload);
  }
}
