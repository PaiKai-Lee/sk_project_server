import {
  IsNotEmpty,
  IsString,
  IsEnum,
  IsOptional,
  Matches,
} from 'class-validator';

import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { AccessCreateRole } from 'src/lib/enum';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'email 格式錯誤' })
  email: string;

  @ApiProperty({ name: 'role', enum: AccessCreateRole })
  @IsNotEmpty()
  @IsEnum(AccessCreateRole)
  role: AccessCreateRole;

  @IsOptional()
  @IsString()
  department: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}