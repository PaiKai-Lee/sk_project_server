import { Request } from 'express';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  department: string;
  points: number;
  pwdChanged: number;
}

declare module 'express' {
  export interface Request {
    user: User;
  }
}
