/* eslint-disable no-console */
import { TrxClient } from '@app/db/TrxClient';
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { Prisma, User } from '@prisma/client';
import { injectable } from 'tsyringe';

import { CreateUserDTO } from '../dto/UsersDTO';
import { UserResponse } from '../models/User';
import { UsersDAO } from './UsersDAO';

@injectable()
export class UsersDAOImpl implements UsersDAO {
  public async findByUID(trx: TrxClient, UID: string): Promise<User | null> {
    logger.debug('user.dao.find-by-uid-start');
    try {
      const user = await trx.user.findUnique({
        where: {
          id: UID,
        },
      });

      logger.debug('user.dao.find-by-uid-end');

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ApplicationError(
            'There is a unique constraint violation, a new user cannot be created with this email',
            400,
          );
        }
      }
      throw e;
    }
  }

  public async findByEmail(trx: TrxClient, email: string): Promise<User | null> {
    logger.debug('user.dao.find-by-email-start');
    try {
      const user = await trx.user.findFirst({
        where: {
          username: email,
        },
      });

      logger.debug('user.dao.find-by-email-end');

      return user;
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ApplicationError(
            'There is a unique constraint violation, a new user cannot be created with this email',
            400,
          );
        }
      }
      throw e;
    }
  }

  public async updateByUID(trx: TrxClient, uid: string, updateData: Partial<User>): Promise<void> {
    logger.debug('user.dao.update-by-uid-start');
    // try {
    await trx.user.update({
      where: {
        id: uid,
      },
      data: {
        ...updateData,
      },
    });
    logger.debug('user.dao.update-by-uid-end');
    // } catch (e) {
    //   if (e instanceof Prisma.PrismaClientKnownRequestError) {
    //     if (e.code === 'P2002') {
    //       throw new ApplicationError(
    //         'There is a unique constraint violation, a new user cannot be created with this email',
    //         400,
    //       );
    //     }
    //   }
    //   throw e;
    // }
  }

  public async createUser(trx: TrxClient, user: CreateUserDTO): Promise<void> {
    logger.debug('user.dao.create-user-start');
    try {
      await trx.user.create({
        data: {
          ...user,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === 'P2002') {
          throw new ApplicationError(
            'There is a unique constraint violation, a new user cannot be created with this email',
            400,
          );
        }
      }
      throw e;
    }

    logger.debug('user.dao.create-user-end');
  }

  public async getEmployees(trx: TrxClient, uid: string): Promise<Array<UserResponse>> {
    const subordinates = (await trx.$queryRaw`with recursive subordinates as (
      select username, "User".id, "bossId", role from "User"
      where id = ${uid}
      union
        select e.username, e.id, e."bossId", e.role
       from "User" e
      INNER JOIN subordinates s ON s.id = e."bossId"
    ) SELECT
      *
    FROM
      subordinates as s WHERE id != ${uid}`) as Array<UserResponse>;

    return subordinates;
  }
}
