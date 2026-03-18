// Ejemplo de backend con Express + Stripe
// Este archivo es un EJEMPLO de cómo implementar el backend
// Guárdalo en: backend/src/server.ts

/*
import express from 'express';
import cors from 'cors';
import Stripe from 'stripe';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

// Middleware
app.use(cors());
app.use(express.json());

// Configurar email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ==========================================
// ENDPOINT: Crear Payment Intent
// ==========================================
app.post('/api/payments/create-intent', async (req, res) => {
  try {
    const { amount, customerEmail, customerName, orderId, items } = req.body;

    // Crear Payment Intent en Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // en colones
      currency: 'crc',
      metadata: {
        orderId,
        customerName,
        customerEmail,
      },
      receipt_email: customerEmail,
      description: `Pedido #${orderId} - La Gracia by Marcela's Bakery`,
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error creando payment intent:', error);
    res.status(500).json({ error: 'Error procesando pago' });
  }
});

// ==========================================
// ENDPOINT: Crear Orden
// ==========================================
app.post('/api/orders', async (req, res) => {
  try {
    const orderData = req.body;

    // Aquí guardarías en tu base de datos
    // Por ahora solo simulamos
    const order = {
      id: `ORD-${Date.now()}`,
      ...orderData,
      createdAt: new Date(),
      status: 'pending',
    };

    // Enviar email de confirmación
    await sendOrderConfirmationEmail(order);

    // Enviar notificación al admin
    await sendAdminNotification(order);

    res.json(order);
  } catch (error) {
    console.error('Error creando orden:', error);
    res.status(500).json({ error: 'Error creando orden' });
  }
});

// ==========================================
// ENDPOINT: Webhook de Stripe
// ==========================================
app.post(
  '/api/webhooks/stripe',
  express.raw({ type: 'application/json' }),
  async (req, res) => {
    const sig = req.headers['stripe-signature']!;

    try {
      const event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );

      // Manejar diferentes tipos de eventos
      switch (event.type) {
        case 'payment_intent.succeeded':
          const paymentIntent = event.data.object;
          console.log('Pago exitoso:', paymentIntent.id);
          
          // Actualizar orden en base de datos
          // await updateOrderStatus(paymentIntent.metadata.orderId, 'paid');
          break;

        case 'payment_intent.payment_failed':
          console.log('Pago fallido');
          break;
      }

      res.json({ received: true });
    } catch (error) {
      console.error('Error en webhook:', error);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }
);

// ==========================================
// ENDPOINT: Obtener orden
// ==========================================
app.get('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Aquí buscarías en tu base de datos
    // const order = await Order.findOne({ orderId: id });
    
    res.json({ message: 'Orden encontrada' });
  } catch (error) {
    res.status(500).json({ error: 'Error obteniendo orden' });
  }
});

// ==========================================
// FUNCIONES AUXILIARES
// ==========================================

async function sendOrderConfirmationEmail(order: any) {
  const itemsList = order.items
    .map(
      (item: any) =>
        `<li>${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}</li>`
    )
    .join('');

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: order.customerInfo.email,
    subject: `Confirmación de Pedido #${order.id} - La Gracia`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #cd733d 0%, #e89360 100%); padding: 30px; text-align: center;">
          <h1 style="color: white; margin: 0;">¡Gracias por tu pedido!</h1>
        </div>
        
        <div style="padding: 30px; background: #FFF8F0;">
          <h2 style="color: #cd733d;">Detalles del Pedido</h2>
          <p><strong>Número de pedido:</strong> ${order.id}</p>
          <p><strong>Fecha de ${order.customerInfo.deliveryMethod === 'pickup' ? 'retiro' : 'entrega'}:</strong> ${order.customerInfo.deliveryDate}</p>
          
          <h3 style="color: #cd733d; margin-top: 30px;">Productos:</h3>
          <ul style="line-height: 1.8;">
            ${itemsList}
          </ul>
          
          <div style="background: white; padding: 20px; border-radius: 10px; margin-top: 20px;">
            <p style="margin: 0;"><strong>Total:</strong> <span style="color: #cd733d; font-size: 24px;">₡${order.total.toLocaleString()}</span></p>
          </div>
          
          <div style="margin-top: 30px; padding: 20px; background: #369db1; color: white; border-radius: 10px;">
            <h3 style="margin-top: 0;">Información Importante</h3>
            ${
              order.paymentMethod === 'sinpe' || order.paymentMethod === 'transfer'
                ? `
              <p>Por favor realiza el pago del <strong>50% (₡${(order.total / 2).toLocaleString()})</strong></p>
              <p>SINPE al número: <strong>8415-2888</strong></p>
              <p>El 50% restante se paga al momento de ${order.customerInfo.deliveryMethod === 'pickup' ? 'recoger' : 'recibir'} tu pedido.</p>
            `
                : '<p>Tu pago ha sido procesado exitosamente.</p>'
            }
          </div>
          
          <div style="margin-top: 30px; text-align: center;">
            <p>¿Tienes preguntas? Contáctanos:</p>
            <a href="https://wa.me/50684152888" style="background: #25D366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px;">
              WhatsApp: 8415-2888
            </a>
          </div>
        </div>
        
        <div style="background: #cd733d; padding: 20px; text-align: center; color: white;">
          <p style="margin: 0;">La Gracia by Marcela's Bakery</p>
          <p style="margin: 5px 0; font-size: 14px;">San José, Guadalupe</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}

async function sendAdminNotification(order: any) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: 'marcelasbakery@gmail.com', // Admin
    subject: `🔔 Nuevo Pedido #${order.id}`,
    html: `
      <h2>Nuevo pedido recibido</h2>
      <p><strong>Cliente:</strong> ${order.customerInfo.name}</p>
      <p><strong>Email:</strong> ${order.customerInfo.email}</p>
      <p><strong>Teléfono:</strong> ${order.customerInfo.phone}</p>
      <p><strong>Total:</strong> ₡${order.total.toLocaleString()}</p>
      <p><strong>Método de pago:</strong> ${order.paymentMethod}</p>
      <p><strong>Fecha de entrega:</strong> ${order.customerInfo.deliveryDate}</p>
      
      ${order.customerInfo.notes ? `<p><strong>Notas:</strong> ${order.customerInfo.notes}</p>` : ''}
      
      <hr>
      <h3>Productos:</h3>
      <ul>
        ${order.items.map((item: any) => `<li>${item.name} x${item.quantity}</li>`).join('')}
      </ul>
    `,
  };

  await transporter.sendMail(mailOptions);
}

// ==========================================
// INICIAR SERVIDOR
// ==========================================
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📧 Email configurado: ${process.env.EMAIL_USER}`);
});

export default app;
*/

// Este es un archivo de ejemplo. Para usarlo:
// 1. Crea una carpeta 'backend' en la raíz del proyecto
// 2. Copia este código
// 3. Instala las dependencias necesarias
// 4. Configura las variables de entorno
// 5. Ejecuta con: npm run dev
