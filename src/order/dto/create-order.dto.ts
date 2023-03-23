import { Type } from 'class-transformer';
import { IsArray, IsInt, IsOptional, IsString, Max, ValidateNested } from 'class-validator';

export class Data {
  @IsInt()
  id: number;

  @IsInt()
  @Max(99999)
  cost: number;

  @IsInt()
  @Max(99999)
  save: number;

  @IsOptional()
  @IsString()
  remark: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({each:true})
  @Type(() => Data)
  data: Data[];
}
