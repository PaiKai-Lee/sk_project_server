import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaService } from 'src/lib/services/prisma.service';

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService],
  exports:[PrismaService]
})
export class UserModule {}
