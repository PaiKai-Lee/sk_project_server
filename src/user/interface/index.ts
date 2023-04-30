enum AccessRole {
  Admin = 'Admin',
  User = 'User',
}

export interface CreateUser {
  name: string;
  email: string;
  role: AccessRole;
  department: string;
  createdBy: string;
  updatedBy: string;
}

export interface UpdateUser extends Omit<Partial<CreateUser>, 'createdBy'> {
  id: number;
}
