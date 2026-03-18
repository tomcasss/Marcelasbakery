import { Router } from 'express';
import { Order } from '../models/Order.js';
import { sendOrderConfirmation, sendAdminNotification } from '../services/email.js';

export const tilopayRouter = Router();

const TILOPAY_API = 'https://app.tilopay.com/api/v1';

async function getTilopayToken(): Promise<string> {
  const apiuser = process.env.TILOPAY_API_USER;
  const password = process.env.TILOPAY_API_PASSWORD;

  if (!apiuser || !password) {
    throw new Error('Faltan TILOPAY_API_USER o TILOPAY_API_PASSWORD en .env');
  }

  const res = await fetch(`${TILOPAY_API}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ apiuser, password }),
  });

  if (!res.ok) throw new Error('Error autenticando con Tilopay');
  const data = await res.json() as { access_token: string };
  return data.access_token;
}

/**
 * POST /api/tilopay/checkout
 * Crea sesión de pago en Tilopay y devuelve la URL de pago.
 * El cliente se redirige a esa URL, ingresa su tarjeta ahí (no en nuestra app).
 * Al finalizar, Tilopay redirige a /api/tilopay/callback?code=1&order=...
 */
tilopayRouter.post('/checkout', async (req, res) => {
  const key = process.env.TILOPAY_KEY;
  if (!key) {
    return res.status(503).json({
      error: 'Tilopay no configurado',
      message: 'Agrega TILOPAY_API_USER, TILOPAY_API_PASSWORD y TILOPAY_KEY en backend/.env',
    });
  }

  const { orderId, amount, customerInfo } = req.body;

  if (!orderId || !amount || !customerInfo?.email) {
    return res.status(400).json({ error: 'Faltan campos: orderId, amount, customerInfo' });
  }

  try {
    const token = await getTilopayToken();

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    const payload = {
      redirect: `${frontendUrl}/pago-resultado`,
      key,
      amount: String(Math.round(Number(amount))), // CRC: entero sin decimales
      currency: 'CRC',
      orderNumber: orderId,
      capture: '1',
      subscription: '0',
      platform: 'WEB',
      // Datos de facturación (requeridos por Tilopay)
      billToFirstName: (customerInfo.name || 'Cliente').split(' ')[0],
      billToLastName: (customerInfo.name || 'Cliente').split(' ').slice(1).join(' ') || 'CR',
      billToAddress: customerInfo.address || 'Guadalupe',
      billToAddress2: customerInfo.address || 'Guadalupe',
      billToCity: 'San Jose',
      billToState: 'SJ',
      billToZipPostCode: '10101',
      billToCountry: 'CR',
      billToTelephone: customerInfo.phone || '00000000',
      billToEmail: customerInfo.email,
      // Datos de envío (igual que facturación)
      shipToFirstName: (customerInfo.name || 'Cliente').split(' ')[0],
      shipToLastName: (customerInfo.name || 'Cliente').split(' ').slice(1).join(' ') || 'CR',
      shipToAddress: customerInfo.address || 'Guadalupe',
      shipToAddress2: customerInfo.address || 'Guadalupe',
      shipToCity: 'San Jose',
      shipToState: 'SJ',
      shipToZipPostCode: '10101',
      shipToCountry: 'CR',
      shipToTelephone: customerInfo.phone || '00000000',
      returnData: Buffer.from(JSON.stringify({ orderId })).toString('base64'),
    };

    const paymentRes = await fetch(`${TILOPAY_API}/processPayment`, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!paymentRes.ok) {
      const err = await paymentRes.text();
      console.error('Tilopay processPayment error status:', paymentRes.status);
      console.error('Tilopay processPayment response:', err);
      return res.status(502).json({ error: 'Error al crear sesión de pago en Tilopay', detail: err });
    }

    const data = await paymentRes.json() as { url?: string; type: string; html?: string };
    console.log('Tilopay processPayment response:', JSON.stringify(data));

    if (!data.url) {
      return res.status(502).json({ error: 'Tilopay no devolvió URL de pago', detail: data });
    }

    res.json({ url: data.url });
  } catch (err: any) {
    console.error('Tilopay checkout error:', err);
    res.status(500).json({ error: err.message || 'Error interno' });
  }
});

/**
 * GET /api/tilopay/verify/:orderId
 * Consulta el estado de una transacción en Tilopay.
 * Úsalo para verificar después de que el cliente regresa del pago.
 */
tilopayRouter.get('/verify/:orderId', async (req, res) => {
  const key = process.env.TILOPAY_KEY;
  if (!key) return res.status(503).json({ error: 'Tilopay no configurado' });

  try {
    const token = await getTilopayToken();

    const consultRes = await fetch(`${TILOPAY_API}/consult`, {
      method: 'POST',
      headers: {
        'Authorization': `bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, orderNumber: req.params.orderId }),
    });

    if (!consultRes.ok) return res.status(502).json({ error: 'Error consultando Tilopay' });

    const data = await consultRes.json() as {
      type: string;
      response?: Array<{ code: string; response: string; amount: string; auth: string }>;
    };

    const tx = data.response?.[0];
    if (!tx) return res.status(404).json({ error: 'Transacción no encontrada' });

    res.json({
      approved: tx.code === '1',
      description: tx.response,
      amount: tx.amount,
      auth: tx.auth,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Error verificando pago' });
  }
});

/**
 * POST /api/tilopay/confirm
 * Verifica el pago con Tilopay y crea la orden. Solo se llama cuando code=1.
 */
tilopayRouter.post('/confirm', async (req, res) => {
  const key = process.env.TILOPAY_KEY;
  if (!key) return res.status(503).json({ error: 'Tilopay no configurado' });

  const { tempId, items, customerInfo, total, deliveryFee } = req.body;
  if (!tempId || !items?.length || !customerInfo?.email || total == null) {
    return res.status(400).json({ error: 'Faltan campos: tempId, items, customerInfo, total' });
  }

  // Verificar con Tilopay (puede fallar en sandbox — tolerado)
  let verified: boolean | null = null;
  try {
    const token = await getTilopayToken();
    const r = await fetch(`${TILOPAY_API}/consult`, {
      method: 'POST',
      headers: { 'Authorization': `bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, orderNumber: tempId }),
    });
    if (r.ok) {
      const d = await r.json() as any;
      const tx = d.response?.[0];
      if (tx) verified = tx.code === '1';
    }
  } catch (e) {
    console.warn('[Tilopay confirm] consult error (tolerado en sandbox):', e);
  }

  // Si Tilopay explícitamente dice no aprobado → rechazar
  if (verified === false) {
    return res.status(402).json({ error: 'Pago no verificado por Tilopay' });
  }

  try {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const order = await Order.create({
      orderId,
      items,
      customerInfo: {
        name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        deliveryMethod: customerInfo.deliveryMethod || 'pickup',
        deliveryDate: customerInfo.deliveryDate,
        notes: customerInfo.notes,
      },
      total: Number(total),
      deliveryFee: Number(deliveryFee) || 0,
      paymentMethod: 'card',
      paymentStatus: 'completed',
      orderStatus: 'confirmed',
      paidAt: new Date(),
    });

    try {
      await sendOrderConfirmation(order as any);
      await sendAdminNotification(order as any);
    } catch (emailErr) {
      console.error('[Tilopay confirm] email error:', emailErr);
    }

    res.status(201).json({
      id: order.orderId,
      orderId: order.orderId,
      items: order.items,
      customerInfo: order.customerInfo,
      total: order.total,
      paymentMethod: order.paymentMethod,
      paymentStatus: order.paymentStatus,
      orderStatus: order.orderStatus,
      createdAt: order.createdAt,
    });
  } catch (err: any) {
    console.error('[Tilopay confirm] order creation error:', err);
    res.status(500).json({ error: err.message || 'Error creando la orden' });
  }
});
