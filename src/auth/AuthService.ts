import { CreateUserDTO } from '@app/users/dto/UsersDTO';
import { User } from '@app/users/models/User';

export interface AuthService {
  registerUser(user: CreateUserDTO): Promise<void>;
  login(username: string, password: string): Promise<string>;
  verifyUsernamePassword(username: string, password: string, user: User): Promise<void>;
  validateAccessToken(authToken: string): Promise<User>;
}
