import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly prisma: PrismaService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    // if (!req.session?.user) throw new UnauthorizedException();

    // const foundUser = await this.prisma.user.findUnique({
    //   where: { id: req.session.user.id },
    // });

    // const { id, name, email, department, role, points } = foundUser;

    // req.user = {
    //   id,
    //   name,
    //   email,
    //   department,
    //   role,
    //   points,
    // };

    next();
  }
}
