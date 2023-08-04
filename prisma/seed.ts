import 'process';

import { PrismaClient } from '@prisma/client';
import { createHash } from 'crypto';

const prisma: PrismaClient = new PrismaClient({
  errorFormat: 'minimal',
});

const encryptPassword = (password: string): string => {
  if (!password) {
    throw new Error('Password is empty');
  }
  return createHash('sha512').update(password).digest('hex');
};
// eslint-disable-next-line no-console

(async (): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    try {
      await tx.user.deleteMany({});
      const { id: adminId } = await tx.user.create({
        data: {
          username: 'ADMIN@gmail.com',
          password: encryptPassword('123'),
        },
      });

      await tx.user.create({
        data: {
          username: 'UNDERBOSS1@gmail.com',
          password: encryptPassword('123'),
          bossId: adminId,
        },
      });

      await tx.user.create({
        data: {
          username: 'UNDERBOSS2@gmail.com',
          password: encryptPassword('123'),
          bossId: adminId,
        },
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.log('ERR', err);
    }
  });
})();
