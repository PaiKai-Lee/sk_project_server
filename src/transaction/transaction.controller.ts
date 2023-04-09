import { Controller, Get, Query } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { TransactionService } from './transaction.service';
import { FindAllDto } from './dto/index.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('交易明細')
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll(@Query() queryString: FindAllDto) {
    const page = +queryString.page || 1;
    const take = +queryString.limit || undefined;
    const skip = (page - 1) * take || undefined;
    const where = queryString.user
      ? { user: { name: queryString.user } }
      : undefined;
    const orderBy = {
      id:
        queryString.order === 'asc'
          ? Prisma.SortOrder.asc
          : Prisma.SortOrder.desc,
    };
    return this.transactionService.findAll({ take, skip, where, orderBy });
  }
}
