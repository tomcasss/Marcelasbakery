import { useState, useEffect } from 'react';
import { fetchSiteConfig, updateSiteConfigKey } from '../api';
import { ImagePickerModal } from './ImagePickerModal';

// Default fallbacks (same as what the frontend uses)
const DEFAULTS: Record<string, string> = {
  about_image:
    'https://images.unsplash.com/photo-1657498023828-1e0181449d9f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYWtlcnklMjBpbnRlcmlvcnxlbnwxfHx8fDE3NjY1MjEwMDB8MA&ixlib=rb-4.1.0&q=80&w=1080',
  catering_image:
    'https://images.unsplash.com/photo-1567496295302-b8dbcd2913b6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXRlcmluZyUyMGZvb2QlMjBwbGF0dGVyfGVufDF8fHx8MTc2NjQ3NzkwMnww&ixlib=rb-4.1.0&q=80&w=1080',
  carousel_image_1: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0001.JPG',
  carousel_image_2: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0002.JPG',
  carousel_image_3: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0003.JPG',
  carousel_image_4: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0004.JPG',
  carousel_image_5: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0005.JPG',
  category_acompanamientos: '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0001.JPG',
  category_platos_fuertes:  '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0004.JPG',
  category_proteinas:       '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0007.JPG',
  category_postres:         '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0010.JPG',
  category_rompopes:        '/images/LA GRACIA FOTOS PRODUCTO-PERSONAL 2023_0014.JPG',
};

const SLOTS = [
  { key: 'about_image', label: 'Imagen de "Sobre Nosotros"', description: 'Foto principal de la página About' },
  { key: 'catering_image', label: 'Imagen de Catering', description: 'Foto principal de la página Catering' },
  { key: 'carousel_image_1', label: 'Carrusel — Foto 1', description: 'Primera imagen del carrusel del inicio' },
  { key: 'carousel_image_2', label: 'Carrusel — Foto 2', description: 'Segunda imagen del carrusel del inicio' },
  { key: 'carousel_image_3', label: 'Carrusel — Foto 3', description: 'Tercera imagen del carrusel del inicio' },
  { key: 'carousel_image_4', label: 'Carrusel — Foto 4', description: 'Cuarta imagen del carrusel del inicio' },
  { key: 'carousel_image_5', label: 'Carrusel — Foto 5', description: 'Quinta imagen del carrusel del inicio' },
  { key: 'category_acompanamientos', label: 'Categoría — Acompañamientos', description: 'Foto de la tarjeta "Acompañamientos" en el inicio' },
  { key: 'category_platos_fuertes',  label: 'Categoría — Platos Fuertes',  description: 'Foto de la tarjeta "Platos Fuertes" en el inicio' },
  { key: 'category_proteinas',       label: 'Categoría — Proteínas',       description: 'Foto de la tarjeta "Proteínas" en el inicio' },
  { key: 'category_postres',         label: 'Categoría — Postres',         description: 'Foto de la tarjeta "Postres" en el inicio' },
  { key: 'category_rompopes',        label: 'Categoría — Rompopes',        description: 'Foto de la tarjeta "Rompopes" en el inicio' },
];

export function SiteImagesPanel() {
  const [config, setConfig] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null); // key being saved
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pickerKey, setPickerKey] = useState<string | null>(null); // which slot is picking

  useEffect(() => {
    fetchSiteConfig()
      .then((data) => setConfig(data))
      .catch(() => setError('No se pudo cargar la configuración. ¿Está el backend corriendo?'))
      .finally(() => setLoading(false));
  }, []);

  const getUrl = (key: string) => config[key] ?? DEFAULTS[key] ?? '';

  const handleSelect = async (key: string, url: string) => {
    setPickerKey(null);
    setSaving(key);
    setError('');
    setSuccess('');
    try {
      await updateSiteConfigKey(key, url);
      setConfig((prev) => ({ ...prev, [key]: url }));
      setSuccess(`"${SLOTS.find((s) => s.key === key)?.label}" actualizada ✓`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="text-gray-500 text-sm animate-pulse">Cargando configuración…</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6 px-4">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Imágenes del Sitio Web</h2>
        <p className="text-gray-500 mt-1 text-sm">
          Cambia las fotos que aparecen en la página principal, About y Catering.
          Los cambios se aplican al instante.
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm">
          ✅ {success}
        </div>
      )}

      <div className="grid gap-6">
        {SLOTS.map((slot) => {
          const url = getUrl(slot.key);
          const isSaving = saving === slot.key;
          return (
            <div
              key={slot.key}
              className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row">
                {/* Preview */}
                <div className="sm:w-48 h-40 sm:h-auto bg-gray-100 flex-shrink-0">
                  {url ? (
                    <img
                      src={url}
                      alt={slot.label}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="160" viewBox="0 0 200 160"%3E%3Crect width="200" height="160" fill="%23f3f4f6"/%3E%3Ctext x="100" y="85" text-anchor="middle" fill="%239ca3af" font-size="13"%3ESin imagen%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                      Sin imagen
                    </div>
                  )}
                </div>

                {/* Info + actions */}
                <div className="flex-1 p-5 flex flex-col justify-between gap-4">
                  <div>
                    <p className="font-semibold text-gray-800">{slot.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{slot.description}</p>
                    {url && (
                      <p className="text-xs text-gray-400 mt-2 break-all line-clamp-2" title={url}>
                        {url}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => setPickerKey(slot.key)}
                    className="self-start bg-[#cd733d] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#b5612c] transition-colors disabled:opacity-50"
                  >
                    {isSaving ? 'Guardando…' : '🖼️ Cambiar imagen'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Image picker modal */}
      {pickerKey && (
        <ImagePickerModal
          onSelect={(url) => handleSelect(pickerKey, url)}
          onClose={() => setPickerKey(null)}
        />
      )}
    </div>
  );
}
