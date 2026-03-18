import { Router } from 'express';
import { SiteConfig } from '../models/SiteConfig.js';

export const configRouter = Router();

// Public — get all site config as a flat object
configRouter.get('/', async (_, res) => {
  try {
    const entries = await SiteConfig.find({}, 'key value -_id');
    const config: Record<string, string> = {};
    for (const e of entries) config[e.key] = e.value;
    res.json(config);
  } catch {
    res.status(500).json({ error: 'Error al leer configuración' });
  }
});

// Admin — upsert a single key
configRouter.put('/:key', async (req, res) => {
  const adminKey = req.headers['x-admin-key'];
  if (adminKey !== process.env.ADMIN_KEY) {
    return res.status(401).json({ error: 'No autorizado' });
  }
  const { key } = req.params;
  const { value } = req.body;
  if (typeof value !== 'string' || !value.trim()) {
    return res.status(400).json({ error: 'value es requerido' });
  }
  try {
    const updated = await SiteConfig.findOneAndUpdate(
      { key },
      { value: value.trim() },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    res.json({ key: updated!.key, value: updated!.value });
  } catch {
    res.status(500).json({ error: 'Error al guardar configuración' });
  }
});
