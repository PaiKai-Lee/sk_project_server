import { Controller, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { FindAllDto } from './dto';
import { TransactionService } from './transaction.service';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  // TODO 排序 & 查詢條件尚未完成
  @Get()
  findAll(@Query() queryString: FindAllDto) {
    const page = +queryString.page || 1;
    const take = +queryString.limit || 10;
    const skip = (page - 1) * take;
    const where = queryString.user
      ? { user: { name: queryString.user } }
      : undefined;
    const orderBy = {
      order: {
        createdAt:
          queryString.order === 'asc'
            ? Prisma.SortOrder.asc
            : Prisma.SortOrder.desc,
      },
    };
    return this.transactionService.findAll({ take, skip, where, orderBy });
  }
}
