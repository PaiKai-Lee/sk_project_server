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
  ConflictException,
  NotAcceptableException,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  CreateUserDto,
  UpdateUserDto,
  FindAllDto,
  ChangePwdDto,
} from './dto/index.dto';
import { Prisma } from '@prisma/client';
import { Request } from 'express';
import { RoleGuard } from 'src/lib/guards/role.guard';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('使用者')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // 創建使用者
  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const isExists = await this.userService.isUserExists(email);
    if (isExists) throw new ConflictException();

    const createUser = {
      ...createUserDto,
      createdBy: req.user?.name || 'system',
      updatedBy: req.user?.name || 'system',
    };
    return this.userService.create(createUser);
  }

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
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // 使用者更新密碼
  @Patch('/password')
  async changePassword(@Req() req: Request, @Body() body: ChangePwdDto) {
    const { id, name } = req.user;
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) throw new NotAcceptableException();

    await this.userService.changePassword({
      id,
      password,
    });
    console.log(`user ${name} changePassword successfully`);
    return 'success';
  }

  // TODO更新使用者
  @Patch('info/:id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  // 刪除使用者
  @UseGuards(RoleGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }
}
