import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-env';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key-change-in-env';

export interface AuthRequest extends Request {
  user?: { adminId: string };
}

export function verifyToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.accessToken || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { adminId: string };
    req.user = decoded;
    next();
  } catch (err: any) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado', code: 'TOKEN_EXPIRED' });
    }
    return res.status(401).json({ error: 'Token inválido' });
  }
}

export function verifyRefreshToken(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies.refreshToken;

  if (!token) {
    return res.status(401).json({ error: 'Refresh token requerido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET) as { adminId: string };
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: 'Refresh token inválido' });
  }
}

export function generateTokens(adminId: string) {
  const accessToken = jwt.sign(
    { adminId },
    JWT_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { adminId },
    JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}
