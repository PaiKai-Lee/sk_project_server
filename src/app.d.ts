import { Request } from 'express';
import session from 'express-session';

interface UserSession {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  points: number;
}

declare module 'express-session' {
  export interface SessionData {
    user: UserSession;
  }
}

declare module 'express' {
  export interface Request {
    user: UserSession;
  }
}
