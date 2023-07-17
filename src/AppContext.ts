import { AuthModule } from '@app/auth/AuthModule';
import { logger } from '@app/logger/LoggerFactory';
import { LoggerModule } from '@app/logger/LoggerModule';
import { RouterModule } from '@app/routes/RouterModule';
import { UsersModule } from '@app/users/UsersModule';

import { DatabaseModule } from './db/DatabaseModule';

export class AppContext {
  static async initialize(): Promise<void> {
    await DatabaseModule.initialize();
    await LoggerModule.initialize();
    await UsersModule.initialize();
    await AuthModule.initialize();
    await RouterModule.initialize();

    logger.info('app.context.initialized');
  }
}
