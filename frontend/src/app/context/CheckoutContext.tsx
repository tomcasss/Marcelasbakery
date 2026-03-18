import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem } from '../components/Cart';
import { createOrder as createOrderApi, uploadPaymentProof } from '../services/api';

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
  createOrder: (items: CartItem[], total: number, paymentMethod: string, deliveryFee?: number, paymentProof?: File | null) => Promise<Order>;
  currentOrder: Order | null;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo | null>(null);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = async (
    items: CartItem[],
    total: number,
    paymentMethod: string,
    deliveryFee = 0,
    paymentProof?: File | null,
  ): Promise<Order> => {
    if (!customerInfo) throw new Error('Información del cliente requerida');

    let paymentProofUrl: string | undefined;
    if (paymentProof) {
      paymentProofUrl = await uploadPaymentProof(paymentProof);
    }

    const finalTotal = total + deliveryFee;

    const data = await createOrderApi({
      items,
      customerInfo,
      total: finalTotal,
      deliveryFee,
      paymentMethod,
      paymentProofUrl,
    });

    const order: Order = {
      id: data.orderId,
      items: data.items,
      customerInfo: data.customerInfo,
      total: data.total,
      paymentMethod: data.paymentMethod as Order['paymentMethod'],
      paymentStatus: data.paymentStatus as Order['paymentStatus'],
      orderStatus: data.orderStatus as Order['orderStatus'],
      createdAt: new Date(data.createdAt),
    };

    setCurrentOrder(order);
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
