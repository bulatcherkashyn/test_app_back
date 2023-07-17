import { AuthProvider } from '@app/auth/AuthProvider';
import { AuthService } from '@app/auth/AuthService';
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { User } from '@app/users/models/User';
import { UsersService } from '@app/users/services/UsersService';
import { createHash } from 'crypto';
import { inject, injectable } from 'tsyringe';

@injectable()
export class AuthServiceImpl implements AuthService {
  public static encryptPassword(password: string): string {
    if (!password) {
      throw new ApplicationError('Password is empty', 400);
    }
    return createHash('sha512').update(password).digest('hex');
  }
  constructor(
    @inject('UsersService') private userService: UsersService,
    @inject('AuthProvider') private authProvider: AuthProvider,
  ) {}

  public async registerUser(user: CreateUserDTO): Promise<void> {
    logger.debug('auth.service.register.start.for:', user.username);
    const hashedPassword = AuthServiceImpl.encryptPassword(user.password);

    await this.userService.createUser({ ...user, password: hashedPassword });
    logger.debug('auth.service.register.start.for:', user.username);
  }

  public async login(username: string, password: string): Promise<string> {
    logger.debug(`auth.service.login.start.for-username: [${username}]`);
    const user = await this.userService.findByEmail(username);

    await this.verifyUsernamePassword(username, password, user);

    logger.debug(`auth.service.login.end.for-username: [${username}]`);
    return this.createAuthToken(user as User);
  }

  public async verifyUsernamePassword(
    username: string,
    password: string,
    user: User | null,
  ): Promise<void> {
    logger.debug(`auth.service.verify-username-password.start.for-username: [${username}]`);
    if (!user || !(user.password === AuthServiceImpl.encryptPassword(password))) {
      logger.debug(
        `auth.service.verify-username-password.unsuccessful.for-username: [${username}]`,
      );
      throw new ApplicationError('Username/password dont match', 401);
    }
    logger.debug(`auth.service.verify-username-password.end.for-username: [${username}]`);
  }

  public async validateAccessToken(authToken: string): Promise<User> {
    logger.debug(`auth.service.validate-access-token.start.for-access-token: [${authToken}]`);
    const { userUID } = this.authProvider.decodeAuthToken(authToken);
    const user = await this.userService.findByUID(userUID);

    if (!user) {
      throw new ApplicationError('Incorrect access token', 401);
    }
    logger.debug(`auth.service.validate-access-token.end.for-access-token: [${authToken}]`);
    return user;
  }

  private async createAuthToken(user: User): Promise<string> {
    logger.debug(`auth.service.create-auth-tokens.start.for-username: [${user?.username}]`);
    const token = this.getToken(user.id as string);

    return token;
  }

  private getToken(userUID: string): string {
    logger.debug(`auth.service.get-tokens.start.for-uid: [${userUID}]`);
    const token = this.authProvider.getAuthToken(userUID);

    logger.debug(`auth.service.get-tokens.done.for-uid: [${userUID}].\nAccess token: [${token}]`);
    return token;
  }
}
