import { LoginDto } from '@app/auth/dto/LoginDto';
import { ModelConstructor } from '@app/common/ModelConstructor';
import { Request } from 'express';
import { injectable } from 'tsyringe';

@injectable()
export class LoginModelConstructor implements ModelConstructor<LoginDto, LoginDto> {
  public constructRawForm(req: Request): LoginDto {
    const { username, password } = req.body;

    return { username, password };
  }

  public constructPureObject(req: Request): LoginDto {
    return this.constructRawForm(req);
  }
}
