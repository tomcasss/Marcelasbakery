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
      className="bg-white rounded-lg border-2 border-gray-200 p-5 sm:p-6 hover:border-[#cd733d] hover:shadow-lg transition-all duration-200 cursor-pointer active:scale-95 min-h-48 flex flex-col"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-400 font-mono mb-1 truncate">{order.orderId}</p>
          <p className="font-semibold text-gray-900 truncate">{order.customerInfo.name}</p>
          <p className="text-sm text-gray-500 truncate">{order.customerInfo.email}</p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-xl font-bold text-[#cd733d]">₡{order.total.toLocaleString()}</p>
          {order.deliveryFee > 0 && (
            <p className="text-xs text-gray-400 mt-1">+₡{order.deliveryFee.toLocaleString()}</p>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <OrderStatusBadge status={order.orderStatus} />
        <PaymentStatusBadge status={order.paymentStatus} />
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700 border border-purple-200 whitespace-nowrap">
          {PAYMENT_METHOD_LABELS[order.paymentMethod] || order.paymentMethod}
        </span>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200 whitespace-nowrap">
          {order.customerInfo.deliveryMethod === 'pickup' ? '🏪 Retiro' : '🚚 Entrega'}
        </span>
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-auto pt-3 border-t border-gray-100">
        <span>{order.items.length} producto{order.items.length !== 1 ? 's' : ''}</span>
        <span className="text-right">
          {formattedDate}
        </span>
      </div>

      <div className="mt-3 text-xs text-gray-600 py-2 px-3 bg-gray-50 rounded border border-gray-100">
        📅 {order.customerInfo.deliveryMethod === 'pickup' ? 'Retiro' : 'Entrega'}: <span className="font-medium">{order.customerInfo.deliveryDate}</span>
      </div>
    </div>
  );
}
