import { AccessCreateRole } from "src/lib/enum";

export interface CreateUser {
  name: string;
  email: string;
  role: AccessCreateRole;
  department: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateUser extends Omit<Partial<CreateUser>, 'createdBy'> {
  id: number;
}
