import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
  IsNumberString
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
}

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @Matches(/^[A-za-z0-9]{6,12}$/, { message: 'password 格式錯誤' })
  password?: string;
}

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
  select: string;
}
