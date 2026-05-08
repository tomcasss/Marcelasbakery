import { Router } from 'express';
import { generateTokens, verifyRefreshToken, AuthRequest } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { LoginSchema } from '../schemas/validation.js';

export const authRouter = Router();

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

authRouter.post('/login', validateRequest(LoginSchema), async (req: AuthRequest, res) => {
  const { password } = req.body;

  if (password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Contraseña incorrecta' });
  }

  const { accessToken, refreshToken } = generateTokens('admin');

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json({
    accessToken,
    expiresIn: 15 * 60,
  });
});

authRouter.post('/refresh', verifyRefreshToken, (req: AuthRequest, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }

  const { accessToken } = generateTokens(req.user.adminId);
  res.json({ accessToken, expiresIn: 15 * 60 });
});

authRouter.post('/logout', (_req, res) => {
  res.clearCookie('refreshToken');
  res.json({ ok: true });
});
