import { Router, Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product.js';

export const productsRouter = Router();

// ── Middleware de autenticación admin ──────────────────────────────────────────
function adminOnly(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_KEY || 'admin123';
  if (key !== expected) return res.status(401).json({ error: 'No autorizado' });
  next();
}

// ── GET /api/products  — público, sólo disponibles ────────────────────────────
productsRouter.get('/', async (_req, res) => {
  try {
    const products = await Product.find({ available: true }).sort({ sortOrder: 1, createdAt: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// ── GET /api/products/all  — admin, incluye no disponibles ────────────────────
productsRouter.get('/all', adminOnly, async (_req, res) => {
  try {
    const products = await Product.find().sort({ sortOrder: 1, createdAt: 1 });
    res.json(products);
  } catch {
    res.status(500).json({ error: 'Error al obtener productos' });
  }
});

// ── POST /api/products/seed  — admin, importa productos de ejemplo ─────────────
// Solo siembra si la colección está vacía
productsRouter.post('/seed', adminOnly, async (_req, res) => {
  try {
    const existing = await Product.countDocuments();
    if (existing > 0) {
      return res.status(409).json({ error: 'Ya existen productos. Borra el catálogo antes de reimportar.' });
    }

    const foto = (n: number) =>
      `/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_${String(n).padStart(4, '0')}.JPG`;

    const defaults = [
      { name: 'Arroz con Vegetales', description: 'Arroz blanco salteado con vegetales frescos de temporada', price: 3500, category: 'Acompañamientos', image: foto(1), sortOrder: 1 },
      { name: 'Ensalada Fresca', description: 'Mix de lechugas frescas con aderezo de la casa', price: 2800, category: 'Acompañamientos', image: foto(2), sortOrder: 2 },
      { name: 'Papas Doradas', description: 'Papas al horno doradas con especias', price: 3000, category: 'Acompañamientos', image: foto(3), sortOrder: 3 },
      { name: 'Pasta Alfredo', description: 'Pasta fettuccine en salsa alfredo cremosa', price: 6500, category: 'Platos Fuertes', image: foto(4), sortOrder: 4 },
      { name: 'Lasagna Bolognesa', description: 'Capas de pasta con carne molida y quesos gratinados', price: 7200, category: 'Platos Fuertes', image: foto(5), sortOrder: 5 },
      { name: 'Casado Tradicional', description: 'Arroz, frijoles, ensalada, plátano y tortilla', price: 5500, category: 'Platos Fuertes', image: foto(6), sortOrder: 6 },
      { name: 'Pollo a la Plancha', description: 'Pechuga de pollo marinada y a la plancha', price: 4500, category: 'Proteínas', image: foto(7), sortOrder: 7 },
      { name: 'Carne en Salsa', description: 'Carne de res en salsa especial de la casa', price: 5800, category: 'Proteínas', image: foto(8), sortOrder: 8 },
      { name: 'Pescado al Ajillo', description: 'Filete de pescado fresco al ajillo con hierbas', price: 6800, category: 'Proteínas', image: foto(9), sortOrder: 9 },
      { name: 'Tres Leches', description: 'Bizcocho empapado en tres tipos de leche', price: 4200, category: 'Postres', image: foto(10), sortOrder: 10 },
      { name: 'Cheesecake de Frutos Rojos', description: 'Cremoso cheesecake con coulis de frutos rojos', price: 4800, category: 'Postres', image: foto(11), sortOrder: 11 },
      { name: 'Tiramisú', description: 'Clásico postre italiano con café y mascarpone', price: 5200, category: 'Postres', image: foto(12), sortOrder: 12 },
      { name: 'Flan de Caramelo', description: 'Suave flan casero con caramelo líquido', price: 3500, category: 'Postres', image: foto(13), sortOrder: 13 },
      { name: 'Rompope Tradicional', description: 'Rompope casero con receta familiar (750ml)', price: 8500, category: 'Rompopes', image: foto(14), sortOrder: 14 },
      { name: 'Rompope de Coco', description: 'Rompope con delicioso sabor a coco (750ml)', price: 9000, category: 'Rompopes', image: foto(15), sortOrder: 15 },
    ];

    await Product.insertMany(defaults);
    res.status(201).json({ ok: true, count: defaults.length });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// ── POST /api/products  — admin, crear producto ───────────────────────────────
productsRouter.post('/', adminOnly, async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ── PUT /api/products/:id  — admin, editar producto ───────────────────────────
productsRouter.put('/:id', adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(product);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

// ── DELETE /api/products/:id  — admin, eliminar producto ─────────────────────
productsRouter.delete('/:id', adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});
