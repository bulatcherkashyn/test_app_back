import { TrxUtility } from '@app/db/TrxUtility';
import { logger } from '@app/logger/LoggerFactory';
import { UsersDAO } from '@app/users/db/UsersDAO';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserResponse } from '@app/users/models/User';
import { UsersService } from '@app/users/services/UsersService';
import { PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @inject('PrismaClient') private prisma: PrismaClient,
    @inject('UsersDAO') private dao: UsersDAO,
  ) {}
  async createUser(user: CreateUserDTO): Promise<void> {
    logger.debug('users.dao.create-user.start');
    TrxUtility.transactional(this.prisma, async (trx) => {
      await this.dao.createUser(trx, user);
    });
    logger.debug('users.dao.create-user.end');
  }
  async findByUID(uid: string): Promise<User | null> {
    logger.debug('users.dao.find-user-by-uid.start');
    return TrxUtility.transactional<User | null>(this.prisma, async (trx) => {
      const user = await this.dao.findByUID(trx, uid);

      logger.debug('users.dao.find-user-by-uid.end');

      return user;
    });
  }
  public async findByEmail(email: string): Promise<User | null> {
    logger.debug(`user.service.find-by-email.start.for-email: [${email}]`);
    return TrxUtility.transactional<User | null>(this.prisma, async (trx) => {
      const user = await this.dao.findByEmail(trx, email);

      logger.debug(`user.service.find-by-email.end.for-email: [${email}]`);

      return user;
    });
  }

  public async getEmployees(uid: string): Promise<Array<UserResponse>> {
    logger.debug(`user.service.find-employees-by-email.start.for-uid: [${uid}]`);
    return TrxUtility.transactional<Array<User>>(this.prisma, async (trx) => {
      const employees = await this.dao.getEmployees(trx, uid);

      logger.debug(`user.service.find-employees-by-email.end.for-uid: [${uid}]`);
      return employees;
    });
  }

  public async updateByUID(uid: string, updateData: User): Promise<void> {
    logger.debug(`user.service.update-employee-by-uid.start.for-uid: [${uid}]`);
    return TrxUtility.transactional<void>(this.prisma, async (trx) => {
      await this.dao.updateByUID(trx, uid, updateData);
      logger.debug(`user.service.update-employee-by-uid.end.for-uid: [${uid}]`);
    });
  }
}
