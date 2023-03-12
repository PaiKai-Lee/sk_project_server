import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // TODO Auth middleware
    // get jwt token from request header

    // parse header

    // use id get user data

    // assign info to req.user

    req.user = {
      id: 1,
      name: 'test',
      role: 'SuperAdmin',
    };
    next();
  }
}
