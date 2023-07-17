import { ModelConstructor } from '@app/common/ModelConstructor';
import { UpdateUserDTO } from '@app/users/dto/UsersDTO';
import { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class UpdateUserModelConstructor implements ModelConstructor<UpdateUserDTO, UpdateUserDTO> {
  public constructRawForm(req: Request): UpdateUserDTO {
    const token = req.headers['authorization'] as string;
    const { newBossUID } = req.body;
    const { updateUserUID } = req.params;

    return { token, updateUserUID, newBossUID };
  }

  public constructPureObject(req: Request): UpdateUserDTO {
    return this.constructRawForm(req);
  }
}
