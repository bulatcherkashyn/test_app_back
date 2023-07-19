import { UserResponse } from '@app/users/models/User';
import { User } from '@prisma/client';

import { CreateUserDTO } from '../dto/UsersDTO';

export interface UsersService {
  createUser(user: CreateUserDTO): Promise<void>;
  findByUID(uid: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  getEmployees(id: string): Promise<Array<UserResponse>>;
  updateByUID(uid: string, updateData: Partial<User>): Promise<void>;
}
