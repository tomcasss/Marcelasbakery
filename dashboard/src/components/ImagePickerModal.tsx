import { useState, useEffect, useRef } from 'react';
import { fetchCloudinaryImages, uploadProductImage } from '../api';

interface ImagePickerModalProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export function ImagePickerModal({ onSelect, onClose }: ImagePickerModalProps) {
  const [images, setImages] = useState<{ url: string; publicId: string; filename: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchCloudinaryImages('marcelasbakery/products');
      setImages(data);
    } catch (err: any) {
      setError('No se pudieron cargar las imágenes de Cloudinary');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const url = await uploadProductImage(file);
      onSelect(url);
    } catch (err: any) {
      setError(err.message || 'Error al subir imagen');
      setUploading(false);
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const filtered = images.filter((img) =>
    !search || img.filename.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Biblioteca de imágenes</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {images.length} imagen{images.length !== 1 ? 'es' : ''} en Cloudinary
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-3 shrink-0">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
          />
          <label className={`cursor-pointer shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            uploading
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white hover:shadow-md'
          }`}>
            {uploading ? (
              <>
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin inline-block" />
                Subiendo...
              </>
            ) : (
              <>📁 Subir nueva</>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              disabled={uploading}
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Grid de imágenes */}
        <div className="flex-1 overflow-y-auto p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="w-10 h-10 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">🖼️</p>
              <p className="font-medium text-sm">
                {search ? 'No hay imágenes que coincidan' : 'No hay imágenes en Cloudinary todavía'}
              </p>
              {!search && <p className="text-xs mt-1">Usa el botón "Subir nueva" para agregar la primera</p>}
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
              {filtered.map((img) => (
                <button
                  key={img.publicId}
                  onClick={() => onSelect(img.url)}
                  className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200 hover:border-[#cd733d] transition-all focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                  title={img.filename}
                >
                  <img
                    src={img.url}
                    alt={img.filename}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    loading="lazy"
                  />
                  {/* Overlay al pasar el ratón */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                    <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded-md">
                      Seleccionar
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
