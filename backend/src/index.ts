import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { connectDb } from './db.js';
import { ordersRouter } from './routes/orders.js';
import { adminRouter } from './routes/admin.js';
import { tilopayRouter } from './routes/tilopay.js';
import { productsRouter } from './routes/products.js';
import { uploadRouter } from './routes/upload.js';
import { configRouter } from './routes/config.js';
import { recipesRouter } from './routes/recipes.js';
import { ingredientsRouter } from './routes/ingredients.js';
import { authRouter } from './routes/auth.js';

const app = express();
const PORT = process.env.PORT || 3001;

const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  process.env.DASHBOARD_URL || 'http://localhost:5174',
];
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error('CORS no permitido'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login, intenta en 15 minutos',
});

const ordersLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
});

app.use('/api/auth/login', loginLimiter);
app.use('/api/orders', ordersLimiter);
app.use('/api/upload', uploadLimiter);

app.get('/api/health', (_, res) => res.json({ ok: true }));
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/tilopay', tilopayRouter);
app.use('/api/products', productsRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/config', configRouter);
app.use('/api/admin/recipes', recipesRouter);
app.use('/api/admin/ingredients', ingredientsRouter);

connectDb()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend La Gracia en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Error conectando a la base de datos:', err);
    process.exit(1);
  });
