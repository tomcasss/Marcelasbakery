import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../components/Cart';

interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryDate: string;
  notes?: string;
}

interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  paymentMethod: 'card' | 'sinpe' | 'transfer';
  paymentStatus: 'pending' | 'completed' | 'failed';
  orderStatus: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
  createdAt: Date;
  paidAt?: Date;
}

interface CheckoutContextType {
  customerInfo: CustomerInfo | null;
  setCustomerInfo: (info: CustomerInfo) => void;
  createOrder: (items: CartItem[], total: number, paymentMethod: string) => Promise<Order>;
  currentOrder: Order | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = async (
    items: CartItem[], 
    total: number, 
    paymentMethod: string
  ): Promise<Order> => {
    if (!customerInfo) {
      throw new Error('Información del cliente requerida');
    }

    const order: Order = {
      id: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      items,
      customerInfo,
      total,
      paymentMethod: paymentMethod as any,
      paymentStatus: 'pending',
      orderStatus: 'pending',
      createdAt: new Date(),
    };

    // Aquí iría la llamada al backend
    // Por ahora simulamos guardado local
    setCurrentOrder(order);
    
    // Guardar en localStorage para persistencia
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));

    return order;
  };

  return (
    <CheckoutContext.Provider value={{
      customerInfo,
      setCustomerInfo,
      createOrder,
      currentOrder,
    }}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
