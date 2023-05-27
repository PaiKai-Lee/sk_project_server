import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/lib/services/prisma.service';
import { User, Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { CreateUser, UpdateUser } from './interface';
import * as fs from 'fs/promises';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async create({ name, email, role, department, createdBy, updatedBy }: CreateUser) {
    const defaultPws = this.configService.get('DEFAULT_PWD');
    const saltRound = this.configService.get('SALT_ROUND');
    // hash password
    const salt = await bcrypt.genSalt(+saltRound);
    const hashPassword = await bcrypt.hash(defaultPws, salt);

    const result = await this.prisma.user.create({
      data: {
        name,
        password: hashPassword,
        email,
        role,
        department,
        createdBy,
        updatedBy
      }
    });

    return {
      id: result.id,
      name: result.name,
      role: result.role,
      email: result.email,
      department: result.department
    };
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    select?: Prisma.UserSelect;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    where?: Prisma.UserWhereInput;
  }) {
    const { skip, take, orderBy, select, where } = params;
    return this.prisma.user.findMany({
      skip,
      take,
      select,
      orderBy,
      where
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        department: true,
        points: true,
        avatar: true
      },
      where: {
        id
      }
    });
  }

  async update({ id, name, email, role, isDelete, department, updatedBy }: UpdateUser) {
    const updatedData = await this.prisma.user.update({
      data: {
        name,
        email,
        role,
        isDelete,
        department,
        updatedBy
      },
      where: {
        id
      }
    });

    return {
      id,
      name: updatedData.name,
      email: updatedData.email,
      role: updatedData.role,
      department: updatedData.department
    };
  }

  async changePassword({
    id,
    password,
    updatedBy
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
        updatedBy
      },
      where: {
        id
      }
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
        updatedBy
      },
      where: {
        id
      }
    });
  }

  async remove({ id, updatedBy }: { id: number; updatedBy: string }) {
    const deleteUser = await this.prisma.user.update({
      data: {
        isDelete: true,
        updatedBy
      },
      where: {
        id
      }
    });
    const { name } = deleteUser;

    console.log(`remove user ${name} successfully`);

    return `This action removes a #${id} user`;
  }

  async isUserExists(email: string): Promise<boolean> {
    const foundUser: User = await this.prisma.user.findUnique({
      where: {
        email
      }
    });
    return foundUser ? true : false;
  }

  async updateAvatar(id: number, avatarPath: string) {
    return this.prisma.user.update({
      data: {
        avatar: avatarPath
      },
      where: {
        id
      }
    });
  }

  async removeOldAvatar(id: number): Promise<void> {
    const data = await this.prisma.user.findUnique({
      select: {
        avatar: true
      },
      where: {
        id
      }
    });
    const { avatar: oldAvatarPath } = data;
    if (oldAvatarPath) {
      try {
        const rootPath = process.cwd();
        await fs.unlink(rootPath + '/public/' + oldAvatarPath);
        console.log('remove avatar successfully path: ' + oldAvatarPath)
      } catch (err) {
        console.error('remove avatar fail path: ' + oldAvatarPath);
      }
    }
  }
}
