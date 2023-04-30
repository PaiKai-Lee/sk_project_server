import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Req,
  Body,
  Param,
  ConflictException,
  ForbiddenException,
  UseGuards,
  ParseIntPipe,
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, UpdateUserDto } from './dto/index.dto';
import { Request } from 'express';
import { RoleGuard } from 'src/lib/guards/role.guard';

@Controller('admin/user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  test() {
    return 'test admin/user';
  }

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

  // TODO更新使用者
  @Patch(':id/info')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    // SuperAdmin 不能被此API更新
    if (id === 1) throw new ForbiddenException();

    const { email } = updateUserDto;

    if (email) {
      const isExists = await this.userService.isUserExists(email);
      if (isExists) throw new ConflictException();
    }

    const updateUser = {
      ...updateUserDto,
      id,
      updatedBy: req.user.name,
    };

    return this.userService.update(updateUser);
  }

  @Post(':id/password')
  resetPassword(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    // SuperAdmin 不能被重製密碼
    if (id === 1) throw new ForbiddenException();
    return this.userService.resetPassword({ id, updatedBy: req.user.name });
  }

  // 刪除使用者
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    // SuperAdmin 不能刪
    if (id === 1) throw new ForbiddenException();
    return this.userService.remove({ id, updatedBy: req.user.name });
  }
}
