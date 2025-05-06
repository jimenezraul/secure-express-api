import User from './users.model';
import Role from './roles.model';
import UserRole from './user-role.model';

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: 'userId',
  as: 'roles',
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: 'roleId',
  as: 'users',
});

export { User, Role, UserRole };
