import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User as UserInterface } from '@interfaces/users.interface';
import { UserDto } from '@/dtos/users.dto';
import generateCustomID from '@/utils/generateCustomID';
import { User, Role } from '@models/index';

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
          attributes: ['uid', 'name'], 
        },
      ]
    });
    const userDtos = users.map(user => new UserDto(user));
    return userDtos;
  }
  

  public async findUserById(userId: string): Promise<UserDto> {
    const findUser: UserInterface = await User.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return new UserDto(findUser);
  }

  public async createUser(userData: UserInterface): Promise<UserInterface> {
    const findUser = await User.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
  
    const createdUser = await User.create({
      uid: generateCustomID("USR_"),
      email: userData.email
    });
  
    return createdUser;
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
}
