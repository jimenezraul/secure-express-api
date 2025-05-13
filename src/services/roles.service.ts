import { Service } from 'typedi';
import { Role, User } from '@/models';
import { RoleRequestDto } from '@/dtos/roles.dto';
import { RoleDto } from '@/dtos/roles.dto';

@Service()
export class RolesService {
    
    public async createRole(roleData: RoleRequestDto): Promise<RoleDto> {
        const role = await Role.create({
            ...roleData
        });
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

    public async updateRole(id: string, roleData: RoleRequestDto): Promise<RoleDto | null> {
        const role = await Role.findOne({ where: { uid: id } });
        if (!role) return null;
    
        Object.assign(role, roleData);
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

    public async addRoleToUser(userId: string, roleId: string): Promise<void> {
        const user = await User.findOne({ where: { uid: userId } });
        const role = await Role.findOne({ where: { uid: roleId } });
        if (!user || !role) return;
        user.addRole(role);
    }

    public async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
        const user = await User.findOne({ where: { uid: userId } });
        const role = await Role.findOne({ where: { uid: roleId } });
        if (!user || !role) return;
        user.removeRole(role);
    }

}