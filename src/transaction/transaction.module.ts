import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import { PrismaService } from 'src/lib/services/prisma.service';

@Module({
  controllers: [TransactionController],
  providers: [TransactionService, PrismaService]
})
export class TransactionModule {}
