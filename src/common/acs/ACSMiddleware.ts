import { AuthService } from '@app/auth/AuthService';
import { permissions } from '@app/common/acs/permissions';
import { ApplicationError } from '@app/error/ApplicationError';
import { User } from '@app/users/models/User';
import { NextFunction, Request, Response } from 'express';
import { container } from 'tsyringe';

async function getUserFromToken(token: string): Promise<User> {
  const authService = container.resolve<AuthService>('AuthService');

  const user = await authService.validateAccessToken(token || '');

  return user;
}
export const verifyAccess =
  (currentPermission: string) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    let hasAccess;
    const token = req.headers['authorization'];

    if (!token) {
      throw new ApplicationError('missed auth token', 400);
    }
    const user = await getUserFromToken(token);

    req.user = user;
    const availablePermissions = permissions[user.role!];

    if (availablePermissions.includes(currentPermission)) {
      hasAccess = true;
    }

    if (!hasAccess) {
      throw new ApplicationError('access denies', 403);
    }

    next();
  };
