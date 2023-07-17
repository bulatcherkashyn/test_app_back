import { User } from '@prisma/client';

import { CreateUserDTO } from '../dto/UsersDTO';
import { UserResponse } from '../models/User';

export interface UsersDAO {
  createUser(user: CreateUserDTO): Promise<void>;
  findByUID(UID: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getEmployees(email: string): Promise<Array<UserResponse>>;
  updateByUID(uid: string, updateData: Partial<User>): Promise<void>;
}
