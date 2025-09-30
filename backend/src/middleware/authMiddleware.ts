// AuthMiddleware Formula:
// AuthMiddleware = ExtractToken(req.headers.authorization) -> VerifyJWT(token) -> AttachUser(req.user) -> Next() | Reject(401)

import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/authService';
import { JWTPayload } from '../services/authService';

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

const authService = new AuthService();

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
  try {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    const payload = authService.verifyToken(token);

    // Attach user to request
    req.user = payload;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}