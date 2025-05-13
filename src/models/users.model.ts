import { DataTypes, Model } from 'sequelize';
import sequelize from '../db/db';
import bcrypt from 'bcrypt';
import generateCustomID from '@/utils/generateCustomID';
import Role from './roles.model';


class User extends Model {
  public id!: number;
  public uid!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  public addRole!: (role: Role | Role[] | number | number[]) => Promise<void>;
  public removeRole!: (role: Role | Role[] | number | number[]) => Promise<void>;

  validatePassword(loginPw: string): boolean {
    return bcrypt.compareSync(loginPw, this.password);
  }
}

User.init(
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
      defaultValue: () => generateCustomID('USR_'),
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  },
  {
    hooks: {
      // set up beforeCreate lifecycle "hook" functionality
      async beforeCreate(newUserData) {
        newUserData.password = await bcrypt.hash(newUserData.password, 10);
      },

      async beforeUpdate(updatedUserData) {
        updatedUserData.password = await bcrypt.hash(
          updatedUserData.password,
          10
        );
      },
    },
    sequelize,
    modelName: 'User',
    tableName: 'users',
    timestamps: true,
  }
);

export default User;
