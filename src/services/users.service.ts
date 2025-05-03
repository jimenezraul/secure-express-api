import { hash } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/httpException';
import { User as UserInterface } from '@interfaces/users.interface';
import UserModel from '@models/users.model';
import { UserDto } from '@/dtos/users.dto';
import generateCustomID from '@/utils/generateCustomID';

@Service()
export class UserService {
  public async findAllUser(): Promise<UserDto[]> {
    const users = await UserModel.findAll();
    const userDtos = users.map(user => new UserDto(user));
    return userDtos;
  }
  

  public async findUserById(userId: string): Promise<UserDto> {
    const findUser: UserInterface = await UserModel.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return new UserDto(findUser);
  }

  public async createUser(userData: UserInterface): Promise<UserInterface> {
    const findUser = await UserModel.findOne({ where: { email: userData.email } });
    if (findUser) throw new HttpException(409, `This email ${userData.email} already exists`);
  
    const hashedPassword = await hash(userData.password, 10);
  
    const createdUser = await UserModel.create({
      uid: generateCustomID(),
      email: userData.email,
      password: hashedPassword,
    });
  
    return createdUser;
  }
  

  public async updateUser(userId: string, userData: UserInterface): Promise<UserInterface> {
    const findUser = await UserModel.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");
  
    const hashedPassword = await hash(userData.password, 10);
  
    await UserModel.update(
      { ...userData, password: hashedPassword },
      { where: { uid: userId } }
    );
  
    const updatedUser = await UserModel.findOne({ where: { uid: userId } });
    if (!updatedUser) throw new HttpException(500, "Error retrieving updated user");
  
    return updatedUser as UserInterface;
  }
  
  public async deleteUser(userId: string): Promise<void> {
    const findUser: UserInterface = await UserModel.findOne({ where: { uid: userId } });
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    await UserModel.destroy({ where: { uid: userId } });
  }
}
