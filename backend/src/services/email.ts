import nodemailer from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

const transporter = user && pass
  ? nodemailer.createTransport({
      service: 'gmail',
      auth: { user, pass },
    })
  : null;

export async function sendOrderConfirmation(order: {
  orderId: string;
  customerInfo: { name: string; email: string; deliveryMethod: string; deliveryDate: string };
  items: { name: string; price: number; quantity: number }[];
  total: number;
  paymentMethod: string;
}) {
  if (!transporter) {
    console.log('[Email] No configurado. Orden:', order.orderId);
    return;
  }

  const itemsList = order.items
    .map((item) => `<li>${item.name} x${item.quantity} - ₡${(item.price * item.quantity).toLocaleString()}</li>`)
    .join('');

  const isPickup = order.customerInfo.deliveryMethod === 'pickup';
  const reminder = order.paymentMethod !== 'card'
    ? '<div style="background:#e8f4f8;padding:16px;border-radius:8px;margin-top:16px;"><p style="margin:0;"><strong>Recordatorio:</strong> 50% adelanto - 50% contra retiro. SINPE / Transferencia al 8415-2888</p></div>'
    : '';

  await transporter.sendMail({
    from: user,
    to: order.customerInfo.email,
    subject: `Confirmación de pedido #${order.orderId} - La Gracia`,
    html: [
      '<div style="font-family:Arial,sans-serif;max-width:600px;">',
      '<div style="background:linear-gradient(135deg,#cd733d 0%,#e89360 100%);padding:24px;text-align:center;"><h1 style="color:white;margin:0;">¡Gracias por tu pedido!</h1></div>',
      '<div style="padding:24px;background:#FFF8F0;">',
      `<p>Hola <strong>${order.customerInfo.name}</strong>,</p>`,
      `<p>Tu pedido <strong>#${order.orderId}</strong> fue recibido.</p>`,
      `<p><strong>Fecha de ${isPickup ? 'retiro' : 'entrega'}:</strong> ${order.customerInfo.deliveryDate}</p>`,
      '<h3 style="color:#cd733d;">Productos:</h3>',
      `<ul style="line-height:1.8;">${itemsList}</ul>`,
      `<p style="font-size:18px;"><strong>Total: ₡${order.total.toLocaleString()}</strong></p>`,
      reminder,
      '<p style="margin-top:24px;">¿Dudas? WhatsApp: <a href="https://wa.me/50684152888">8415-2888</a></p>',
      '</div>',
      '<div style="background:#cd733d;padding:16px;text-align:center;color:white;">La Gracia by Marcela\'s Bakery · San José, Guadalupe</div>',
      '</div>',
    ].join(''),
  });
}

export async function sendAdminNotification(order: {
  orderId: string;
  customerInfo: { name: string; email: string; phone: string };
  total: number;
  paymentMethod: string;
  items: { name: string; quantity: number }[];
}) {
  if (!transporter || !user) return;

  const list = order.items.map((i) => `<li>${i.name} x${i.quantity}</li>`).join('');
  await transporter.sendMail({
    from: user,
    to: user,
    subject: `Nuevo pedido #${order.orderId}`,
    html: `<h2>Nuevo pedido</h2><p><strong>Cliente:</strong> ${order.customerInfo.name}</p><p><strong>Email:</strong> ${order.customerInfo.email}</p><p><strong>Teléfono:</strong> ${order.customerInfo.phone}</p><p><strong>Total:</strong> ₡${order.total.toLocaleString()}</p><p><strong>Pago:</strong> ${order.paymentMethod}</p><h3>Productos:</h3><ul>${list}</ul>`,
  });
}
