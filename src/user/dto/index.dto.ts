import { Transform } from 'class-transformer';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  IsAlphanumeric,
  Length,
  IsBoolean,
} from 'class-validator';

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

  @IsOptional()
  @IsBoolean()
  @Transform(({value}) => Boolean(value))
  hideDelete?:boolean;
}

export class ChangePwdDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
