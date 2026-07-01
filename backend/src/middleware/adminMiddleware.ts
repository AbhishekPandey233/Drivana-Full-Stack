import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { User } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_fallback_secret_key';

type AuthenticatedTokenPayload = JwtPayload & {
  id?: string;
};

export const requireAdmin = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing or invalid authorization token' });
    }

    const token = authorizationHeader.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET) as AuthenticatedTokenPayload;

    if (!decoded.id) {
      return res.status(401).json({ message: 'Invalid authorization token' });
    }

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: admin access required' });
    }

    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token', error });
  }
};