import 'reflect-metadata';

import { verifyAccess } from '@app/common/acs/ACSMiddleware';
import { availableOperations } from '@app/common/acs/permissions';
import { validate } from '@app/common/validator/ValidationMiddleware';
import { logger } from '@app/logger/LoggerFactory';
import { Controller } from '@app/routes/controllers/Controller';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserRoles, VerifiedUser } from '@app/users/models/User';
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
    const newBossUID = req.body.newBossUID as string;
    const updateUserUID = req.params.updateUserUID as string;
    const { id: currentUserUID } = req.user as VerifiedUser;
    const employees = await this.usersService.getEmployees(currentUserUID);
    const employeesUID = employees.map((employee) => employee.id);

    if (employeesUID.includes(updateUserUID)) {
      this.usersService.updateByUID(updateUserUID, {
        bossId: newBossUID,
      });
      res.status(200).json({
        message: 'User was updated succesfully',
      });
    }

    logger.debug('profile.controller.update-profile.end');
  };

  public getProfile = async (req: Request, res: Response): Promise<void> => {
    const { id, role } = req.user as VerifiedUser;
    const { password, ...refinedUser } = req.user as VerifiedUser;

    if (role === UserRoles.REGULAR) {
      res.status(200).json({
        ...refinedUser,
      });
      return;
    }

    const employees = await this.usersService.getEmployees(id);
    const result = {
      ...refinedUser,
      employees,
    };

    res.json({
      ...result,
    });
  };
}
