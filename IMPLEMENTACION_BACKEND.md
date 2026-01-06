# Sistema de Pagos y Pedidos - La Gracia by Marcela's Bakery

## 🎯 Funcionalidades Implementadas (Frontend)

### 1. **Sistema de Checkout Completo**
- ✅ Formulario de información del cliente
- ✅ Selección de método de entrega (pickup/delivery)
- ✅ Selección de fecha
- ✅ Validación de formularios
- ✅ Resumen de pedido en tiempo real

### 2. **Métodos de Pago**

#### Tarjeta de Crédito/Débito
- Formulario de captura de datos de tarjeta
- Validación y formateo automático
- Listo para integración con Stripe

#### SINPE Móvil
- Instrucciones claras de pago
- Sistema de adelanto 50%
- Confirmación por WhatsApp

#### Transferencia Bancaria
- Sistema de adelanto 50%
- Envío de datos por email

### 3. **Context API**
- `CheckoutContext` para manejo de estado global
- Persistencia de órdenes en localStorage
- Gestión de información del cliente

## 🔧 Para Implementar Backend

### Opción 1: Backend Completo con Node.js + Express

```bash
# Crear carpeta backend
mkdir backend
cd backend
npm init -y

# Instalar dependencias
npm install express cors stripe nodemailer mongoose dotenv
npm install -D typescript @types/express @types/node ts-node
```

#### Estructura sugerida:
```
backend/
├── src/
│   ├── routes/
│   │   ├── orders.ts
│   │   └── payments.ts
│   ├── controllers/
│   │   ├── orderController.ts
│   │   └── paymentController.ts
│   ├── models/
│   │   ├── Order.ts
│   │   └── Customer.ts
│   ├── services/
│   │   ├── stripeService.ts
│   │   └── emailService.ts
│   ├── middleware/
│   │   └── errorHandler.ts
│   └── server.ts
├── .env
└── package.json
```

### Opción 2: Backend Serverless con Vercel/Netlify Functions

Más simple, sin necesidad de servidor:

```
api/
├── orders/
│   ├── create.ts
│   └── get.ts
└── payments/
    ├── stripe-webhook.ts
    └── process.ts
```

### Opción 3: Firebase (Más fácil para empezar)

```bash
npm install firebase
```

Usa Firestore para base de datos y Cloud Functions para pagos.

## 🔐 Integración con Stripe

### 1. Crear cuenta en Stripe
- Ir a https://stripe.com
- Crear cuenta
- Obtener claves API (test y producción)

### 2. Instalar SDK de Stripe en el frontend
```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### 3. Variables de entorno (.env)
```env
# Frontend
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...

# Backend
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
DATABASE_URL=mongodb://...
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=marcelasbakery@gmail.com
EMAIL_PASS=tu_contraseña_de_app
```

## 📧 Sistema de Emails

Usar **Nodemailer** o **SendGrid**:

### Con Nodemailer (Gmail):
```javascript
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'marcelasbakery@gmail.com',
    pass: 'tu_contraseña_de_app' // Usar App Password de Gmail
  }
});

// Enviar confirmación de pedido
await transporter.sendMail({
  from: 'marcelasbakery@gmail.com',
  to: customer.email,
  subject: 'Confirmación de Pedido - La Gracia',
  html: `
    <h1>¡Gracias por tu pedido!</h1>
    <p>Número de orden: ${orderId}</p>
    <p>Total: ₡${total.toLocaleString()}</p>
    ...
  `
});
```

## 💳 Flujo de Pago con Stripe

### 1. Cliente llena formulario
### 2. Frontend envía datos al backend
### 3. Backend crea PaymentIntent con Stripe
### 4. Frontend confirma pago con Stripe.js
### 5. Stripe procesa y devuelve resultado
### 6. Backend guarda orden en base de datos
### 7. Backend envía emails de confirmación

## 🗄️ Base de Datos

### Opción 1: MongoDB (Recomendado)

```javascript
// Modelo de Order
const orderSchema = new mongoose.Schema({
  orderId: String,
  customer: {
    name: String,
    email: String,
    phone: String,
    address: String
  },
  items: [{
    productId: Number,
    name: String,
    price: Number,
    quantity: Number
  }],
  total: Number,
  deliveryMethod: String,
  deliveryDate: Date,
  paymentMethod: String,
  paymentStatus: String,
  orderStatus: String,
  createdAt: Date,
  notes: String
});
```

### Opción 2: PostgreSQL con Prisma

```prisma
model Order {
  id            String   @id @default(uuid())
  orderId       String   @unique
  customerName  String
  customerEmail String
  customerPhone String
  items         Json
  total         Float
  paymentMethod String
  orderStatus   String
  createdAt     DateTime @default(now())
}
```

## 🚀 Endpoints API Necesarios

```
POST   /api/orders          - Crear nuevo pedido
GET    /api/orders/:id      - Obtener pedido
PATCH  /api/orders/:id      - Actualizar estado
POST   /api/payments/stripe - Crear payment intent
POST   /api/payments/confirm- Confirmar pago
POST   /api/webhooks/stripe - Webhook de Stripe
GET    /api/orders          - Listar pedidos (admin)
```

## 📱 Notificaciones

### WhatsApp Business API (Opcional)
- Integrar Twilio o WhatsApp Business API
- Enviar confirmaciones automáticas
- Recordatorios de pedido

## 🔒 Seguridad

1. **Variables de entorno** - Nunca exponer claves en frontend
2. **HTTPS** obligatorio para pagos
3. **Validación** en backend de todos los datos
4. **Rate limiting** para prevenir abuso
5. **CORS** configurado correctamente
6. **Webhooks firmados** de Stripe

## 📊 Dashboard Admin (Opcional)

Crear página protegida para:
- Ver todos los pedidos
- Cambiar estado de órdenes
- Ver estadísticas
- Gestionar productos
- Enviar notificaciones

## 🎨 Próximos Pasos Recomendados

1. **Inmediato**:
   - Crear cuenta Stripe (modo test)
   - Configurar Gmail App Password para emails
   - Decidir entre Firebase/MongoDB/Serverless

2. **Corto plazo**:
   - Implementar backend básico
   - Conectar Stripe
   - Sistema de emails

3. **Mediano plazo**:
   - Dashboard administrativo
   - Notificaciones automáticas
   - Sistema de inventario

4. **Largo plazo**:
   - App móvil
   - Programa de lealtad
   - Análisis y reportes

## 💡 Alternativas Sin Backend (MVP Rápido)

Si necesitas lanzar rápido sin backend:

1. **Formularios + Email**:
   - Usar EmailJS o Formspree
   - Pedidos llegan por email
   - Confirmar manualmente

2. **Google Forms + Sheets**:
   - Integrar Google Forms API
   - Pedidos en Google Sheets
   - Procesar manualmente

3. **WhatsApp Direct**:
   - Botón directo a WhatsApp
   - Enviar datos formateados
   - Gestión manual

## 🆘 Soporte y Documentación

- **Stripe Docs**: https://stripe.com/docs
- **Stripe Costa Rica**: Acepta pagos de Costa Rica
- **Firebase**: https://firebase.google.com/docs
- **Vercel Functions**: https://vercel.com/docs/functions

---

**Nota**: El código frontend ya está listo. Solo falta conectar con backend real.
