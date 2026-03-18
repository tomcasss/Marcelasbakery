import type { Order } from '../types';
import { OrderStatusBadge, PaymentStatusBadge } from './StatusBadge';

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  card: '💳 Tarjeta',
  sinpe: '📱 SINPE',
  transfer: '🏦 Transferencia',
};

interface OrderCardProps {
  order: Order;
  onClick: () => void;
}

export function OrderCard({ order, onClick }: OrderCardProps) {
  const date = new Date(order.createdAt);
  const formattedDate = date.toLocaleDateString('es-CR', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-xl border border-gray-200 p-5 hover:border-[#cd733d] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-xs text-gray-400 font-mono mb-0.5">{order.orderId}</p>
          <p className="font-semibold text-gray-900">{order.customerInfo.name}</p>
          <p className="text-sm text-gray-500">{order.customerInfo.email}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-lg font-bold text-[#cd733d]">₡{order.total.toLocaleString()}</p>
          {order.deliveryFee > 0 && (
            <p className="text-xs text-gray-400">+₡{order.deliveryFee.toLocaleString()} envío</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-3">
        <OrderStatusBadge status={order.orderStatus} />
        <PaymentStatusBadge status={order.paymentStatus} />
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200">
          {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
        </span>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
          {order.customerInfo.deliveryMethod === 'pickup' ? '🏪 Retiro' : '🚚 Entrega'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
        <span>{formattedDate}</span>
      </div>

      <div className="mt-2 text-xs text-gray-500">
        📅 {order.customerInfo.deliveryMethod === 'pickup' ? 'Retiro' : 'Entrega'}: {order.customerInfo.deliveryDate}
      </div>
    </div>
  );
}
