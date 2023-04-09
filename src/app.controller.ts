import { Controller, Get, Post, Body, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './lib/services/auth.service';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './app.dto';
import { Request } from 'express';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/check')
  async checkUser(@Req() req: Request) {
    return req.user;
  }

  @Post('/login')
  async login(@Body() loginDto: loginDto) {
    const foundUser = await this.authService.login(loginDto);

    const { id, name, role, department, email, points, pwdChanged } = foundUser;

    const payload = { id, name, email };

    const accessToken = await this.jwtService.signAsync(payload);

    console.log(`user ${name} login successfully`);

    return {
      id,
      name,
      email,
      role,
      department,
      points,
      pwdChanged,
      accessToken,
    };
  }

}
