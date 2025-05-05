import { Routes } from '@interfaces/routes.interface';
import { Router } from 'express';
import { RoleController } from '@controllers/roles.controller';

export class RoleRoute implements Routes {
    public path = '/roles';
    public router = Router();
    public role = new RoleController();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get(`${this.path}`, this.role.getAllRoles);
        this.router.post(`${this.path}`, this.role.createRole);
    }
}