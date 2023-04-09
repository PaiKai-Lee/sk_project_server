import { CreateUserDto } from '../dto/index.dto';

export interface CreateUser extends CreateUserDto {
  createdBy: string;
  updatedBy: string;
}
