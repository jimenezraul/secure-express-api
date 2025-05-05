import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/db';
import generateCustomID from '@/utils/generateCustomID';

class Role extends Model {
    public id!: number;
    public uid!: string;
    public name!: string;
    public readonly createdAt!: Date;
    public updatedAt!: Date;
}

Role.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    uid: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
    {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newRoleData) {
        newRoleData.uid = generateCustomID("ROLE_");
      },
      async beforeUpdate(updatedRoleData) {
        updatedRoleData.updatedAt = new Date();
      },
    },
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  }
);

export default Role;
