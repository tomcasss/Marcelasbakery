import type { Order, OrdersResponse, OrderStatus, PaymentStatus, Product } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'admin123';

const headers = {
  'Content-Type': 'application/json',
  'x-admin-key': ADMIN_KEY,
};

export async function fetchOrders(params?: {
  status?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}): Promise<OrdersResponse> {
  const query = new URLSearchParams();
  if (params?.status && params.status !== 'all') query.set('status', params.status);
  if (params?.paymentStatus && params.paymentStatus !== 'all') query.set('paymentStatus', params.paymentStatus);
  if (params?.page) query.set('page', String(params.page));
  if (params?.limit) query.set('limit', String(params.limit));

  const res = await fetch(`${API_URL}/api/admin/orders?${query}`, { headers });
  if (!res.ok) throw new Error('Error al cargar órdenes');
  return res.json();
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}`, { headers });
  if (!res.ok) throw new Error('Orden no encontrada');
  return res.json();
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<Order> {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ orderStatus }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

// ── Productos ──────────────────────────────────────────────────────────────────

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/api/products/all`, { headers });
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function createProduct(data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al crear producto');
  }
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al actualizar producto');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/products/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

export async function seedProducts(): Promise<{ count: number }> {
  const res = await fetch(`${API_URL}/api/products/seed`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al importar productos');
  }
  return res.json();
}

export async function uploadProductImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);
  const res = await fetch(`${API_URL}/api/upload/product-image`, {
    method: 'POST',
    headers: { 'x-admin-key': ADMIN_KEY },
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al subir imagen');
  }
  const data = await res.json();
  return data.url;
}

export async function fetchCloudinaryImages(folder = 'marcelasbakery'): Promise<{ url: string; publicId: string; filename: string }[]> {
  const res = await fetch(`${API_URL}/api/upload/images?folder=${encodeURIComponent(folder)}`, { headers });
  if (!res.ok) throw new Error('Error al cargar imágenes de Cloudinary');
  return res.json();
}

export async function updatePaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
  const res = await fetch(`${API_URL}/api/admin/orders/${orderId}/payment`, {
    method: 'PATCH',
    headers,
    body: JSON.stringify({ paymentStatus }),
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return res.json();
}

// ── Site config ────────────────────────────────────────────────────────────────

export async function fetchSiteConfig(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) throw new Error('Error al cargar configuración del sitio');
  return res.json();
}

export async function updateSiteConfigKey(key: string, value: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/config/${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ value }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al guardar configuración');
  }
}

// ── Recetas / Costos ───────────────────────────────────────────────────────────

import type { Recipe } from './types';

export async function fetchRecipes(): Promise<Recipe[]> {
  const res = await fetch(`${API_URL}/api/admin/recipes`, { headers });
  if (!res.ok) throw new Error('Error al cargar recetas');
  return res.json();
}

export async function createRecipe(data: Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>): Promise<Recipe> {
  const res = await fetch(`${API_URL}/api/admin/recipes`, {
    method: 'POST',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al crear receta');
  }
  return res.json();
}

export async function updateRecipe(id: string, data: Partial<Omit<Recipe, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Recipe> {
  const res = await fetch(`${API_URL}/api/admin/recipes/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al actualizar receta');
  }
  return res.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/api/admin/recipes/${id}`, {
    method: 'DELETE',
    headers,
  });
  if (!res.ok) throw new Error('Error al eliminar receta');
}
