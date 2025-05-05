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
      unique: true
    },    
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
    hooks: {
      beforeValidate: (role) => {
        if (!role.uid) {
          role.setDataValue('uid', generateCustomID('ROLE_'));
        }
      },
      beforeUpdate: (role) => {
        role.setDataValue('updatedAt', new Date());
      },
    },
  }
);

export default Role;
