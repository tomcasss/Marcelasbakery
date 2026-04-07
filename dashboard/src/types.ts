export interface CartItem {
  id: string | number;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
  address?: string;
  deliveryMethod: 'pickup' | 'delivery';
  deliveryDate: string;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered';
export type PaymentStatus = 'pending' | 'completed' | 'failed';
export type PaymentMethod = 'card' | 'sinpe' | 'transfer';

export interface Order {
  _id: string;
  orderId: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  deliveryFee: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  paymentProofUrl?: string;
  createdAt: string;
  paidAt?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  available: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
}

export interface RecipeIngredientRef extends RecipeIngredient {
  ingredientId?: string; // referencia al catálogo
}

export interface Recipe {
  _id: string;
  name: string;
  category: string;
  description: string;
  ingredients: RecipeIngredientRef[];
  laborMinutes: number;
  laborRatePerHour: number;
  batchSize: number;
  overheadPercent: number;
  profitMargin: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ingredient {
  _id: string;
  name: string;
  unit: string;
  unitPrice: number;
  category: string;
  notes: string;
  packagePrice?: number;
  packageQuantity?: number;
  packageUnit?: string;
  createdAt: string;
  updatedAt: string;
}
