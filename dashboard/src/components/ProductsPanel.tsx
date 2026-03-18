import { useState, useEffect, useRef } from 'react';
import type { Product } from '../types';
import { fetchAllProducts, createProduct, updateProduct, deleteProduct, seedProducts } from '../api';
import { ImagePickerModal } from './ImagePickerModal';

const CATEGORIES = ['Acompañamientos', 'Platos Fuertes', 'Proteínas', 'Postres', 'Rompopes', 'Bebidas', 'Otros'];

// ── Formulario (modal) ─────────────────────────────────────────────────────────

interface ProductFormProps {
  product: Product | null; // null = crear nuevo
  onSave: (data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  onClose: () => void;
}

function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const isEdit = product !== null;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    name: product?.name ?? '',
    description: product?.description ?? '',
    price: product?.price ?? 0,
    category: product?.category ?? CATEGORIES[0],
    customCategory: '',
    image: product?.image ?? '',
    available: product?.available ?? true,
    sortOrder: product?.sortOrder ?? 0,
  });
  const [imagePreviewError, setImagePreviewError] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setForm((f) => ({ ...f, [name]: (e.target as HTMLInputElement).checked }));
    } else {
      setForm((f) => ({ ...f, [name]: name === 'price' || name === 'sortOrder' ? Number(value) : value }));
    }
    if (name === 'image') setImagePreviewError(false);
  };

  const effectiveCategory = form.category === '__custom__' ? form.customCategory : form.category;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('El nombre es obligatorio'); return; }
    if (!form.description.trim()) { setError('La descripción es obligatoria'); return; }
    if (form.price <= 0) { setError('El precio debe ser mayor a ₡0'); return; }
    if (!effectiveCategory) { setError('Selecciona o escribe una categoría'); return; }

    setSaving(true);
    setError('');
    try {
      await onSave({
        name: form.name.trim(),
        description: form.description.trim(),
        price: form.price,
        category: effectiveCategory,
        image: form.image.trim(),
        available: form.available,
        sortOrder: form.sortOrder,
      });
    } catch (err: any) {
      setError(err.message || 'Error al guardar');
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {isEdit ? 'Editar producto' : 'Nuevo producto'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="Ej: Tres Leches"
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] resize-none"
              placeholder="Descripción breve del producto..."
            />
          </div>

          {/* Precio */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Precio (₡) *</label>
            <input
              type="number"
              name="price"
              value={form.price || ''}
              onChange={handleChange}
              min={0}
              step={100}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="4200"
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría *</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
            >
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              <option value="__custom__">Otra categoría...</option>
            </select>
            {form.category === '__custom__' && (
              <input
                name="customCategory"
                value={form.customCategory}
                onChange={handleChange}
                className="w-full mt-2 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                placeholder="Escribe la categoría"
              />
            )}
          </div>

          {/* Imagen */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Imagen del producto</label>
            {/* Botón de imagen */}
            <div className="mb-2">
              <button
                type="button"
                onClick={() => setShowPicker(true)}
                className="bg-[#cd733d] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-[#b5612c] transition-colors"
              >
                🖼️ Elegir de biblioteca
              </button>
            </div>
            {/* URL manual */}
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="/images/mi-foto.jpg  ó  https://..."
            />
            {form.image && !imagePreviewError && (
              <div className="mt-2 h-28 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={form.image}
                  alt="preview"
                  className="h-full w-full object-cover"
                  onError={() => setImagePreviewError(true)}
                />
              </div>
            )}
            {form.image && imagePreviewError && (
              <p className="text-xs text-amber-600 mt-1">⚠️ No se puede previsualizar — verifica la URL</p>
            )}
          </div>

          {/* Orden y disponibilidad */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-1">Orden de aparición</label>
              <input
                type="number"
                name="sortOrder"
                value={form.sortOrder}
                onChange={handleChange}
                min={0}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              />
            </div>
            <div className="flex items-center gap-2 pt-5">
              <input
                type="checkbox"
                id="available"
                name="available"
                checked={form.available}
                onChange={handleChange}
                className="w-4 h-4 accent-[#cd733d]"
              />
              <label htmlFor="available" className="text-sm font-semibold text-gray-700">Disponible en tienda</label>
            </div>
          </div>

          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          {/* Picker de biblioteca Cloudinary */}
          {showPicker && (
            <ImagePickerModal
              onSelect={(url) => {
                setForm((f) => ({ ...f, image: url }));
                setImagePreviewError(false);
                setShowPicker(false);
              }}
              onClose={() => setShowPicker(false)}
            />
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white py-2 rounded-lg text-sm font-semibold hover:shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Guardando...' : isEdit ? 'Guardar cambios' : 'Crear producto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Panel principal ────────────────────────────────────────────────────────────

export function ProductsPanel() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formTarget, setFormTarget] = useState<Product | null | 'new'>(undefined as any);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);
  const [seeding, setSeeding] = useState(false);
  const [seedMsg, setSeedMsg] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [toast, setToast] = useState('');
  const toastTimer = useRef<ReturnType<typeof setTimeout>>();

  const showToast = (msg: string) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(''), 3000);
  };

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchAllProducts();
      setProducts(data);
    } catch (err: any) {
      setError('No se pudieron cargar los productos. ¿Está corriendo el backend?');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Omit<Product, '_id' | 'createdAt' | 'updatedAt'>) => {
    if (formTarget === 'new') {
      await createProduct(data);
      showToast('✅ Producto creado');
    } else if (formTarget) {
      await updateProduct((formTarget as Product)._id, data);
      showToast('✅ Cambios guardados');
    }
    setFormTarget(undefined as any);
    load();
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deleteProduct(confirmDelete._id);
      showToast('🗑️ Producto eliminado');
      setConfirmDelete(null);
      load();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar');
    }
  };

  const handleSeed = async () => {
    setSeeding(true);
    setSeedMsg('');
    try {
      const { count } = await seedProducts();
      setSeedMsg(`✅ Se importaron ${count} productos de ejemplo`);
      load();
    } catch (err: any) {
      setSeedMsg(`❌ ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const handleToggleAvailable = async (product: Product) => {
    try {
      const updated = await updateProduct(product._id, { available: !product.available });
      setProducts((prev) => prev.map((p) => p._id === updated._id ? updated : p));
      showToast(updated.available ? '✅ Producto activado' : '⏸️ Producto oculto de la tienda');
    } catch {
      alert('Error al actualizar disponibilidad');
    }
  };

  const categories = ['Todos', ...Array.from(new Set(products.map((p) => p.category)))];

  const filtered = products.filter((p) => {
    const matchCat = categoryFilter === 'Todos' || p.category === categoryFilter;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Catálogo de productos</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {products.length} productos · {products.filter((p) => p.available).length} disponibles
          </p>
        </div>
        <button
          onClick={() => setFormTarget('new')}
          className="flex items-center gap-2 bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all"
        >
          <span className="text-lg leading-none">+</span> Nuevo producto
        </button>
      </div>

      {/* Importar productos de ejemplo (solo si está vacío) */}
      {!loading && products.length === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-amber-800 text-sm">El catálogo está vacío</p>
            <p className="text-xs text-amber-700 mt-0.5">Puedes cargar los 15 productos de ejemplo para empezar rápido</p>
          </div>
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="shrink-0 bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-amber-700 transition-colors disabled:opacity-50"
          >
            {seeding ? 'Importando...' : 'Cargar productos de ejemplo'}
          </button>
        </div>
      )}
      {seedMsg && (
        <p className={`text-sm px-4 py-2 rounded-lg ${seedMsg.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {seedMsg}
        </p>
      )}

      {/* Filtros */}
      {products.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">{error}</div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-10 h-10 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {filtered.length === 0 && products.length > 0 && (
            <p className="text-center text-gray-400 py-10">No hay productos que coincidan</p>
          )}

          {/* Grid de productos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((product) => (
              <div
                key={product._id}
                className={`bg-white rounded-xl border-2 overflow-hidden transition-all ${
                  product.available ? 'border-gray-200 hover:border-[#cd733d]' : 'border-gray-100 opacity-60'
                }`}
              >
                {/* Imagen */}
                <div className="h-40 bg-gray-100 overflow-hidden relative">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-4xl text-gray-300">🍽️</div>
                  )}
                  {/* Badge disponibilidad */}
                  <div
                    className={`absolute top-2 right-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                      product.available ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {product.available ? 'Activo' : 'Oculto'}
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <p className="text-xs text-[#cd733d] font-medium mb-0.5">{product.category}</p>
                  <h3 className="font-bold text-gray-900 text-sm leading-tight mb-1">{product.name}</h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{product.description}</p>
                  <p className="text-lg font-bold text-[#cd733d] mb-3">₡{product.price.toLocaleString()}</p>

                  {/* Acciones */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleAvailable(product)}
                      className={`flex-1 text-xs py-1.5 rounded-lg font-semibold border transition-colors ${
                        product.available
                          ? 'border-gray-300 text-gray-600 hover:bg-gray-50'
                          : 'border-green-300 text-green-700 hover:bg-green-50'
                      }`}
                      title={product.available ? 'Ocultar de la tienda' : 'Mostrar en tienda'}
                    >
                      {product.available ? '⏸ Ocultar' : '▶ Activar'}
                    </button>
                    <button
                      onClick={() => setFormTarget(product)}
                      className="px-3 py-1.5 text-xs rounded-lg font-semibold border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors"
                      title="Editar"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product)}
                      className="px-3 py-1.5 text-xs rounded-lg font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      title="Eliminar"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal formulario */}
      {formTarget !== undefined && formTarget !== (undefined as any) && (
        <ProductForm
          product={formTarget === 'new' ? null : formTarget as Product}
          onSave={handleSave}
          onClose={() => setFormTarget(undefined as any)}
        />
      )}

      {/* Modal confirmar eliminación */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-sm w-full">
            <h3 className="font-bold text-gray-900 mb-2">¿Eliminar producto?</h3>
            <p className="text-sm text-gray-600 mb-1">
              Vas a eliminar permanentemente <span className="font-semibold">"{confirmDelete.name}"</span>.
            </p>
            <p className="text-xs text-gray-400 mb-5">Esta acción no se puede deshacer. Si solo quieres ocultarlo temporalmente, usa el botón "Ocultar".</p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-semibold hover:bg-red-700"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
