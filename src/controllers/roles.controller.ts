import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';
import { RolesService } from '@/services/roles.service';
import { RoleDto, RoleRequestDto } from '@/dtos/roles.dto';

export class RoleController {
    public rolesService = Container.get(RolesService);

    public getAllRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roles = await this.rolesService.getRoles();
            const roleDtos: RoleDto[] = roles.map(role => new RoleDto(role));
            res.status(200).json(roleDtos);
        } catch (error) {
           next(error);
        }
    }

    public createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roleData: RoleRequestDto = req.body;
            const newRole: RoleDto = await this.rolesService.createRole(roleData);
            res.status(201).json(newRole);
        } catch (error) {
           next(error);
        }
    }

    public getRoleById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roleId = req.params.id;
            const role = await this.rolesService.getRoleById(roleId);
            if (!role) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(200).json(role);
        } catch (error) {
            next(error);
        }
    }

    public updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roleId = req.params.id;
            const roleData: RoleRequestDto = req.body;
            const updatedRole = await this.rolesService.updateRole(roleId, roleData);
            if (!updatedRole) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(200).json(updatedRole);
        } catch (error) {
           next(error);
        }
    }

    public deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const roleId = req.params.id;
            const deleted = await this.rolesService.deleteRole(roleId);
            if (!deleted) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
           next(error);
        }
    }
}