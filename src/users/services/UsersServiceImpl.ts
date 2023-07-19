/* eslint-disable no-console */
import { AuthServiceImpl } from '@app/auth/AuthServiceImpl';
import { TrxUtility } from '@app/db/TrxUtility';
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { UsersDAO } from '@app/users/db/UsersDAO';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserResponse, UserRoles } from '@app/users/models/User';
import { UsersService } from '@app/users/services/UsersService';
import { PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

@injectable()
export class UsersServiceImpl implements UsersService {
  constructor(
    @inject('PrismaClient') private db: PrismaClient,
    @inject('UsersDAO') private dao: UsersDAO,
  ) {}
  async createUser(user: CreateUserDTO): Promise<void> {
    logger.debug('users.dao.create-user.start');
    const hashedPassword = AuthServiceImpl.encryptPassword(user.password);

    const isUserExists = await TrxUtility.transactional(this.db, async (trx) => {
      return !!(await this.dao.findByEmail(trx, user.username));
    });

    if (isUserExists) {
      throw new ApplicationError('User with such username is already registered', 400);
    }
    return TrxUtility.transactional(this.db, async (trx) => {
      if (user.role !== UserRoles.ADMIN) {
        if (!user.bossId) {
          throw new ApplicationError('missed bossId parameter', 400);
        }
        const patron = await this.dao.findByUID(trx, user.bossId);

        if (!patron) {
          throw new ApplicationError('User with such bossId parameter does not exists', 400);
        }
        await this.dao.createUser(trx, { ...user, password: hashedPassword });
        if (patron.role === UserRoles.REGULAR) {
          await this.dao.updateByUID(trx, user.bossId, {
            role: UserRoles.BOSS,
          });
        }
      } else {
        await this.dao.createUser(trx, { ...user, password: hashedPassword });
        logger.debug('users.dao.create-user.end');
      }
    });
  }

  async findByUID(uid: string): Promise<User | null> {
    logger.debug('users.dao.find-user-by-uid.start');
    return TrxUtility.transactional<User | null>(this.db, async (trx) => {
      const user = await this.dao.findByUID(trx, uid);

      logger.debug('users.dao.find-user-by-uid.end');

      return user;
    });
  }
  public async findByEmail(email: string): Promise<User | null> {
    logger.debug(`user.service.find-by-email.start.for-email: [${email}]`);
    return TrxUtility.transactional<User | null>(this.db, async (trx) => {
      const user = await this.dao.findByEmail(trx, email);

      logger.debug(`user.service.find-by-email.end.for-email: [${email}]`);

      return user;
    });
  }

  public async getEmployees(uid: string): Promise<Array<UserResponse>> {
    logger.debug(`user.service.find-employees-by-email.start.for-uid: [${uid}]`);
    return TrxUtility.transactional<Array<User>>(this.db, async (trx) => {
      const employees = await this.dao.getEmployees(trx, uid);

      logger.debug(`user.service.find-employees-by-email.end.for-uid: [${uid}]`);
      return employees;
    });
  }

  public async updateByUID(uid: string, updateData: User): Promise<void> {
    logger.debug(`user.service.update-employee-by-uid.start.for-uid: [${uid}]`);
    return TrxUtility.transactional<void>(this.db, async (trx) => {
      const bossId = updateData.bossId as string;

      await this.dao.updateByUID(trx, uid, { bossId });
      await this.dao.updateByUID(trx, bossId, {
        role: UserRoles.BOSS,
      });
      logger.debug(`user.service.update-employee-by-uid.end.for-uid: [${uid}]`);
    });
  }
}
