import { BaseHandler } from '@app/common/handler/BaseHandler';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserRoles } from '@app/users/models/User';
import { PrismaClient } from '@prisma/client';

export class BossCreateHandler extends BaseHandler<CreateUserDTO> {
  handle(userDTO: CreateUserDTO, prisma: PrismaClient): void {
    if (userDTO.role === UserRoles.BOSS) {
    }
    // eslint-disable-next-line no-console
    console.log(prisma);
  }
}
