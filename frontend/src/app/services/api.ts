const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function fetchSiteConfig(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) throw new Error('Error al cargar configuración');
  return res.json();
}

export async function fetchProducts(): Promise<any[]> {
  const res = await fetch(`${API_URL}/api/products`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function uploadPaymentProof(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('proof', file);
  const res = await fetch(`${API_URL}/api/upload/proof`, {
    method: 'POST',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al subir comprobante');
  }
  const data = await res.json();
  return data.url;
}

export async function createOrder(body: {
  items: { id: string | number; name: string; description: string; price: number; category: string; image: string; quantity: number }[];
  customerInfo: { name: string; email: string; phone: string; address?: string; deliveryMethod: string; deliveryDate: string; notes?: string };
  total: number;
  deliveryFee?: number;
  paymentMethod: string;
  paymentProofUrl?: string;
}) {
  const res = await fetch(`${API_URL}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al crear la orden');
  }
  return res.json();
}

export async function startTilopayCheckout(body: {
  orderId: string;
  amount: number;
  customerInfo: { name: string; email: string; phone: string; address?: string };
}): Promise<{ url: string }> {
  const res = await fetch(`${API_URL}/api/tilopay/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al iniciar pago con tarjeta');
  }
  return res.json();
}

export async function confirmTilopayPayment(body: {
  tempId: string;
  items: any[];
  customerInfo: any;
  total: number;
  deliveryFee: number;
}): Promise<any> {
  const res = await fetch(`${API_URL}/api/tilopay/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error confirmando el pago');
  }
  return res.json();
}
