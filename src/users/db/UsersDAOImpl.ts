/* eslint-disable no-console */
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { CreateUserDTO } from '../dto/UsersDTO';
import { UserResponse } from '../models/User';
import { UsersDAO } from './UsersDAO';

@injectable()
export class UsersDAOImpl implements UsersDAO {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  public async findByUID(UID: string): Promise<User | null> {
    logger.debug('user.dao.find-by-uid-start');
    try {
      const user = await this.prisma.user.findUnique({
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

  public async findByEmail(email: string): Promise<User | null> {
    logger.debug('user.dao.find-by-email-start');
    try {
      const user = await this.prisma.user.findFirst({
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

  public async updateByUID(uid: string, updateData: Partial<User>): Promise<void> {
    logger.debug('user.dao.update-by-uid-start');
    try {
      await this.prisma.user.update({
        where: {
          id: uid,
        },
        data: {
          ...updateData,
        },
      });
      logger.debug('user.dao.update-by-uid-end');
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

  public async createUser(user: CreateUserDTO): Promise<void> {
    logger.debug('user.dao.create-user-start');
    try {
      await this.prisma.user.create({
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

  public async getEmployees(uid: string): Promise<Array<UserResponse>> {
    const subordinates = (await this.prisma.$queryRaw`with recursive subordinates as (
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
