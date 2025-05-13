import {  IsString, IsNotEmpty, MinLength, MaxLength } from 'class-validator';

export class RoleDto {
    public uid: string;
    public name: string;
    public description: string;

  constructor(role: any) {
    this.uid = role.uid;
    this.name = role.name;
    this.description = role.description;
  }
}

export class RoleRequestDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  @IsNotEmpty()
  public name: string;
  @IsString()
  @MinLength(5)
  @MaxLength(100)
  @IsNotEmpty()
  public description: string;
}

export class RoleToUserDto {
  @IsString()
  @IsNotEmpty()
  userId: string;
  @IsString()
  @IsNotEmpty()
  roleId: string;
}

