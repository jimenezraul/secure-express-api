import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RequestWithUser } from '@interfaces/auth.interface';
import { User } from '@interfaces/users.interface';
import { AuthService } from '@/services/auth.service';
import { setCookies, deleteCookies } from '@/utils/cookies';
import { TokenResponseDto } from '@/dtos/users.dto';

export class AuthController {
  public auth = Container.get(AuthService);

  public signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const signUpUserData: User = await this.auth.signup(userData);

      res.status(201).json({ data: signUpUserData, message: 'signup' });
    } catch (error) {
      next(error);
    }
  };

  public logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const loginResponse: TokenResponseDto = await this.auth.login(userData);

      setCookies(res, loginResponse);
      
      res.status(200).json({
        access_token: loginResponse.access_token.token,
        refresh_token: loginResponse.refresh_token.token,
      });
    } catch (error) {
      next(error);
    }
  };

  public logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.user;
      const logOutUserData: User = await this.auth.logout(userData);

      deleteCookies(res);

      res.status(200).json({
        data: {
          id: logOutUserData.id,
          email: logOutUserData.email,
        },
      message: 'logout' });
    } catch (error) {
      next(error);
    }
  };

  public refreshToken = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const refreshToken = req.cookies.refresh_token;

      if (!refreshToken) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      const tokenData: TokenResponseDto = await this.auth.refreshToken(refreshToken);
      if (!tokenData) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }

      setCookies(res, tokenData);
      
      res.status(200).json({
        access_token: tokenData.access_token.token,
        refresh_token: tokenData.refresh_token.token,
      });
    } catch (error) {
      next(error);
    }
  };
}
