import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';
import { RoleDto } from './roles.dto';

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UpdateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(9)
  @MaxLength(32)
  public password: string;
}

export class UserDto {
  uid: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  roles: RoleDto[];
  constructor(user: any) {
    this.uid = user.uid;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
    this.roles = user.roles ? user.roles.map((role: any) => new RoleDto(role)) : [];
  }
}

export class TokenResponseDto {
  public user: UserDto;
  public access_token: Token;
  public refresh_token: Token;
  public setRefreshToken?: boolean;
}

export class Token {
  name: string;
  expiresIn: number;
  token: string;
}
