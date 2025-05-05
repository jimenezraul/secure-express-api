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

    public getRoleById = async (req: Request, res: Response): Promise<void> => {
        try {
            const roleId = req.params.id;
            const role = await this.rolesService.getRoleById(roleId);
            if (!role) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(200).json(role);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching role', error });
        }
    }

    public updateRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const roleId = req.params.id;
            const roleData: CreateRoleDto = req.body;
            const updatedRole = await this.rolesService.updateRole(roleId, roleData);
            if (!updatedRole) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(200).json(updatedRole);
        } catch (error) {
            res.status(500).json({ message: 'Error updating role', error });
        }
    }

    public deleteRole = async (req: Request, res: Response): Promise<void> => {
        try {
            const roleId = req.params.id;
            const deleted = await this.rolesService.deleteRole(roleId);
            if (!deleted) {
                res.status(404).json({ message: 'Role not found' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting role', error });
        }
    }
}