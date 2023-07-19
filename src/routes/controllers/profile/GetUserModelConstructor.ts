import { ModelConstructor } from '@app/common/ModelConstructor';
import { GetProfileRequest, User, VerifiedUser } from '@app/users/models/User';
import { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class GetUserModelConstructor
  implements ModelConstructor<GetProfileRequest, Pick<User, 'id' | 'role'>>
{
  public constructRawForm(req: Request): GetProfileRequest {
    const token = req.headers['authorization'] as string;

    return { token };
  }

  public constructPureObject(req: Request): Omit<VerifiedUser, 'password'> {
    const { password, ...refinedUser } = req.user as VerifiedUser;

    return refinedUser;
  }
}
