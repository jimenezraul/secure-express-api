import { Service } from 'typedi';
import { Role } from '@/models';
import { CreateRoleDto } from '@/dtos/roles.dto';
import { RoleDto } from '@/dtos/roles.dto';
import generateCustomID from '@/utils/generateCustomID';

@Service()
export class RolesService {
    
    public async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
        const role = await Role.create({ name: roleData.name });
        const roleDto = new RoleDto(role);
        return roleDto;
    }

    public async getRoles(): Promise<RoleDto[]> {
        const roles = await Role.findAll();
        const roleDtos = roles.map(role => new RoleDto(role));
        return roleDtos;
    }

    public async getRoleById(id: string): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { uid: id } });
        if (!role) return null;
        const roleDto = new RoleDto(role);
        return roleDto;
    }

    public async updateRole(id: string, roleData: CreateRoleDto): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { uid: id } });
        if (!role) return null;

        role.name = roleData.name;
        await role.save();

        const roleDto = new RoleDto(role);
        return roleDto;
    }

    public async deleteRole(id: string): Promise<boolean> {
        const role = await Role.findOne({
            where: { uid: id }
         });
        if (!role) return false;

        await role.destroy();
        return true;
    }
}