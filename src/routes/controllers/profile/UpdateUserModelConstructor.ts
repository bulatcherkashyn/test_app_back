import { ModelConstructor } from '@app/common/ModelConstructor';
import { UpdateUserDTO } from '@app/users/dto/UsersDTO';
import { VerifiedUser } from '@app/users/models/User';
import { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class UpdateUserModelConstructor
  implements
    ModelConstructor<
      UpdateUserDTO,
      UpdateUserDTO & {
        currentUserUID: string;
      }
    >
{
  public constructRawForm(req: Request): UpdateUserDTO {
    const token = req.headers['authorization'] as string;
    const { newBossUID } = req.body;
    const { updateUserUID } = req.params;

    return { token, updateUserUID, newBossUID };
  }

  public constructPureObject(req: Request): UpdateUserDTO & {
    currentUserUID: string;
  } {
    const updateParams = this.constructRawForm(req);
    const { id: currentUserUID } = req.user as VerifiedUser;

    return { ...updateParams, currentUserUID };
  }
}
