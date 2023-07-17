import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { NextFunction, Request, Response } from 'express';

export function finalErrorHandler(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any,
  request: Request,
  response: Response,
  next: NextFunction,
): void {
  if (error instanceof ApplicationError) {
    logger.error('application.error:', error);
    response.status(error.httpCode).send({ message: error.message });
    return;
  } else if (error instanceof Error) {
    logger.error('application.unexpected.error:', error);
  } else {
    logger.error('application.unexpected.thrown-object:', error);
  }
  response.status(500).send({ message: 'Unexpected server error' });
  next(error);
}
