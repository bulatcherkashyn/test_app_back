import { ModelConstructor } from '@app/common/ModelConstructor';
import { GetProfileRequest } from '@app/users/models/User';
import { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class GetUserModelConstructor
  implements ModelConstructor<GetProfileRequest, GetProfileRequest>
{
  public constructRawForm(req: Request): GetProfileRequest {
    const token = req.headers['authorization'] as string;

    return { token };
  }

  public constructPureObject(req: Request): GetProfileRequest {
    return this.constructRawForm(req);
  }
}
