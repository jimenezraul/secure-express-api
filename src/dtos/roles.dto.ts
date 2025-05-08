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

export class CreateRoleDto {
  public name: string;
}