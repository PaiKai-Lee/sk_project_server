import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/services/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUser, UpdateUser } from './interface';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async create({
    name,
    email,
    role,
    department,
    createdBy,
    updatedBy,
  }: CreateUser) {
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
    select?: Prisma.UserSelect;
    orderBy?: Prisma.UserOrderByWithRelationInput;
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

  async update({ id, name, email, role, department, updatedBy }: UpdateUser) {
    const updatedData = await this.prisma.user.update({
      data: {
        name,
        email,
        role,
        department,
        updatedBy,
      },
      where: {
        id,
      },
    });

    return {
      id,
      name: updatedData.name,
      email: updatedData.email,
      role: updatedData.role,
      department: updatedData.department,
    };
  }

  async changePassword({
    id,
    password,
    updatedBy,
  }: {
    id: number;
    password: string;
    updatedBy: string;
  }): Promise<void> {
    // hash password
    const saltRound = this.configService.get('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound);
    const hashPassword = await bcrypt.hash(password, salt);
    await this.prisma.user.update({
      data: {
        password: hashPassword,
        pwdChanged: { increment: 1 },
        updatedBy,
      },
      where: {
        id,
      },
    });
  }

  async resetPassword({ id, updatedBy }: { id: number; updatedBy: string }) {
    const defaultPws = this.configService.get('DEFAULT_PWD');
    const saltRound = this.configService.get('SALT_ROUND');
    // hash password
    const salt = await bcrypt.genSalt(+saltRound);
    const hashPassword = await bcrypt.hash(defaultPws, salt);
    await this.prisma.user.update({
      data: {
        password: hashPassword,
        pwdChanged: 0,
        updatedBy,
      },
      where: {
        id,
      },
    });
  }

  async remove({ id, updatedBy }: { id: number; updatedBy: string }) {
    const deleteUser = await this.prisma.user.update({
      data: {
        isDelete: true,
        updatedBy,
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
