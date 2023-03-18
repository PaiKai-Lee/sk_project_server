import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { user as User } from '@prisma/client';
import { loginDto } from './app.dto';
import { PrismaService } from './lib/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}
  async login(loginDto: loginDto): Promise<User> {
    const { email, password } = loginDto;
    const foundUser = await this.prisma.user.findFirst({
      where: {
        email: email,
        isDelete: false,
      },
    });

    console.log(foundUser)

    if (!foundUser) throw new NotFoundException();

    const result = await bcrypt.compare(password, foundUser.password);

    if (!result) throw new UnauthorizedException();

    return foundUser;
  }
}
