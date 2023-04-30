import {
  Controller,
  Req,
  Get,
  Body,
  Patch,
  Param,
  Query,
  ParseIntPipe,
  NotAcceptableException,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  FindAllDto,
  ChangePwdDto,
} from './dto/index.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('使用者')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 取得使用者
  @Get()
  findAll(@Query() queryString: FindAllDto) {
    const page = +queryString.page || 1;
    const take = +queryString.limit || undefined;
    const skip = (page - 1) * take || undefined;
    const fields = queryString.fields;
    let column: string;
    let sort: string;
    if (queryString.order) {
      [column, sort] = queryString.order.split(',');
    }

    const COLUMN = {
      points: 'points',
      createdAt: 'createdAt',
      id: 'id',
    };

    const filterColumn = COLUMN[column] || 'createdAt';

    const orderBy = {
      [filterColumn]:
        sort === 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc,
    };

    // 基本提供的訊息
    const select = {
      id: true,
      name: true,
      role: true,
    };

    if (fields) {
      // 選出DB實際有的欄位
      const columns = fields
        .split(',')
        .filter((item) => item in Prisma.UserScalarFieldEnum);

      columns.forEach((column) => {
        select[column] = true;
      });
    }
    return this.userService.findAll({ skip, take, orderBy, select });
  }

  // 取得一名使用者
  @Get(':id(\\d+)')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get('points')
  async getUserPoints() {
    const orderBy = {
      points: Prisma.SortOrder.desc,
    };

    // 基本提供的訊息
    const select = {
      id: true,
      name: true,
      points: true,
    };

    return this.userService.findAll({ orderBy, select });
  }

  // 使用者更新密碼
  @Patch('password')
  async changePassword(@Req() req: Request, @Body() body: ChangePwdDto) {
    const { id, name } = req.user;
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) throw new NotAcceptableException();

    await this.userService.changePassword({
      id,
      password,
      updatedBy:name
    });
    console.log(`user ${name} changePassword successfully`);
    return 'success';
  }
}
