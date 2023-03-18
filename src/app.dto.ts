import { IsNotEmpty, Matches, IsAlphanumeric, Length } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @Matches(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, { message: 'email 格式錯誤' })
  email: string;

  @IsNotEmpty()
  @IsAlphanumeric()
  @Length(6, 12)
  password: string;
}
