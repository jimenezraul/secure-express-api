import { Response, NextFunction } from 'express';
import { HttpException } from '@exceptions/HttpException';
import { RequestWithUser } from '@/interfaces/auth.interface';

export function isAdmin(req: RequestWithUser, res: Response, next: NextFunction) {
  const user = req.user; // AuthMiddleware must set this
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    throw new HttpException(403, 'Access denied. No roles found.');
  }

  const isAdmin = user.roles.some((role: any) => role.name === 'admin');
  if (!isAdmin) {
    throw new HttpException(403, 'Access denied. Admins only.');
  }

  next();
}
