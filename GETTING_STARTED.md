# Getting Started with La Gracia (Security-Enhanced)

## Quick Setup

### 1. Install Dependencies
```bash
cd backend && npm install
cd ../dashboard && npm install
cd ../frontend && npm install
```

### 2. Configure Environment

**Backend** (`backend/.env`):
```
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/lagracia
JWT_SECRET=your-secret-key-here-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-key-here-change-in-production
ADMIN_PASSWORD=admin123
FRONTEND_URL=http://localhost:5173
DASHBOARD_URL=http://localhost:5174
```

**Frontend** (`frontend/.env`):
```
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
VITE_API_URL=http://localhost:3001
```

**Dashboard** (`dashboard/.env`):
```
VITE_API_URL=http://localhost:3001
```

### 3. Start Servers

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Dashboard:
```bash
cd dashboard
npm run dev
```

Terminal 3 - Frontend:
```bash
cd frontend
npm run dev
```

Then open:
- **Frontend**: http://localhost:5173
- **Dashboard**: http://localhost:5174 (use password: `admin123`)

---

## Security Features Implemented

### Authentication
- **JWT-based**: Access tokens (15 min) + Refresh tokens (7 days)
- **HttpOnly Cookies**: Tokens stored securely, not accessible to JavaScript
- **Auto-Refresh**: Dashboard automatically refreshes expired tokens
- **Login Rate Limiting**: Max 5 attempts per 15 minutes

### Input Validation
- **Zod Schemas**: All API inputs validated at middleware level
- **Type-Safe**: Full TypeScript type checking
- **Error Messages**: Detailed validation error messages in API responses

### Rate Limiting
- **Login**: 5 attempts / 15 minutes
- **Orders**: 10 requests / 1 minute  
- **Uploads**: 20 uploads / 1 minute
- **Status**: Returns 429 (Too Many Requests) when exceeded

### Protected Routes
- ✅ Admin dashboard (recipes, ingredients, products, config)
- ✅ Image uploads
- ✅ Order management
- ✅ Payment processing

---

## Testing the Security Implementation

### 1. Test JWT Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password":"admin123"}'

# Response:
# {
#   "accessToken": "eyJ...",
#   "expiresIn": 900
# }
```

### 2. Test Protected Route (without token)
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","price":100}'

# Response: 401 Unauthorized
# {
#   "error": "Token requerido"
# }
```

### 3. Test with Valid Token
```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{"name":"Test Product","description":"A test","price":100,"category":"test"}'

# Response: 400 (DB error because no MongoDB, but auth succeeded!)
```

### 4. Test Rate Limiting
```bash
# Try logging in 6 times rapidly
for i in {1..6}; do
  curl -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"password":"admin123"}'
done

# After 5 attempts, you'll get:
# 429 Too Many Requests
# "Demasiados intentos de login, intenta en 15 minutos"
```

---

## Dashboard Usage

### Login
1. Go to http://localhost:5174
2. Enter password: `admin123`
3. Click "Entrar"

### Features
- 📦 **Pedidos**: View and manage customer orders
- 🥕 **Ingredientes**: Manage ingredient catalog with pricing
- 🛒 **Catálogo**: Create and edit products
- 🌐 **Sitio Web**: Manage website images
- 💰 **Costos**: Calculate recipe costs

### Logout
- Click "Salir" button in top-right corner

---

## Development Notes

### JWT Flow
1. **Login**: User submits password → Returns `accessToken` + `refreshToken` in httpOnly cookie
2. **API Calls**: Dashboard includes `Authorization: Bearer accessToken` header
3. **Token Expiry**: When token expires (15 min), dashboard:
   - Gets 401 response
   - Automatically calls `/api/auth/refresh`
   - Gets new `accessToken`
   - Retries the original request
4. **Logout**: Clears `refreshToken` cookie + clears cached token

### Database Connection
- If MongoDB is unavailable, backend runs in "test mode"
- JWT auth endpoints work without database
- DB operations gracefully fail with clear error messages
- See `backend/src/db.ts` for development mode handling

### Adding New Endpoints

To add a new protected admin endpoint:

```typescript
// In your route file
import { verifyToken } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validation.js';
import { YourSchema } from '../schemas/validation.js';

router.post('/', 
  verifyToken,                    // ← Requires JWT
  validateRequest(YourSchema),    // ← Validates input
  async (req, res) => {
    // Your handler
  }
);
```

---

## Security Checklist

Before production deployment:

- [ ] Generate strong random JWT_SECRET (32+ chars)
- [ ] Generate strong random JWT_REFRESH_SECRET (32+ chars)
- [ ] Change ADMIN_PASSWORD to secure password (12+ chars)
- [ ] Set NODE_ENV=production
- [ ] Configure MongoDB Atlas for cloud database
- [ ] Set CORS origins to production domains
- [ ] Enable HTTPS on all endpoints
- [ ] Review rate limiting thresholds
- [ ] Enable error logging and monitoring
- [ ] Run `npm audit` and fix vulnerabilities

---

## Troubleshooting

### "MongoDB not available"
- **Expected**: Dev mode allows auth without database
- **Solution**: Install MongoDB locally or use MongoDB Atlas
  ```bash
  # macOS
  brew install mongodb-community
  brew services start mongodb-community
  
  # Or use Docker
  docker run -d -p 27017:27017 mongo
  ```

### Dashboard shows "Error de login"
- Check `ADMIN_PASSWORD` in backend `.env` file
- Verify backend is running on port 3001
- Check browser console for API errors

### "Token requerido" on admin endpoints
- Ensure `VITE_API_URL` points to backend
- Verify dashboard login was successful
- Check that access token is included in request headers

### Rate limit too strict/loose
- Edit `backend/src/index.ts`
- Adjust `max` values in rate limiters:
  ```typescript
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,  // ← Change this number
  });
  ```

---

## Next Steps

1. **Set up MongoDB**: Use local MongoDB or MongoDB Atlas
2. **Test Dashboard**: Login and manage orders/products
3. **Test Protected Routes**: Verify JWT auth is working
4. **Review Security Report**: See `SECURITY_REFACTOR_REPORT.md`
5. **Deploy to Production**: Follow security checklist above

---

For more details, see `SECURITY_REFACTOR_REPORT.md`
