import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class TransactionService {
  constructor(private readonly prisma: PrismaService) {}
  findAll(params: { take: number; skip: number; where: any; orderBy: any }) {
    
    return this.prisma.transaction.findMany({});
  }
}
