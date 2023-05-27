import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  UseInterceptors,
  UploadedFile,
  NotAcceptableException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { TransactionService } from 'src/transaction/transaction.service';
import { Request } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { ChangePwdDto } from './dto/index.dto';

@Controller('me')
export class MeController {
  constructor(
    private readonly userService: UserService,
    private readonly transactionService: TransactionService
  ) {}

  @Get()
  findOne(@Req() req: Request) {
    return this.userService.findOne(req.user.id);
  }

  @Patch()
  update(@Body() updateMeDto) {
    return;
  }

  // 更換使用者頭像
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

  // 更新使用者密碼
  @Patch('password')
  async changePassword(@Req() req: Request, @Body() body: ChangePwdDto) {
    const { id, name } = req.user;
    const { password, confirmPassword } = body;

    if (password !== confirmPassword) throw new NotAcceptableException();

    await this.userService.changePassword({
      id,
      password,
      updatedBy: name
    });
    console.log(`user ${name} changePassword successfully`);
    return 'success';
  }

  @Get('records')
  getTransactions(@Req() req: Request) {
    return this.transactionService.findAllById(req.user.id);
  }
}
