import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { uploadBuffer, listImages } from '../services/cloudinary.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('Tipo de archivo no permitido. Usa JPG, PNG, WEBP o PDF.'));
  },
});

export const uploadRouter = Router();

function adminOnly(req: Request, res: Response, next: NextFunction) {
  const key = req.headers['x-admin-key'];
  const expected = process.env.ADMIN_KEY || 'admin123';
  if (key !== expected) return res.status(401).json({ error: 'No autorizado' });
  next();
}

// GET /api/upload/images?folder=marcelasbakery  — admin, lista imágenes de Cloudinary
uploadRouter.get('/images', adminOnly, async (req, res) => {
  try {
    const folder = (req.query.folder as string) || 'marcelasbakery/products';
    const images = await listImages(folder);
    res.json(images);
  } catch (err: any) {
    console.error('Cloudinary list error:', err);
    res.status(500).json({ error: 'Error al listar imágenes de Cloudinary' });
  }
});

// POST /api/upload/product-image  — admin únicamente
uploadRouter.post('/product-image', adminOnly, upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ninguna imagen' });
  try {
    const url = await uploadBuffer(req.file.buffer, 'marcelasbakery/products');
    res.json({ url });
  } catch (err: any) {
    console.error('Cloudinary product upload error:', err);
    res.status(500).json({ error: 'Error al subir imagen a Cloudinary' });
  }
});

// POST /api/upload/proof  — público (lo usa el checkout de clientes)
uploadRouter.post('/proof', upload.single('proof'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se recibió ningún comprobante' });
  try {
    const url = await uploadBuffer(req.file.buffer, 'marcelasbakery/proofs');
    res.json({ url });
  } catch (err: any) {
    console.error('Cloudinary proof upload error:', err);
    res.status(500).json({ error: 'Error al subir comprobante a Cloudinary' });
  }
});
