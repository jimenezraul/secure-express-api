import { Request } from 'express';
import { User } from '@interfaces/users.interface';
import { TokenResponseDto, UserDto } from '@/dtos/users.dto';

export interface DataStoredInToken {
  uid: string;
  exp: number;
}

export interface TokenData {
  token: string;
  expiresIn: number;
}

export interface RequestWithUser extends Request {
  user: User;
}

export interface AuthServiceInterface {
  login(userData: User): Promise<TokenResponseDto>;
  logout(userData: User): Promise<User>;
  refreshToken(refreshToken: string): Promise<TokenResponseDto>;
  signup(userData: User): Promise<User>;
}