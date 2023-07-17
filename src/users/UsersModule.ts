import { logger } from '@app/logger/LoggerFactory';
import { container } from 'tsyringe';

import { UsersDAOImpl } from './db/UsersDAOImpl';
import { UsersServiceImpl } from './services/UsersServiceImpl';

export class UsersModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('UsersDAO', UsersDAOImpl);
    container.registerSingleton('UsersService', UsersServiceImpl);
    logger.debug('app.users.module.initialized');
  }
}
