import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { UpdateMeDto } from './dto/update-me.dto';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { PrismaService } from 'src/lib/services/prisma.service';

@Controller('me')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService,
    private readonly prisma: PrismaService
  ) {}

  @Get()
  findOne(@Req() req: Request) {
    return this.userService.findOne(req.user.id);
  }

  @Patch()
  update(@Body() updateMeDto: UpdateMeDto) {
    return;
  }

  @Post('avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  async updateAvatar(@Req() req: Request, @UploadedFile() file: Express.Multer.File) {
    const { id } = req.user;
    // 取得舊頭像位子，刪除舊頭像
    await this.userService.removeOldAvatar(id);
    // get avatar path
    const pathArr = file.path.split('\\');
    const avatarPath = '/' + pathArr.slice(1).join('/');
    //insert db
    await this.userService.updateAvatar(id, avatarPath);
    return 'success';
  }

  @Get('records')
  getTransactions(@Req() req: Request) {
    return this.transactionService.findAllById(req.user.id);
  }
}
