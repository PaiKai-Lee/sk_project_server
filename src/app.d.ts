import { Request } from 'express';

interface User {
  id: number;
  name: string;
  email: string;
  role: 'User' | 'Admin' | 'SuperAdmin';
  department: string;
  points: number;
  pwdChanged: number;
  avatar: string;
}

declare module 'express' {
  export interface Request {
    user: User;
  }
}
