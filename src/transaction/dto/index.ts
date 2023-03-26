import { IsNumberString, IsOptional, IsString } from 'class-validator';

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
  user: string;
}
