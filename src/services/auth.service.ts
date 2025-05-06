import { compare } from 'bcrypt';
import { Service } from 'typedi';
import { HttpException } from '@exceptions/HttpException';
import { User as UserInterface } from '@interfaces/users.interface';
import { User, Role, UserRole } from '@models/index';
import { TokenResponseDto, Token, UserDto } from '@/dtos/users.dto';
import { generateTokens, generateAccessToken } from '@/security/generateTokens';
import { AuthServiceInterface, DataStoredInToken } from '@interfaces/auth.interface';
import { REFRESH_PUBLIC_KEY } from '@/config/keys';
import { verify } from 'jsonwebtoken';

@Service()
export class AuthService implements AuthServiceInterface {
  public async signup(userData: UserInterface): Promise<void> {
    const existingUser = await User.findOne({
      where: { email: userData.email },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name'],
        },
      ],
    });
  
    if (existingUser) {
      throw new HttpException(409, `This email ${userData.email} already exists`);
    }
  
    const role = await Role.findOne({ where: { name: 'user' } });
    if (!role) throw new HttpException(409, `This role doesn't exist`);
  
    // Create user without roles first
    const newUser = await User.create({
      ...userData
    });
  console.log('newUser', newUser.id);
    // Associate role after creation
    await UserRole.create({
      userId: newUser.id,
      roleId: role.id,
    });
  }
  
  public async login(userData: UserInterface): Promise<TokenResponseDto> {
    const findUser: UserInterface = await User.findOne({
      where: { email: userData.email },
      include: [
        {
          model: Role,
          as: 'roles',
          through: { attributes: [] },
          attributes: ['uid', 'name'], 
        },
      ]
    });
 
    // const findUser: UserInterface = UserModel.find(user => user.email === userData.email);
    if (!findUser) throw new HttpException(409, `This email ${userData.email} was not found`);

    const user: UserDto = new UserDto(findUser);
    const plainUser = { ...user };

    const isPasswordMatching: boolean = await compare(userData.password, findUser.password);
    if (!isPasswordMatching) throw new HttpException(409, "You're password not matching");

    const tokenData = generateTokens(plainUser);
    
    return {
      user,
      access_token: tokenData.access_token,
      refresh_token: tokenData.refresh_token,
      setRefreshToken: true,
    };
  }

  public async logout(userData: UserInterface): Promise<UserInterface> {
    const findUser: UserInterface = await User.findOne(
      {
        where: { email: userData.email } 
      }
    );
    if (!findUser) throw new HttpException(409, "User doesn't exist");

    return findUser;
  }

  public async refreshToken(refreshToken: string): Promise<TokenResponseDto> {
    const TOKEN_RENEW_THRESHOLD_DAYS = 7;
  
    let decoded: DataStoredInToken;

    try {
      decoded = verify(refreshToken, REFRESH_PUBLIC_KEY) as DataStoredInToken;
    } catch (error) {
      throw new Error("Invalid or expired refresh token");
    }
  
    const { uid, exp } = decoded;
  
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    const secondsLeft = exp - currentTimeInSeconds;
    const daysLeft = Math.floor(secondsLeft / (60 * 60 * 24));

    const findUser: UserInterface = await User.findOne({ where: { uid: uid } });
    
    if (!findUser) throw new Error("User not found");

    const user: UserDto = new UserDto(findUser);
    const plainUser = { ...user };
  
    let accessToken: Token;
    let refreshTokenResult: Token;
    let setRefreshToken: boolean = false;
  
    if (daysLeft < TOKEN_RENEW_THRESHOLD_DAYS) {
      const tokens = generateTokens(plainUser);
      accessToken = tokens.access_token;
      refreshTokenResult = tokens.refresh_token;
      setRefreshToken = true;
    } else {
      accessToken = generateAccessToken(plainUser);
      refreshTokenResult = {
        name: 'refresh_token',
        expiresIn: exp,
        token: refreshToken,
      }
    }
  
    return {
      user,
      access_token: accessToken,
      refresh_token: refreshTokenResult,
      setRefreshToken: setRefreshToken,
    };
  }
  
}
