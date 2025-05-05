import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { HttpException } from '@exceptions/httpException';
import { DataStoredInToken, RequestWithUser } from '@interfaces/auth.interface';
import {User, Role} from '@models/index';
import { ACCESS_PUBLIC_KEY } from '../config/keys';

const getAuthorization = req => {
  const cookie = req.cookies?.['access_token'];
  if (cookie) return cookie;

  const authHeader = req.header('Authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.slice(7); // remove "Bearer "
  }

  return null;
};


export const AuthMiddleware = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = getAuthorization(req);
    if (!token) {
      return next(new HttpException(401, 'Authentication token missing'));
    }

    const decoded = verify(token, ACCESS_PUBLIC_KEY) as DataStoredInToken;
  
    const user = await User.findOne({
      where: { uid: decoded.uid },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name'],
        },
      ],
        });

    if (!user) {
      return next(new HttpException(401, 'User not found for authentication token'));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('AuthMiddleware error:', error);
    next(new HttpException(401, 'Invalid or expired authentication token'));
  }
};
