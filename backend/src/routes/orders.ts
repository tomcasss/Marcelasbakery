import { Router } from 'express';
import { Order } from '../models/Order.js';
import { sendOrderConfirmation, sendAdminNotification } from '../services/email.js';

export const ordersRouter = Router();

ordersRouter.post('/', async (req, res) => {
  try {
    const { items, customerInfo, total, deliveryFee, paymentMethod, paymentProofUrl } = req.body;

    if (!items?.length || !customerInfo?.name || !customerInfo?.email || !customerInfo?.phone || total == null || !paymentMethod) {
      return res.status(400).json({ error: 'Faltan datos: items, customerInfo (name, email, phone), total, paymentMethod' });
    }

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
      paymentMethod,
      paymentProofUrl: paymentProofUrl || undefined,
      paymentStatus: 'pending',
      orderStatus: 'pending',
    });

    try {
      await sendOrderConfirmation({
        orderId: order.orderId,
        customerInfo: {
          name: order.customerInfo!.name,
          email: order.customerInfo!.email,
          deliveryMethod: order.customerInfo!.deliveryMethod,
          deliveryDate: order.customerInfo!.deliveryDate,
        },
        items: order.items.map((i) => ({ name: i.name ?? '', price: i.price ?? 0, quantity: i.quantity ?? 1 })),
        total: order.total,
        paymentMethod: order.paymentMethod,
      });
      await sendAdminNotification({
        orderId: order.orderId,
        customerInfo: {
          name: order.customerInfo!.name,
          email: order.customerInfo!.email,
          phone: order.customerInfo!.phone,
        },
        total: order.total,
        paymentMethod: order.paymentMethod,
        items: order.items.map((i) => ({ name: i.name ?? '', quantity: i.quantity ?? 1 })),
      });
    } catch (emailErr) {
      console.error('Error enviando email:', emailErr);
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
  } catch (err) {
    console.error('Error creando orden:', err);
    res.status(500).json({ error: 'Error al crear la orden' });
  }
});

ordersRouter.get('/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    console.error('Error obteniendo orden:', err);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
});
