import { User as UserType } from '@prisma/client';

export enum UserRoles {
  ADMIN = 'ADMIN',
  BOSS = 'BOSS',
  REGULAR = 'REGULAR',
}

export type User = Partial<UserType>;

export type VerifiedUser = Required<User>;
export type UserResponse = VerifiedUser;

export interface GetProfileRequest {
  token: string;
}
