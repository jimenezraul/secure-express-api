import { IsEmail, IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

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
  constructor(user: any) {
    this.uid = user.uid;
    this.email = user.email;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
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
