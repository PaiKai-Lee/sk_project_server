import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/services/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  async findAll(params: {
    take: number;
    skip: number;
    where: any;
    orderBy: any;
  }) {
    const { take, skip, where, orderBy } = params;
    const [result, count] = await Promise.all([
      this.prisma.transaction.findMany({
        select: {
          id: true,
          orderId: true,
          save: true,
          cost: true,
          remark: true,
          user: {
            select: {
              name: true,
            },
          },
          order: {
            select: {
              createdAt: true,
            },
          },
        },
        orderBy,
        skip,
        take,
        where,
      }),
      this.prisma.transaction.count({ where }),
    ]);
    return {
      data: result,
      count,
    };
  }

  findAllById(id: number) {
    return this.prisma.transaction.findMany({
      select: {
        id: true,
        orderId: true,
        save: true,
        cost: true,
        remark: true,
      },
      where: {
        id,
      },
    });
  }
}
