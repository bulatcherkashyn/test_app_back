import { logger } from '@app/logger/LoggerFactory';
import { UsersDAO } from '@app/users/db/UsersDAO';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { User, UserResponse } from '@app/users/models/User';
import { UsersService } from '@app/users/services/UsersService';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UsersServiceImpl implements UsersService {
  constructor(@inject('UsersDAO') private dao: UsersDAO) {}
  async createUser(user: CreateUserDTO): Promise<void> {
    logger.debug('users.dao.create-user.start');
    await this.dao.createUser(user);
    logger.debug('users.dao.create-user.end');
  }
  async findByUID(uid: string): Promise<User | null> {
    logger.debug('users.dao.find-user-by-uid.start');
    const user = await this.dao.findByUID(uid);

    logger.debug('users.dao.find-user-by-uid.end');

    return user;
  }
  public async findByEmail(email: string): Promise<User | null> {
    logger.debug(`user.service.find-by-email.start.for-email: [${email}]`);
    const user = await this.dao.findByEmail(email);

    logger.debug(`user.service.find-by-email.end.for-email: [${email}]`);
    return user;
  }

  public async getEmployees(uid: string): Promise<Array<UserResponse>> {
    logger.debug(`user.service.find-employees-by-email.start.for-uid: [${uid}]`);
    const employees = await this.dao.getEmployees(uid);

    logger.debug(`user.service.find-employees-by-email.start.for-uid: [${uid}]`);
    return employees;
  }

  public async updateByUID(uid: string, updateData: User): Promise<void> {
    logger.debug(`user.service.update-employee-by-uid.start.for-uid: [${uid}]`);
    await this.dao.updateByUID(uid, updateData);
    logger.debug(`user.service.find-employees-by-uid.start.for-uid: [${uid}]`);
  }
}
