import { Request } from 'express';
import session from 'express-session';

declare module 'express-session' {
  export interface SessionData {
    user: { [key: string]: any };
  }
}

declare module 'express' {
  export interface Request {
    user: { [key: string]: any };
  }
}
