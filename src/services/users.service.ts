import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { User as UserInterface } from '@interfaces/users.interface';
import { UserDto } from '@/dtos/users.dto';
import generateCustomID from '@/utils/generateCustomID';
import { User, Role } from '@/models';

@Service()
export class UserService {
  public async findAllUser(): Promise<UserDto[]> {
    const users = await User.findAll({
      attributes: ['uid', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name', 'description'], 
        },
      ]
    });
    return users.map(user => new UserDto(user));
  }
  

  public async findUserById(userId: string): Promise<UserDto> {
    const findUser: UserInterface = await User.findOne({ where: { uid: userId },
    include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name', 'description'],
        },
      ],  
    });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return new UserDto(findUser);
  }

  public async createUser(userData: UserInterface): Promise<UserInterface> {
    const findUser = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
  
    return await User.create({
      uid: generateCustomID("USR_"),
      email: userData.email
    });
  }
  

  public async updateUser(userId: string, userData: UserInterface): Promise<UserInterface> {
    const findUser = await User.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
  
    await User.update(
      { ...userData },
      { where: { uid: userId } }
    );
  
    const updatedUser = await User.findOne({ where: { uid: userId } });
    if (!updatedUser) throw new HttpException(500, "Error retrieving updated user");
  
    return updatedUser as UserInterface;
  }
  
  public async deleteUser(userId: string): Promise<void> {
    const findUser: UserInterface = await User.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await User.destroy({ where: { uid: userId } });
  }

  // Get user by page and limit
  public async getUsersByPage(page: number, limit: number): Promise<{
    users: UserDto[];
    total: number;
    totalPages: number;
  }> {
    const offset = (page - 1) * limit;
  
    const { count, rows } = await User.findAndCountAll({
      distinct: true,
      limit,
      offset,
      attributes: ['uid', 'email', 'createdAt', 'updatedAt'],
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name', 'description'],
        },
      ],
    });
  
    const userDtos = rows.map(user => new UserDto(user));
    const totalPages = Math.ceil(count / limit);
  
    return {
      users: userDtos,
      total: count,
      totalPages,
    };
  }
  
}
