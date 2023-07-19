/* eslint-disable no-console */
import { ModelConstructor } from '@app/common/ModelConstructor';
import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { UserRoles } from '@app/users/models/User';
import { Request } from 'express';

export class RegisterModelConstructor implements ModelConstructor<CreateUserDTO, CreateUserDTO> {
  public constructRawForm(req: Request): CreateUserDTO {
    const { username, password, role, bossId } = req.body;

    if (role === UserRoles.ADMIN) {
      return {
        username,
        password,
        role,
      };
    }
    return { username, password, role, bossId };
  }
  public constructPureObject(req: Request): CreateUserDTO {
    return this.constructRawForm(req);
  }
}
