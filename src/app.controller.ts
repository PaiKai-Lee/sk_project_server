import { Controller, Get, Post, Session, Body } from '@nestjs/common';
import { SessionData } from 'express-session';
import { AppService } from './app.service';
import { AuthService } from './auth.service';
import { loginDto } from './app.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(@Session() session): string {
    return this.appService.getHello();
  }

  @Get('/check')
  async checkUser(@Session() session: SessionData) {
    return session?.user
  }

  @Post('/login')
  async login(@Body() loginDto: loginDto, @Session() session: SessionData) {
    const foundUser = await this.authService.login(loginDto);

    const { id, name, role, department, email, points, pwdChanged } = foundUser;

    console.log(`user ${name} login successfully`);

    session.user = {
      id,
      name,
      email,
      role,
      department,
      points,
    };

    return {
      id,
      name,
      email,
      role,
      department,
      points,
      pwdChanged,
    };
  }

  @Post('/logout')
  logout(@Session() session) {
    const { name } = session.user;
    session.destroy();
    console.log(`user ${name} logout successfully`);
    return 'success';
  }
}
