import { AuthProviderImpl } from '@app/auth/AuthProviderImpl';
import { AuthServiceImpl } from '@app/auth/AuthServiceImpl';
import { logger } from '@app/logger/LoggerFactory';
import { container } from 'tsyringe';
export class AuthModule {
  static async initialize(): Promise<void> {
    container.registerSingleton('AuthProvider', AuthProviderImpl);
    container.registerSingleton('AuthService', AuthServiceImpl);
    logger.debug('app.context.auth.module.initialized');
  }
}
