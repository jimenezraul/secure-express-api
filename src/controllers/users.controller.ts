import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { User } from '@interfaces/users.interface';
import { UserService } from '@services/users.service';
import { UserDto } from '@/dtos/users.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class UserController {
  public user = Container.get(UserService);

  public getMe = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const user = req.user as User;

      if (!user) throw new Error('User not found');

      const userId = user.uid;

      const findOneUserData: UserDto = await this.user.findUserById(userId);
      res.status(200).json(findOneUserData);
    } catch (error) {
      next(error);
    }
  };


  public getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const findAllUsersData: UserDto[] = await this.user.findAllUser();

      res.status(200).json(findAllUsersData);
    } catch (error) {
      next(error);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id
      const findOneUserData: UserDto = await this.user.findUserById(userId);

      res.status(200).json({ data: findOneUserData, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userData: User = req.body;
      const createUserData: User = await this.user.createUser(userData);

      res.status(201).json({ data: createUserData, message: 'created' });
    } catch (error) {
      next(error);
    }
  };

  public updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.params.id;
      const userData: User = req.body;
      const updateUserData: User = await this.user.updateUser(userId, userData);

      res.status(200).json({ data: updateUserData, message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId: string = req.params.id;
      await this.user.deleteUser(userId);

      res.status(200).json({ message: `user with id ${userId} is deleted` });
    } catch (error) {
      next(error);
    }
  };

  public getUserPagination = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page: number = parseInt(req.query.page as string || '1');
      
      if (page < 1) throw new Error('Page must be greater than 0');
      const limit: number = parseInt(req.query.limit as string || '5');

      if (limit < 1 || limit > 50) throw new Error('Limit must be between 1 and 50');

      const {users, total, totalPages}: { users: UserDto[]; total: number, totalPages: number } = await this.user.getUsersByPage(page, limit);
      
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };


}
