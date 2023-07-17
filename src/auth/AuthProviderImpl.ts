import { AuthProvider } from '@app/auth/AuthProvider';
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { sign, verify } from 'jsonwebtoken';

import { JwtObject } from './models/JwtObject';

export class AuthProviderImpl implements AuthProvider {
  private readonly jwtSecret: string;
  private TOKEN_EXPIRATION_TIME = 300;
  private readonly TOKEN_TYPE = 'Bearer';

  constructor() {
    if (!process.env.JWT_SECRET) {
      throw new ApplicationError('missed JWT_SECRET');
    }
    this.jwtSecret = process.env.JWT_SECRET;
  }
  public getAuthToken(userUID: string): string {
    logger.debug(`auth.provider.get-auth-token.start.for-uid: [${userUID}]`);
    const jwtData = this.generateJWT({ userUID }, this.jwtSecret, this.TOKEN_EXPIRATION_TIME);

    logger.debug(`auth.provider.get-auth-token.end.for-uid: [${userUID}]`);
    return jwtData;
  }

  public decodeAuthToken(token: string): JwtObject {
    logger.debug('auth-provider.decode-auth-token.start.decode-token');
    const jwtToken = this.extractJwtFromAuthToken(token);

    try {
      logger.debug('auth-provider.decode-auth-token.done.decode-token');
      return this.decodeJWT(jwtToken, this.jwtSecret);
    } catch (e) {
      throw e;
    }
  }

  private decodeJWT(token: string, secret: string): JwtObject {
    try {
      logger.debug('auth.provider.decode-jwt.start');
      const data = verify(token, secret) as JwtObject;

      logger.debug('auth.provider.decode-jwt.done');
      return data;
    } catch (e: any) {
      throw new ApplicationError(e.message);
    }
  }

  private generateJWT(data: object, secret: string, expiresIn?: number): string {
    logger.debug('auth.provider.generate-jwt.start');
    const options = expiresIn ? { expiresIn } : {};

    const jwtToken = sign(data, secret, options);

    logger.debug('auth.provider.generate-jwt.end');
    return jwtToken;
  }

  private extractJwtFromAuthToken(authHeader: string | undefined): string {
    logger.debug('auth.provider.extract-jwt-from-auth-token.start');
    if (!authHeader) {
      logger.debug('auth.provider.extract-jwt-from-auth-token.error.no-auth-token');
      throw new ApplicationError('No auth token', 401);
    }
    const [prefixFromToken, token] = authHeader.split(' ');

    if (!token || prefixFromToken !== this.TOKEN_TYPE) {
      logger.debug('auth.provider.extract-jwt-from-auth-token.error.incorrect-access-token');
      throw new ApplicationError('Incorrect access token', 401);
    }
    logger.debug('auth.provider.extract-jwt-from-auth-token.done');
    return token;
  }
}
