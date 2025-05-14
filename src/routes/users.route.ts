import { Router } from 'express';
import { UserController } from '@controllers/users.controller';
import { UserRequestDto, UpdateUserDto } from '@dtos/users.dto';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@middlewares/validation.middleware';
import { AuthMiddleware } from '@middlewares/auth.middleware';
import { isAdmin } from '@/middlewares/isAdmin.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    // get me
    this.router.get(`${this.path}/me`, AuthMiddleware, this.user.getMe);
    // Protect ALL routes (including PUT/POST) unless public
    this.router.get(`${this.path}`, AuthMiddleware, isAdmin, this.user.getUsers);
    // get user pagination
    this.router.get(`${this.path}/pagination`, AuthMiddleware, this.user.getUserPagination);
    // get user by id
    this.router.get(`${this.path}/:id`, AuthMiddleware, this.user.getUserById);
    this.router.post(`${this.path}`, AuthMiddleware, ValidationMiddleware(UserRequestDto), this.user.createUser);
    this.router.put(`${this.path}/:id`, AuthMiddleware, ValidationMiddleware(UpdateUserDto), this.user.updateUser);
    this.router.delete(`${this.path}/:id`, AuthMiddleware, this.user.deleteUser);
  }
}