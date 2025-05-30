import { Router } from 'express';
import { AuthController } from '@controllers/auth.controller';
import { UserRequestDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { ValidationMiddleware } from '@middlewares/validation.middleware';

export class AuthRoute implements Routes {
  public path = '/auth';
  public router = Router();
  public auth = new AuthController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.post('/signup', ValidationMiddleware(UserRequestDto), this.auth.signUp);
    this.router.post('/login', ValidationMiddleware(UserRequestDto), this.auth.logIn);
    this.router.post('/logout', AuthMiddleware, this.auth.logOut);
    this.router.post('/refresh', this.auth.refreshToken);
  }
}
