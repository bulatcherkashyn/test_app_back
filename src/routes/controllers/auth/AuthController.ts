/* eslint-disable no-console */
import { AuthService } from '@app/auth/AuthService';
import { CreateUserValidator } from '@app/auth/validator/CreateUserValidator';
import { LoginUserValidator } from '@app/auth/validator/LoginUserValidator';
import { validate } from '@app/common/validator/ValidationMiddleware';
import { logger } from '@app/logger/LoggerFactory';
import { RegisterModelConstructor } from '@app/routes/controllers/auth/RegisterModelConstructor';
import { Controller } from '@app/routes/controllers/Controller';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { LoginModelConstructor } from './LoginModelConstructor';

@injectable()
export class AuthController implements Controller {
  private loginModelConstructor = new LoginModelConstructor();
  private loginUserValidator = new LoginUserValidator();
  private registerModelConstructor = new RegisterModelConstructor();
  private registerUserValidator = new CreateUserValidator();
  constructor(
    @inject('AuthService')
    private authService: AuthService,
  ) {}
  public path(): string {
    return '/auth';
  }

  public initialize(router: Router): void {
    router.post(
      '/signin',
      validate(this.loginModelConstructor, this.loginUserValidator),
      this.login,
    );
    router.post(
      '/signup',
      validate(this.registerModelConstructor, this.registerUserValidator),
      this.registerUser,
    );
  }

  public registerUser = async (req: Request, res: Response): Promise<void> => {
    logger.debug('auth.controller.user-registration.start');
    const user = this.registerModelConstructor.constructPureObject(req);

    await this.authService.registerUser(user);
    res.status(201).json({
      message: 'User registered succesfully',
    });

    logger.debug('auth.controller.user-registration.end');
  };

  public login = async (req: Request, res: Response): Promise<void> => {
    logger.debug('auth.controller.login.start');
    const { username, password } = this.loginModelConstructor.constructPureObject(req);
    const token = await this.authService.login(username, password);

    res.status(200).json({
      token,
    });

    logger.debug('auth.controller.login.end');
  };
}
