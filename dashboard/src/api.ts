import type { Order, OrdersResponse, OrderStatus, PaymentStatus, Product } from './types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

let cachedAccessToken: string | null = null;

async function ensureToken() {
  if (cachedAccessToken) return cachedAccessToken;

  const response = await fetch(`${API_URL}/api/auth/refresh`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('No autorizado');
  }

  const data = await response.json();
  cachedAccessToken = data.accessToken;
  return cachedAccessToken;
}

async function apiCall(endpoint: string, options?: RequestInit) {
  const token = await ensureToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options?.headers,
    },
  });

  if (response.status === 401) {
    cachedAccessToken = null;
    return apiCall(endpoint, options);
  }

  return response;
}

export async function login(password: string): Promise<string> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.error || 'Login falló');
  }

  const data = await response.json();
  cachedAccessToken = data.accessToken;
  return data.accessToken;
}

export async function logout() {
  cachedAccessToken = null;
  await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

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

  const res = await apiCall(`/api/admin/orders?${query}`);
  if (!res.ok) throw new Error('Error al cargar órdenes');
  return res.json();
}

export async function fetchOrder(orderId: string): Promise<Order> {
  const res = await apiCall(`/api/admin/orders/${orderId}`);
  if (!res.ok) throw new Error('Orden no encontrada');
  return res.json();
}

export async function updateOrderStatus(orderId: string, orderStatus: OrderStatus): Promise<Order> {
  const res = await apiCall(`/api/admin/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ orderStatus }),
  });
  if (!res.ok) throw new Error('Error al actualizar estado');
  return res.json();
}

export async function updateOrderPaymentStatus(orderId: string, paymentStatus: PaymentStatus): Promise<Order> {
  const res = await apiCall(`/api/admin/orders/${orderId}/payment`, {
    method: 'PATCH',
    body: JSON.stringify({ paymentStatus }),
  });
  if (!res.ok) throw new Error('Error al actualizar pago');
  return res.json();
}

// ── Productos ──────────────────────────────────────────────────────────────────

export async function fetchAllProducts(): Promise<Product[]> {
  const res = await apiCall(`/api/products/all`);
  if (!res.ok) throw new Error('Error al cargar productos');
  return res.json();
}

export async function createProduct(data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
  const res = await apiCall(`/api/products`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al crear producto');
  }
  return res.json();
}

export async function updateProduct(id: string, data: Partial<Omit<Product, '_id' | 'createdAt' | 'updatedAt'>>): Promise<Product> {
  const res = await apiCall(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al actualizar producto');
  }
  return res.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const res = await apiCall(`/api/products/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar producto');
}

export async function seedProducts(): Promise<{ count: number }> {
  const res = await apiCall(`/api/products/seed`, {
    method: 'POST',
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Error al importar productos');
  }
  return res.json();
}

export async function uploadProductImage(file: File): Promise<string> {
  const token = await ensureToken();
  const formData = new FormData();
  formData.append('image', file);

  const res = await fetch(`${API_URL}/api/upload/product-image`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) throw new Error('Error al subir imagen');
  return res.json().then((d) => d.url);
}

export async function fetchUploadedImages(folder: string): Promise<string[]> {
  const res = await apiCall(`/api/upload/images?folder=${encodeURIComponent(folder)}`);
  if (!res.ok) throw new Error('Error al listar imágenes');
  const data = await res.json();
  return data.urls || [];
}

// ── Órdenes Historial ──────────────────────────────────────────────────────────

export async function fetchOrderStats(): Promise<any> {
  const res = await apiCall(`/api/admin/stats`);
  if (!res.ok) throw new Error('Error al cargar estadísticas');
  return res.json();
}

// ── Recetas ───────────────────────────────────────────────────────────────────

export async function fetchRecipes(): Promise<any[]> {
  const res = await apiCall(`/api/admin/recipes`);
  if (!res.ok) throw new Error('Error al cargar recetas');
  return res.json();
}

export async function createRecipe(data: any): Promise<any> {
  const res = await apiCall(`/api/admin/recipes`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear receta');
  return res.json();
}

export async function updateRecipe(id: string, data: any): Promise<any> {
  const res = await apiCall(`/api/admin/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar receta');
  return res.json();
}

export async function deleteRecipe(id: string): Promise<void> {
  const res = await apiCall(`/api/admin/recipes/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar receta');
}

// ── Ingredientes ───────────────────────────────────────────────────────────────

export async function fetchIngredients(): Promise<any[]> {
  const res = await apiCall(`/api/admin/ingredients`);
  if (!res.ok) throw new Error('Error al cargar ingredientes');
  return res.json();
}

export async function createIngredient(data: any): Promise<any> {
  const res = await apiCall(`/api/admin/ingredients`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear ingrediente');
  return res.json();
}

export async function updateIngredient(id: string, data: any): Promise<any> {
  const res = await apiCall(`/api/admin/ingredients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar ingrediente');
  return res.json();
}

export async function deleteIngredient(id: string): Promise<void> {
  const res = await apiCall(`/api/admin/ingredients/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Error al eliminar ingrediente');
}

// ── Configuración ──────────────────────────────────────────────────────────────

export async function fetchConfig(): Promise<Record<string, string>> {
  const res = await fetch(`${API_URL}/api/config`);
  if (!res.ok) throw new Error('Error al cargar configuración');
  return res.json();
}

export async function updateConfig(key: string, value: string): Promise<void> {
  const res = await apiCall(`/api/config/${key}`, {
    method: 'PUT',
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error('Error al actualizar configuración');
}
