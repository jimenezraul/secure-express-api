export class RoleDto {
    public uid: string;
    public name: string;

  constructor(role: any) {
    this.uid = role.uid;
    this.name = role.name;
  }
}

export class CreateRoleDto {
  public name: string;
}