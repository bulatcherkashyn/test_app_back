import { User } from '../models/User';
export type CreateUserDTO = Required<Omit<User, 'id'>>;

export interface UpdateUserDTO {
  updateUserUID: string;
  newBossUID: string;
  token: string;
}

export type UpdateUserInfo = Omit<UpdateUserDTO, 'token'>;
