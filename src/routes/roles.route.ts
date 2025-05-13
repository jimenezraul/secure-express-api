import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import { RoleController } from '@controllers/roles.controller';
import { isAdmin, ValidationMiddleware, AuthMiddleware } from '@/middlewares';
import { RoleRequestDto } from '@/dtos/roles.dto';

export class RoleRoute implements Routes {
    public path = '/roles';
    public router = Router();
    public role = new RoleController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, AuthMiddleware, isAdmin, this.role.getAllRoles);
        this.router.post(`${this.path}`, AuthMiddleware, isAdmin, ValidationMiddleware(RoleRequestDto), this.role.createRole);
        this.router.get(`${this.path}/:id`, AuthMiddleware, isAdmin, this.role.getRoleById);
        this.router.put(`${this.path}/:id`, AuthMiddleware, isAdmin, ValidationMiddleware(RoleRequestDto), this.role.updateRole);
        this.router.delete(`${this.path}/:id`, AuthMiddleware, isAdmin, this.role.deleteRole);
    }
}