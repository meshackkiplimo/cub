import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        user_id: string;
        role: string;
        email: string;
        first_name: string;
        last_name: string;
      };
    }
  }
}