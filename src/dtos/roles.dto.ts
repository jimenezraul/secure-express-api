export class RoleDto {
    public id: string;
    public uid: string;
    public name: string;

  constructor(role: any) {
    this.id = role.id;
    this.uid = role.uid;
    this.name = role.name;
  }
}