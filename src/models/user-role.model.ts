// models/user-role.model.ts
import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/db';

class UserRole extends Model {}

UserRole.init({
  userId: {
    type: DataTypes.INTEGER,
    references: { model: 'users', key: 'id' },
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.INTEGER,
    references: { model: 'roles', key: 'id' },
    primaryKey: true,
  },
}, {
  sequelize,
  modelName: 'UserRole',
  tableName: 'user_roles',
  timestamps: false,
});

export default UserRole;
