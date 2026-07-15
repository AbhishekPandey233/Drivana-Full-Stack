import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is required');
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const requireAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authentication token' });
    }

    const token = authorizationHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & { id?: string; role?: string };

    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid authentication token payload' });
    }

    // Attach minimal auth context to request object
    req.user = {
      id: decoded.id,
      role: decoded.role || 'user'
    };

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error });
  }
};