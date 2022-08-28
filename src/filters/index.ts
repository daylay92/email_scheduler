import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { constants } from '../utils';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    let message: string | string[] = constants.INTERNAL_SERVER_ERROR;
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    const reason = (exception as Error).message;
    Logger.error('Error stack:' + (exception as Error).stack);
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const errorBody = (exception?.getResponse() || {}) as
        | Record<string, string | string[]>
        | string;
      if (typeof errorBody === 'string') {
        message = errorBody;
      } else if (errorBody.message instanceof Array) {
        message = errorBody.message[0];
      } else {
        message = errorBody.message || errorBody.error || message;
      }
    }

    Logger.error(
      `[${new Date().toUTCString()}]: - [${
        (exception as Record<string, Record<string, string>>).constructor.name
      }] - url: ${request.originalUrl} : - ${status} - ${message} ${
        reason ? '- reason :- ' + reason : ''
      }`,
    );
    response.status(status).json({
      status: 'fail',
      error: message,
    });
  }
}
