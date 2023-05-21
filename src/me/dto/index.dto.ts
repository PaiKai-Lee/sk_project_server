import { IsAlphanumeric, IsNotEmpty, Length } from 'class-validator';

export class ChangePwdDto {
  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;

  @IsNotEmpty()
  confirmPassword: string;
}
