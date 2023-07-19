import 'reflect-metadata';

import { verifyAccess } from '@app/common/acs/ACSMiddleware';
import { availableOperations } from '@app/common/acs/permissions';
import { validate } from '@app/common/validator/ValidationMiddleware';
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { Controller } from '@app/routes/controllers/Controller';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserRoles } from '@app/users/models/User';
import { UsersService } from '@app/users/services/UsersService';
import { GetUserValidator } from '@app/users/validator/GetUserValidator';
import { UpdateUserValidator } from '@app/users/validator/UpdateUserValidator';
import { Request, Response, Router } from 'express';
import { inject, injectable } from 'tsyringe';

import { GetUserModelConstructor } from './GetUserModelConstructor';
import { UpdateUserModelConstructor } from './UpdateUserModelConstructor';

@injectable()
export class ProfileController implements Controller {
  private readonly updateUserModelConstructor = new UpdateUserModelConstructor();
  private readonly updateUserValidator = new UpdateUserValidator();
  private readonly getUserModelConstructor = new GetUserModelConstructor();
  private readonly getUserValidator = new GetUserValidator();
  constructor(@inject('UsersService') private usersService: UsersService) {}
  public path(): string {
    return '/profile';
  }

  public initialize(router: Router): void {
    router.get(
      '/',
      validate(this.getUserModelConstructor, this.getUserValidator),
      verifyAccess(availableOperations.getUsers),
      this.getProfile,
    );
    router.put(
      '/:updateUserUID',
      validate(this.updateUserModelConstructor, this.updateUserValidator),
      verifyAccess(availableOperations.updateUser),
      this.updateProfile,
    );
  }

  public createProfile = async (req: Request, res: Response): Promise<void> => {
    const user = req.body as CreateUserDTO;

    this.usersService.createUser(user);

    logger.debug('users.create');
    res.status(200).json({
      message: 'USER created',
    });
  };

  public updateProfile = async (req: Request, res: Response): Promise<void> => {
    logger.debug('profile.controller.update-profile.start');
    const updateUserInfo = this.updateUserModelConstructor.constructPureObject(req);

    const employees = await this.usersService.getEmployees(updateUserInfo.currentUserUID);
    const employeesUID = employees.map((employee) => employee.id);

    if (
      employeesUID.includes(updateUserInfo.updateUserUID) &&
      employeesUID.includes(updateUserInfo.newBossUID)
    ) {
      await this.usersService.updateByUID(updateUserInfo.updateUserUID, {
        bossId: updateUserInfo.newBossUID,
      });
      res.status(200).json({
        message: 'User was updated succesfully',
      });
    } else {
      throw new ApplicationError('Wrong update parameters', 400);
    }

    logger.debug('profile.controller.update-profile.end');
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const getUserParams = this.getUserModelConstructor.constructPureObject(req);

    if (getUserParams.role === UserRoles.REGULAR) {
      res.status(200).json({
        ...getUserParams,
      });
      return;
    }

    const employees = await this.usersService.getEmployees(getUserParams.id);
    const result = {
      ...getUserParams,
      employees,
    };

    res.json({
      ...result,
    });
  };
}
