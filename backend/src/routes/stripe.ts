import { Router } from 'express';

export const stripeRouter = Router();

/**
 * POST /api/stripe/create-payment-intent
 *
 * Para activar: agrega STRIPE_SECRET_KEY=sk_live_... en backend/.env
 * Obtén las llaves en: https://dashboard.stripe.com/apikeys
 */
stripeRouter.post('/create-payment-intent', async (req, res) => {
  const stripeKey = process.env.STRIPE_SECRET_KEY;

  if (!stripeKey || stripeKey.startsWith('sk_test_TuClave')) {
    return res.status(503).json({
      error: 'Stripe no configurado',
      message: 'Agrega STRIPE_SECRET_KEY en backend/.env',
    });
  }

  const { amount, customerEmail, orderId } = req.body;
  if (!amount || !customerEmail) {
    return res.status(400).json({ error: 'Faltan campos: amount, customerEmail' });
  }

  try {
    // Import dinámico para no crashear si el paquete 'stripe' no está instalado
    const { default: Stripe } = await import('stripe' as any);
    const stripe = new Stripe(stripeKey, { apiVersion: '2024-06-20' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount)), // CRC ya usa enteros
      currency: 'crc',
      receipt_email: customerEmail,
      metadata: { orderId: orderId || '' },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err: any) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message || 'Error al crear PaymentIntent' });
  }
});
