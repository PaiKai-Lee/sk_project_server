import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
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
    const { name, email, role, department, createdBy, updatedBy } =
      createUserDto;

    const defaultPws = this.configService.get('DEFAULT_PWD');
    const saltRound = this.configService.get('SALT_ROUND');
    // hash password
    const salt = await bcrypt.genSalt(+saltRound);
    const hashPassword = await bcrypt.hash(defaultPws, salt);

    await this.prisma.user.create({
      data: {
        name,
        password: hashPassword,
        email,
        role,
        department,
        createdBy,
        updatedBy,
      },
    });

    return '成功建立使用者';
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
      where: {
        isDelete: false,
      },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    // const {name,password,email,department,role}
    // this.prisma.user.update({
    //   where:{
    //     id
    //   },
    //   data:updateUserDto
    // })
    return `This action updates a #${id} user`;
  }

  async changePassword({
    id,
    password,
  }: {
    id: number;
    password: string;
  }): Promise<void> {
    // hash password
    const saltRound = this.configService.get('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    await this.prisma.user.update({
      data: {
        password: hashPassword,
        pwdChanged: { increment: 1 },
      },
      where: {
        id,
      },
    });
  }

  async remove(id: number) {
    const deleteUser = await this.prisma.user.update({
      data: {
        isDelete: false,
      },
      where: {
        id,
      },
    });
    const { name } = deleteUser;

    console.log(`remove user ${name} successfully`);

    return `This action removes a #${id} user`;
  }

  async isUserExists(email: string): Promise<boolean> {
    const foundUser: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    return foundUser ? true : false;
  }
}
