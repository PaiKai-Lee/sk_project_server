import {
  Controller,
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
  NotFoundException
} from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { CreateUserDto, UpdateUserDto } from './dto/index.dto';
import { Request } from 'express';
import { RoleGuard } from 'src/lib/guards/role.guard';

@Controller('admin/user')
@UseGuards(RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}
  // 創建使用者
  @Post()
  async create(@Req() req: Request, @Body() createUserDto: CreateUserDto) {
    const { email } = createUserDto;

    const isExists = await this.userService.isUserExists(email);
    if (isExists) throw new ConflictException();

    const createUser = {
      ...createUserDto,
      createdBy: req.user?.name || 'system',
      updatedBy: req.user?.name || 'system'
    };
    return this.userService.create(createUser);
  }

  // TODO更新使用者
  @Patch(':id/info')
  async update(
    @Req() req: Request,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    const { user: authUser } = req;
    const foundUser = await this.userService.findOne(id);
    if (!foundUser) throw new NotFoundException('沒有該使用者');
    // SuperAdmin 不能被此API更新
    if (foundUser.role === 'SuperAdmin') throw new ForbiddenException('SuperAdmin 不能更新');

    const { email, isDelete } = updateUserDto;
    // email不能重複
    if (email) {
      const isExists = await this.userService.isUserExists(email);
      if (isExists) throw new ConflictException();
    }

    if (isDelete) {
      if (id === authUser.id) throw new ForbiddenException('不能把自己設為停用');
      // 除了SuperAdmin 不能修改管理者帳號狀態
      if (foundUser.role !== 'User' && authUser.role !== 'SuperAdmin')
        throw new ForbiddenException('不能修改管理者帳號狀態');
    }

    const updateUser = {
      ...updateUserDto,
      id,
      updatedBy: req.user.name
    };

    return this.userService.update(updateUser);
  }

  @Post(':id/password')
  resetPassword(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const { user: authUser } = req;
    // SuperAdmin 不能被重製密碼
    if (authUser.role === 'SuperAdmin') throw new ForbiddenException('SuperAdmin 不能被重製密碼');
    return this.userService.resetPassword({ id, updatedBy: req.user.name });
  }

  // 刪除使用者
  @Delete(':id')
  remove(@Req() req: Request, @Param('id', ParseIntPipe) id: number) {
    const { user: authUser } = req;
    // SuperAdmin 不能刪
    if (authUser.role === 'SuperAdmin') throw new ForbiddenException('SuperAdmin 不能刪除');
    return this.userService.remove({ id, updatedBy: req.user.name });
  }
}
