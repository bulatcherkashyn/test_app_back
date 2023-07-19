import { TrxClient } from '@app/db/TrxClient';
import { User } from '@prisma/client';

import { CreateUserDTO } from '../dto/UsersDTO';
import { UserResponse } from '../models/User';

export interface UsersDAO {
  createUser(trx: TrxClient, user: CreateUserDTO): Promise<void>;
  findByUID(trx: TrxClient, UID: string): Promise<User | null>;
  findByEmail(trx: TrxClient, email: string): Promise<User | null>;
  getEmployees(trx: TrxClient, email: string): Promise<Array<UserResponse>>;
  updateByUID(trx: TrxClient, uid: string, updateData: Partial<User>): Promise<void>;
}
