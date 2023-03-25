import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
  IsNumberString,
  IsAlphanumeric,
  Length,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';

import { user_role } from '@prisma/client';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'email 格式錯誤' })
  email: string;

  @IsNotEmpty()
  @IsEnum(user_role)
  role: user_role;

  @IsOptional()
  @IsString()
  department: string;

  createdBy?: string;

  updatedBy?: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FindAllDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;

  @IsOptional()
  @IsString()
  order: string;

  @IsOptional()
  @IsString()
  fields: string;
}

export class ChangePwdDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
