import { JwtObject } from '@app/auth/models/JwtObject';

export interface AuthProvider {
  getAuthToken(userUID: string): string;
  decodeAuthToken(token: string): JwtObject;
}
