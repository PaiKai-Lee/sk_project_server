import {
  Controller,
  Req,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto, UpdateUserDto, FindAllDto, ChangePwdDto } from './dto/';
import { Prisma } from '@prisma/client';
import { Request } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    createUserDto.createdBy = req.user.name || 'system';
    createUserDto.updatedBy = req.user.name || 'system';
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll(@Query() queryString: FindAllDto) {
    const page = +queryString.page || 1;
    const take = +queryString.limit || 10;
    const skip = (page - 1) * take;
    const orderBy = {
      createdAt:
        queryString.order === 'asc'
          ? Prisma.SortOrder.asc
          : Prisma.SortOrder.desc,
    };

    // 基本提供的訊息
    const select = {
      id: true,
      name: true,
      role: true,
    };

    if (queryString.select) {
      // 選出DB實際有的欄位
      const columns = queryString.select
        .split(',')
        .filter((item) => item in Prisma.UserScalarFieldEnum);

      columns.forEach((column) => {
        select[column] = true;
      });
    }
    return this.userService.findAll({ skip, take, orderBy, select });
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    console.log(typeof id);
    return this.userService.findOne(id);
  }

  @Patch('info/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @Patch('/password')
  changePassword(@Req() req: Request, @Body() body: ChangePwdDto) {
    const userId = req.user.id;
    const { password, confirmPassword } = body;
    return this.userService.changePassword({
      userId,
      password,
      confirmPassword,
    });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
