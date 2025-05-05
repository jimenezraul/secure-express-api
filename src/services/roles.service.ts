import { Service } from 'typedi';
import { Role } from '@/models';
import { CreateRoleDto } from '@/dtos/roles.dto';
import { RoleDto } from '@/dtos/roles.dto';

@Service()
export class RolesService {
    
    public async createRole(roleData: CreateRoleDto): Promise<RoleDto> {
        const role = await Role.create({ ...roleData });
        const roleDto = new RoleDto(role);
        return roleDto;
    }

    public async getRoles(): Promise<RoleDto[]> {
        console.log("Fetching all roles");
        const roles = await Role.findAll();
        console.log("roles: ", roles);
        const roleDtos = roles.map(role => new RoleDto(role));
        return roleDtos;
    }

    public async getRoleById(id: string): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { id } });
        if (!role) return null;
        const roleDto = new RoleDto(role);
        return roleDto;
    }
}