import { Request } from 'express';
import { User as UserInterface } from '@interfaces/users.interface';
import { TokenResponseDto } from '@/dtos/users.dto';

export interface DataStoredInToken {
  uid: string;
  exp: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: UserInterface;
}

export interface AuthServiceInterface {
  login(userData: UserInterface): Promise<TokenResponseDto>;
  logout(userData: UserInterface): Promise<UserInterface>;
  refreshToken(refreshToken: string): Promise<TokenResponseDto>;
  signup(userData: UserInterface): Promise<void>;
}