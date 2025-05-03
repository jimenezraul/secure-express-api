import { Response } from 'express';
import { TokenData } from '@interfaces/auth.interface';
import { TokenResponseDto } from '@/dtos/users.dto';
// set and delete cookies
const buildCookieHeader = (name: string, tokenData: TokenData): string => {
  return `${name}=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; Path=/; SameSite=Strict; Secure`;
};

const deleteCookie = (name: string): string => {
  return `${name}=; Max-age=0; Path=/; SameSite=Strict; Secure`;
};

// set and delete cookies
const setCookies = (res: Response, tokenData: TokenResponseDto): void => {
  const cookies: string[] = [];

  if (tokenData.access_token) {
    cookies.push(buildCookieHeader('access_token', tokenData.access_token));
  }

  if (tokenData.setRefreshToken) {
    cookies.push(buildCookieHeader('refresh_token', tokenData.refresh_token));
  }

  if (cookies.length > 0) {
    res.setHeader('Set-Cookie', cookies);
  }
};

const deleteCookies = (res: Response): void => {
  res.setHeader('Set-Cookie', [
    deleteCookie('access_token'),
    deleteCookie('refresh_token'),
  ]);
}
export { setCookies, deleteCookies };