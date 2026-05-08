import { z } from 'zod';

export const CreateOrderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string().min(1),
    description: z.string(),
    price: z.number().positive(),
    category: z.string(),
    image: z.string(),
    quantity: z.number().int().positive(),
  })).nonempty('Al menos un producto es requerido'),
  customerInfo: z.object({
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(100),
    email: z.string().email('Email inválido'),
    phone: z.string().regex(/^\d{4}-\d{4}$/, 'Teléfono debe ser formato XXXX-XXXX'),
    address: z.string().optional(),
    deliveryMethod: z.enum(['pickup', 'delivery']),
    deliveryDate: z.string(),
    notes: z.string().optional(),
  }),
  total: z.number().positive('Total debe ser mayor a 0'),
  deliveryFee: z.number().nonnegative().optional().default(0),
  paymentMethod: z.enum(['card', 'sinpe', 'transfer']),
  paymentProofUrl: z.string().url().optional(),
});

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  description: z.string().min(1, 'Descripción requerida').max(1000),
  price: z.number().positive('Precio debe ser mayor a 0'),
  category: z.string().min(1, 'Categoría requerida'),
  image: z.string().optional(),
  available: z.boolean().default(true),
  sortOrder: z.number().int().default(0),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export const CreateRecipeSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  category: z.string().min(1, 'Categoría requerida'),
  description: z.string().optional(),
  ingredients: z.array(z.object({
    name: z.string().min(1),
    quantity: z.number().positive('Cantidad debe ser positiva'),
    unit: z.string().min(1),
    unitPrice: z.number().nonnegative(),
  })).nonempty('Al menos un ingrediente es requerido'),
  laborMinutes: z.number().nonnegative(),
  laborRatePerHour: z.number().positive(),
  batchSize: z.number().positive(),
  overheadPercent: z.number().nonnegative(),
  profitMargin: z.number().nonnegative(),
});

export const CreateIngredientSchema = z.object({
  name: z.string().min(1, 'Nombre requerido').max(200),
  unit: z.string().min(1, 'Unidad requerida').default('g'),
  unitPrice: z.number().nonnegative('Precio no puede ser negativo'),
  category: z.string().min(1, 'Categoría requerida'),
  notes: z.string().optional(),
  packagePrice: z.number().nonnegative().optional(),
  packageQuantity: z.number().positive().optional(),
  packageUnit: z.string().optional(),
});

export const UpdateIngredientSchema = CreateIngredientSchema.partial();

export const LoginSchema = z.object({
  password: z.string().min(1, 'Contraseña requerida'),
});

export const UpdateConfigSchema = z.object({
  value: z.any(),
});
