import { Router, Request, Response, NextFunction } from 'express';
import { Order } from '../models/Order.js';

export const adminRouter = Router();

// ── Middleware simple de autenticación por API key ──────────────────────────
function requireAdminKey(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-admin-key'];
  const adminKey = process.env.ADMIN_KEY || 'admin123';
  if (key !== adminKey) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  next();
}

adminRouter.use(requireAdminKey);

// ── GET /api/admin/orders  (con filtros opcionales) ──────────────────────────
adminRouter.get('/orders', async (req, res) => {
  try {
    const { status, paymentStatus, page = '1', limit = '50' } = req.query;

    const filter: Record<string, string> = {};
    if (status) filter.orderStatus = status as string;
    if (paymentStatus) filter.paymentStatus = paymentStatus as string;

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
    ]);

    res.json({ orders, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error('Error listando órdenes:', err);
    res.status(500).json({ error: 'Error al listar órdenes' });
  }
});

// ── GET /api/admin/orders/:id ────────────────────────────────────────────────
adminRouter.get('/orders/:id', async (req, res) => {
  try {
    const order = await Order.findOne({ orderId: req.params.id });
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener orden' });
  }
});

// ── PATCH /api/admin/orders/:id/status ──────────────────────────────────────
adminRouter.patch('/orders/:id/status', async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({ error: `Estado inválido. Válidos: ${validStatuses.join(', ')}` });
    }

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      { orderStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar estado' });
  }
});

// ── PATCH /api/admin/orders/:id/payment ─────────────────────────────────────
adminRouter.patch('/orders/:id/payment', async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    const validStatuses = ['pending', 'completed', 'failed'];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({ error: `Estado inválido. Válidos: ${validStatuses.join(', ')}` });
    }

    const update: Record<string, unknown> = { paymentStatus };
    if (paymentStatus === 'completed') update.paidAt = new Date();

    const order = await Order.findOneAndUpdate(
      { orderId: req.params.id },
      update,
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Error al actualizar pago' });
  }
});

// ── GET /api/admin/stats ─────────────────────────────────────────────────────
adminRouter.get('/stats', async (_req, res) => {
  try {
    const [total, pending, confirmed, preparing, ready, delivered, paidTotal] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'confirmed' }),
      Order.countDocuments({ orderStatus: 'preparing' }),
      Order.countDocuments({ orderStatus: 'ready' }),
      Order.countDocuments({ orderStatus: 'delivered' }),
      Order.aggregate([
        { $match: { paymentStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),
    ]);

    res.json({
      total,
      byStatus: { pending, confirmed, preparing, ready, delivered },
      revenueCompleted: paidTotal[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json({ error: 'Error al obtener estadísticas' });
  }
});
