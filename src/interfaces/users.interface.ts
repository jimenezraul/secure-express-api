import { RoleDto } from "@/dtos/roles.dto";

export interface User {
  id?: number;
  uid?: string;
  email?: string;
  password: string;
  roles?: RoleDto[];
  createdAt?: Date;
  updatedAt?: Date;
}
