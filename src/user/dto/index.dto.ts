import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsNumberString,
  IsAlphanumeric,
  Length,
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
}

export class ChangePwdDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
