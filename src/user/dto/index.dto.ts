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

import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'email 格式錯誤' })
  email: string;

  @ApiProperty({ name: 'role', enum: UserRole })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  @IsString()
  department: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class FindAllDto {
  @IsOptional()
  @IsNumberString()
  page?: number;

  @IsOptional()
  @IsNumberString()
  limit?: number;

  @IsOptional()
  @IsString()
  order?: string;

  @IsOptional()
  @IsString()
  fields?: string;
}

export class ChangePwdDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
