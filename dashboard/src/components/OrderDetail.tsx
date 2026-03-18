import { useState } from 'react';
import type { Order, OrderStatus, PaymentStatus } from '../types';
import { OrderStatusBadge, PaymentStatusBadge, ORDER_STATUS_OPTIONS, PAYMENT_STATUS_OPTIONS } from './StatusBadge';
import { updateOrderStatus, updatePaymentStatus } from '../api';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: '💳 Tarjeta',
  sinpe: '📱 SINPE',
  transfer: '🏦 Transferencia',
};

interface OrderDetailProps {
  order: Order;
  onClose: () => void;
  onUpdated: (order: Order) => void;
}

export function OrderDetail({ order, onClose, onUpdated }: OrderDetailProps) {
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [updatingPayment, setUpdatingPayment] = useState(false);
  const [error, setError] = useState('');

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatingStatus(true);
    setError('');
    try {
      const updated = await updateOrderStatus(order.orderId, e.target.value as OrderStatus);
      onUpdated(updated);
    } catch (err) {
      setError('Error al actualizar estado del pedido');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handlePaymentChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setUpdatingPayment(true);
    setError('');
    try {
      const updated = await updatePaymentStatus(order.orderId, e.target.value as PaymentStatus);
      onUpdated(updated);
    } catch (err) {
      setError('Error al actualizar estado de pago');
    } finally {
      setUpdatingPayment(false);
    }
  };

  const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-sm font-mono">{order.orderId}</p>
              <h2 className="text-2xl font-bold mt-1">{order.customerInfo.name}</h2>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold leading-none">×</button>
          </div>
          <div className="flex gap-2 mt-3">
            <OrderStatusBadge status={order.orderStatus} />
            <PaymentStatusBadge status={order.paymentStatus} />
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">{error}</div>
          )}

          {/* Controles de estado */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del pedido</label>
              <select
                value={order.orderStatus}
                onChange={handleStatusChange}
                disabled={updatingStatus}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] disabled:opacity-50"
              >
                {ORDER_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {updatingStatus && <p className="text-xs text-gray-400 mt-1">Actualizando...</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Estado del pago</label>
              <select
                value={order.paymentStatus}
                onChange={handlePaymentChange}
                disabled={updatingPayment}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] disabled:opacity-50"
              >
                {PAYMENT_STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              {updatingPayment && <p className="text-xs text-gray-400 mt-1">Actualizando...</p>}
            </div>
          </div>

          {/* Info cliente */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-800 mb-3">📋 Información del cliente</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">Email:</span> <span className="text-gray-800">{order.customerInfo.email}</span></div>
              <div><span className="text-gray-500">Teléfono:</span> <span className="text-gray-800">{order.customerInfo.phone}</span></div>
              <div><span className="text-gray-500">Método:</span> <span className="text-gray-800">{PAYMENT_METHOD_LABELS[order.paymentMethod]}</span></div>
              <div>
                <span className="text-gray-500">
                  {order.customerInfo.deliveryMethod === 'pickup' ? 'Retiro:' : 'Entrega:'}
                </span>{' '}
                <span className="text-gray-800">{order.customerInfo.deliveryDate}</span>
              </div>
              {order.customerInfo.address && (
                <div className="col-span-2"><span className="text-gray-500">Dirección:</span> <span className="text-gray-800">{order.customerInfo.address}</span></div>
              )}
              {order.customerInfo.notes && (
                <div className="col-span-2"><span className="text-gray-500">Notas:</span> <span className="text-gray-800 italic">"{order.customerInfo.notes}"</span></div>
              )}
            </div>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🛒 Productos</h3>
            <div className="space-y-2">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">x{item.quantity}</p>
                    <p className="text-sm font-semibold text-gray-800">₡{(item.price * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3 pt-3 border-t border-gray-200 space-y-1 text-sm">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>₡{subtotal.toLocaleString()}</span>
              </div>
              {order.deliveryFee > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Envío</span>
                  <span>₡{order.deliveryFee.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-gray-900 text-base pt-1">
                <span>Total</span>
                <span className="text-[#cd733d]">₡{order.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Comprobante de pago */}
          {order.paymentProofUrl && (order.paymentMethod === 'sinpe' || order.paymentMethod === 'transfer') && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <h3 className="font-semibold text-blue-800 mb-3">🧾 Comprobante de pago</h3>
              {order.paymentProofUrl.endsWith('.pdf') || order.paymentProofUrl.includes('/raw/') ? (
                <a
                  href={order.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition-colors"
                >
                  📄 Ver comprobante PDF
                </a>
              ) : (
                <a href={order.paymentProofUrl} target="_blank" rel="noopener noreferrer">
                  <img
                    src={order.paymentProofUrl}
                    alt="Comprobante de pago"
                    className="max-h-64 rounded-lg border border-blue-200 hover:opacity-90 transition-opacity cursor-zoom-in"
                  />
                </a>
              )}
            </div>
          )}

          {/* Fechas */}
          <div className="text-xs text-gray-400 pt-2 border-t border-gray-100">
            <p>Creado: {new Date(order.createdAt).toLocaleString('es-CR')}</p>
            {order.paidAt && <p>Pagado: {new Date(order.paidAt).toLocaleString('es-CR')}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
