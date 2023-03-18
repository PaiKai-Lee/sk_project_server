import {
  ConflictException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
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

    const foundUser: User = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (foundUser) throw new ConflictException();

    const defaultPws = this.configService.get('DEFAULT_PWD');
    const saltRound = this.configService.get('SALT_ROUND');
    // hash password
    const salt = await bcrypt.genSalt(+saltRound)
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

    return '成功建立使用者'
  
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
    userId,
    password,
    confirmPassword,
  }: {
    userId: number;
    password: string;
    confirmPassword: string;
  }) {
    if (password !== confirmPassword) throw new NotAcceptableException();
    return 'update user password';
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
