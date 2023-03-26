import { Type } from 'class-transformer';
import {
  IsArray,
  IsInt,
  IsNumberString,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class Data {
  @IsInt()
  id: number;

  @IsInt()
  @Max(99999)
  @Min(0)
  cost: number;

  @IsInt()
  @Max(99999)
  @Min(0)
  save: number;

  @IsOptional()
  @IsString()
  remark: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Data)
  data: Data[];
}

export class FindAllDto {
  @IsOptional()
  @IsNumberString()
  page: number;

  @IsOptional()
  @IsNumberString()
  limit: number;
}
