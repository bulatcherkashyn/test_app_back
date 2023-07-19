import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { Prisma, PrismaClient } from '@prisma/client';

import { TrxClient } from './TrxClient';

export class TrxUtility {
  public static async transactional<T>(
    db: PrismaClient,
    daoQuery: (trx: TrxClient) => Promise<T>,
  ): Promise<T> {
    logger.debug('database.query.trx.started');
    try {
      const result = await db.$transaction<T>(async (tx) => {
        return await daoQuery(tx);
      });

      logger.debug('database.query.trx.finished');

      return result;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ApplicationError(
            'There is a unique constraint violation, a new user cannot be created with this email',
            400,
          );
        }
      }
      throw e;
    }
  }
}
