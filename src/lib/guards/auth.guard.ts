import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const { path, method } = request;

    // 不需要使用auth guard的路由
    if (this.isPathNotRequiredVerification({ path, method })) return true;

    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_SECRET')
      });
      const foundUser = await this.prisma.user.findUnique({
        where: { id: payload.id }
      });

      const { id, name, email, department, role, points, pwdChanged } = foundUser;

      request.user = {
        id,
        name,
        email,
        department,
        role,
        points,
        pwdChanged
      };
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private isPathNotRequiredVerification({ path, method }) {
    const allowPaths = [
      { method: 'POST', path: '/api/login' },
      { method: 'GET', path: '/api/transaction' },
      { method: 'GET', path: '/api/user/points' },
      { method: 'GET', path: '/api/user/partners' }
    ];
    return allowPaths.some((allowPath) => allowPath.method === method && allowPath.path === path);
  }
}
