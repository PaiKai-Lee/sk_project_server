import { Controller, Get, Param, Query, ParseIntPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { FindAllDto } from './dto/index.dto';
import { Prisma, UserRole } from '@prisma/client';
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
      id: 'id'
    };

    const filterColumn = COLUMN[column] || 'createdAt';

    const orderBy = {
      [filterColumn]: sort === 'asc' ? Prisma.SortOrder.asc : Prisma.SortOrder.desc
    };

    // 基本提供的訊息
    const select = {
      id: true,
      name: true,
      role: true
    };

    if (fields) {
      // 選出DB實際有的欄位
      const columns = fields.split(',').filter((item) => item in Prisma.UserScalarFieldEnum);

      columns.forEach((column) => {
        select[column] = true;
      });
    }

    const where = queryString.hideDelete ? { isDelete: false } : undefined;
    return this.userService.findAll({ skip, take, orderBy, select, where });
  }

  // 取得一名使用者
  @Get(':id(\\d+)')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  @Get('points')
  async getUserPoints() {
    const orderBy = {
      points: Prisma.SortOrder.desc
    };

    // 基本提供的訊息
    const select = {
      id: true,
      name: true,
      points: true
    };

    return this.userService.findAll({ orderBy, select });
  }

  @Get('partners')
  getPartners() {
    const params = {
      select: {
        id: true,
        name: true,
        department: true,
        avatar: true
      },
      where: {
        role: {
          not: UserRole.SuperAdmin
        }
      }
    };
    return this.userService.findAll(params);
  }
}
