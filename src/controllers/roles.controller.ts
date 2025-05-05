import { Request, Response } from 'express';
import { Container } from 'typedi';
import { RolesService } from '@/services/roles.service';
import { RoleDto } from '@/dtos/roles.dto';
import { CreateRoleDto } from '@/dtos/roles.dto';

export class RoleController {
    public rolesService = Container.get(RolesService);

    public getAllRoles = async (req: Request, res: Response): Promise<void> => {
        try {
            const roles = await this.rolesService.getRoles();
            const roleDtos: RoleDto[] = roles.map(role => new RoleDto(role));
            res.status(200).json(roleDtos);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching roles', error });
        }
    }

    public createRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const roleData: CreateRoleDto = req.body;
            const newRole: RoleDto = await this.rolesService.createRole(roleData);
            res.status(201).json(newRole);
        } catch (error) {
            res.status(500).json({ message: 'Error creating role', error });
        }
    }
}