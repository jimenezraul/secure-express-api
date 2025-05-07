import { Service } from 'typedi';
import { Role } from '@/models';
import { CreateRoleDto } from '@/dtos/roles.dto';
import { RoleDto } from '@/dtos/roles.dto';

@Service()
export class RolesService {
    
    public async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
        const role = await Role.create({ name: roleData.name });
        return new RoleDto(role);
    }

    public async getRoles(): Promise<RoleDto[]> {
        const roles = await Role.findAll();
        return roles.map(role => new RoleDto(role));
    }

    public async getRoleById(id: string): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { uid: id } });
        if (!role) return null;
        return new RoleDto(role);
    }

    public async updateRole(id: string, roleData: CreateRoleDto): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { uid: id } });
        if (!role) return null;

        role.name = roleData.name;
        await role.save();
        return new RoleDto(role);
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