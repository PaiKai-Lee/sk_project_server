import { Transform } from 'class-transformer';
import { IsString, IsOptional, IsNumberString, IsBoolean } from 'class-validator';

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
  @Transform(({ value }) => Boolean(value))
  hideDelete?: boolean;
}
