// Test if server initializes correctly
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';

console.log('🔍 Testing Server Initialization...\n');

const app = express();
const PORT = process.env.PORT || 3001;

console.log('✓ Express initialized');

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
console.log('✓ CORS configured');

app.use(express.json());
app.use(cookieParser());
console.log('✓ Middleware configured');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: 'Demasiados intentos de login',
});
console.log('✓ Rate limiters configured');

// Health endpoint
app.get('/api/health', (_, res) => {
  res.json({ ok: true });
});
console.log('✓ Health endpoint registered');

// Start server
app.listen(PORT, () => {
  console.log(`\n✅ Test Server Running on http://localhost:${PORT}`);
  console.log('   Health check: GET http://localhost:3001/api/health');
  console.log('\n🔐 JWT Auth Endpoints:');
  console.log('   POST http://localhost:3001/api/auth/login');
  console.log('   POST http://localhost:3001/api/auth/refresh');
  console.log('   POST http://localhost:3001/api/auth/logout');
});
