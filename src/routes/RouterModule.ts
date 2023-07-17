import { logger } from '@app/logger/LoggerFactory';
import { AuthController } from '@app/routes/controllers/auth/AuthController';
import { ProfileController } from '@app/routes/controllers/profile/ProfileController';
import { container } from 'tsyringe';

export class RouterModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('ProfileController', ProfileController);
    container.registerSingleton('AuthController', AuthController);

    logger.debug('app.context.router.module.initialized');
  }
}
