/* eslint-disable no-console */
import { ApplicationError } from '@app/error/ApplicationError';
import { logger } from '@app/logger/LoggerFactory';
import { Prisma, PrismaClient, User } from '@prisma/client';
import { inject, injectable } from 'tsyringe';

import { CreateUserDTO } from '../dto/UsersDTO';
import { UserResponse, UserRoles } from '../models/User';
import { UsersDAO } from './UsersDAO';

@injectable()
export class UsersDAOImpl implements UsersDAO {
  constructor(@inject('PrismaClient') private prisma: PrismaClient) {}

  public async findByUID(UID: string): Promise<User | null> {
    logger.debug('user.dao.find-by-uid-start');

    const user = await this.prisma.user.findUnique({
      where: {
        id: UID,
      },
    });

    logger.debug('user.dao.find-by-uid-end');

    return user;
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

  public async updateByUID(uid: string, newBossUID: string): Promise<void> {
    logger.debug('user.dao.update-by-uid-start');

    try {
      const isNewBossExists = !!(await this.prisma.user.findUnique({
        where: {
          id: newBossUID,
        },
      }));

      if (isNewBossExists) {
        await this.prisma.user.update({
          where: {
            id: uid,
          },
          data: {
            bossId: newBossUID,
          },
        });
      } else {
        throw new ApplicationError('new boss record does not exists', 400);
      }

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
      const transactions = [];

      transactions.push(
        this.prisma.user.create({
          data: {
            ...user,
          },
        }),
      );

      if (user.role !== UserRoles.ADMIN) {
        const patron = (await this.prisma.user.findUnique({
          where: {
            id: user.bossId as string,
          },
        })) as Required<User>;

        if (patron.role === UserRoles.REGULAR) {
          transactions.push(
            this.prisma.user.update({
              where: {
                id: user.bossId as string,
              },
              data: {
                role: UserRoles.BOSS,
              },
            }),
          );
        }
      }
      await this.prisma.$transaction(transactions);
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

    // eslint-disable-next-line no-console
    // const { id: id1 } = await this.prisma.user.create({
    //   data: {
    //     username: 'SOMEUSER_1',
    //     role: 'REGULAR',
    //     password: '123',
    //   },
    // });

    // const { id: id2 } = await this.prisma.user.create({
    //   data: {
    //     username: 'SOMEUSER_2',
    //     bossId: id1,
    //     role: 'REGULAR',
    //     password: '123',
    //   },
    // });

    // const { id: id3 } = await this.prisma.user.create({
    //   data: {
    //     username: 'SOMEUSER_3',
    //     bossId: id2,
    //     role: 'REGULAR',
    //     password: '123',
    //   },
    // });

    // await this.prisma.user.create({
    //   data: {
    //     username: 'SOMEUSER_4',
    //     bossId: id3,
    //     role: 'REGULAR',
    //     password: '123',
    //   },
    // });

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
