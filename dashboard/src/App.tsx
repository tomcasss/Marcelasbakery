import { useState, useEffect, useCallback } from 'react';
import type { Order, OrderStatus, PaymentStatus } from './types';
import { fetchOrders } from './api';
import { OrderCard } from './components/OrderCard';
import { OrderDetail } from './components/OrderDetail';
import { ProductsPanel } from './components/ProductsPanel';
import { SiteImagesPanel } from './components/SiteImagesPanel';
import { CostCalculatorPanel } from './components/CostCalculatorPanel';

const ORDER_STATUS_FILTER = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'preparing', label: 'Preparando' },
  { value: 'ready', label: 'Listo' },
  { value: 'delivered', label: 'Entregado' },
];

const PAYMENT_STATUS_FILTER = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Sin verificar' },
  { value: 'completed', label: 'Pagado' },
  { value: 'failed', label: 'Fallido' },
];

export default function App() {
  const [view, setView] = useState<'orders' | 'products' | 'site' | 'costs'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [search, setSearch] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchOrders({
        status: statusFilter !== 'all' ? statusFilter : undefined,
        paymentStatus: paymentFilter !== 'all' ? paymentFilter : undefined,
        limit: 100,
      });
      setOrders(data.orders);
      setTotal(data.total);
    } catch (err) {
      setError('No se pudieron cargar los pedidos. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, paymentFilter]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleOrderUpdated = (updated: Order) => {
    setOrders((prev) => prev.map((o) => o.orderId === updated.orderId ? updated : o));
    setSelectedOrder(updated);
  };

  const filteredOrders = orders.filter((order) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      order.orderId.toLowerCase().includes(q) ||
      order.customerInfo.name.toLowerCase().includes(q) ||
      order.customerInfo.email.toLowerCase().includes(q) ||
      order.customerInfo.phone.includes(q)
    );
  });

  // Totales del día
  const todayStr = new Date().toISOString().slice(0, 10);
  const todayOrders = orders.filter((o) => o.createdAt.startsWith(todayStr));
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
  const pendingPayment = orders.filter((o) => o.paymentStatus === 'pending').length;
  const activeOrders = orders.filter((o) => !['delivered'].includes(o.orderStatus)).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">La Gracia</h1>
            <p className="text-xs text-[#cd733d] font-medium">Panel de administración</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Tabs de navegación */}
            <nav className="flex bg-gray-100 rounded-lg p-1 mr-2">
              <button
                onClick={() => setView('orders')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === 'orders' ? 'bg-white shadow text-[#cd733d]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                📦 Pedidos
              </button>
              <button
                onClick={() => setView('products')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === 'products' ? 'bg-white shadow text-[#cd733d]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🛒 Catálogo
              </button>
              <button
                onClick={() => setView('site')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === 'site' ? 'bg-white shadow text-[#cd733d]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                🌐 Sitio Web
              </button>
              <button
                onClick={() => setView('costs')}
                className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-all ${
                  view === 'costs' ? 'bg-white shadow text-[#cd733d]' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                💰 Costos
              </button>
            </nav>
            {view === 'orders' && (
              <button
                onClick={loadOrders}
                disabled={loading}
                className="flex items-center gap-2 text-sm bg-[#cd733d] text-white px-4 py-2 rounded-lg hover:bg-[#b5612c] transition-colors disabled:opacity-50"
              >
                <span className={loading ? 'animate-spin' : ''}>↻</span>
                Actualizar
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {view === 'products' ? (
          <ProductsPanel />
        ) : view === 'site' ? (
          <SiteImagesPanel />
        ) : view === 'costs' ? (
          <CostCalculatorPanel />
        ) : (
          <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Pedidos hoy" value={String(todayOrders.length)} color="blue" />
          <StatCard label="Ingresos hoy" value={`₡${todayRevenue.toLocaleString()}`} color="green" />
          <StatCard label="Pagos pendientes" value={String(pendingPayment)} color="yellow" />
          <StatCard label="Pedidos activos" value={String(activeOrders)} color="orange" />
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-3">
            <input
              type="text"
              placeholder="Buscar por nombre, email, teléfono o ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
            >
              {ORDER_STATUS_FILTER.map((opt) => (
                <option key={opt.value} value={opt.value}>Estado: {opt.label}</option>
              ))}
            </select>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
            >
              {PAYMENT_STATUS_FILTER.map((opt) => (
                <option key={opt.value} value={opt.value}>Pago: {opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Contenido */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            <div className="text-center">
              <div className="w-10 h-10 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p>Cargando pedidos...</p>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-24 text-gray-400">
            <p className="text-4xl mb-3">📭</p>
            <p className="font-medium">No hay pedidos{search ? ' que coincidan' : ''}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-4">
              Mostrando {filteredOrders.length} de {total} pedidos
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredOrders.map((order) => (
                <OrderCard
                  key={order.orderId}
                  order={order}
                  onClick={() => setSelectedOrder(order)}
                />
              ))}
            </div>
          </>
        )}
          </>
        )}
      </main>

      {selectedOrder && (
        <OrderDetail
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdated={handleOrderUpdated}
        />
      )}
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 border-blue-200 text-blue-700',
    green: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-700',
    orange: 'bg-orange-50 border-orange-200 text-orange-700',
  };
  return (
    <div className={`rounded-xl border p-4 ${colorMap[color]}`}>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs mt-1 opacity-70">{label}</p>
    </div>
  );
}
