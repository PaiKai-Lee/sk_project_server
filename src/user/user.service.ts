import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto';
import { user as User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, role, department } = createUserDto;

    const foundUser: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (foundUser) throw new ConflictException();

    const defaultPws = this.configService.get('DEFALUT_PWD');
    const saltRound = this.configService.get('SALT_ROUND');
    // hash password
    const hashPassword = await bcrypt.hash(defaultPws, saltRound);

    await this.prisma.user.create({
      data: {
        name,
        password: hashPassword,
        email,
        role,
        department,
      },
    });

    return {
      message: '成功建立使用者',
    };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    select?: Prisma.userSelect;
    orderBy?: Prisma.userOrderByWithRelationInput;
  }) {
    const { skip, take, orderBy, select } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      select,
      orderBy,
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
