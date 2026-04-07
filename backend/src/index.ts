import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDb } from './db.js';
import { ordersRouter } from './routes/orders.js';
import { adminRouter } from './routes/admin.js';
import { tilopayRouter } from './routes/tilopay.js';
import { productsRouter } from './routes/products.js';
import { uploadRouter } from './routes/upload.js';
import { configRouter } from './routes/config.js';
import { recipesRouter } from './routes/recipes.js';
import { ingredientsRouter } from './routes/ingredients.js';

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

app.get('/api/health', (_, res) => res.json({ ok: true }));
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
