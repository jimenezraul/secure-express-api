import { Model, DataTypes } from 'sequelize';
import sequelize from '../db/db';

class Role extends Model {
    public id!: number;
    public uid!: string;
    public name!: string;
    public readonly createdAt!: Date;
    public readonly updatedAt!: Date;
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
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    timestamps: true,
  }
);

export default Role;
