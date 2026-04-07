import { useState, useEffect } from "react";
import type { Ingredient } from "../types";
import { fetchIngredients, createIngredient, updateIngredient, deleteIngredient } from "../api";

const UNITS = ["g", "kg", "ml", "L", "unidad", "taza", "cdta", "cda", "oz"];

const EMPTY_FORM: Omit<Ingredient, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  unit: "g",
  unitPrice: 0,
  category: "",
  notes: "",
  packagePrice: 0,
  packageQuantity: 1,
  packageUnit: "",
};

// ────────────────────────────────────────────────────────────────────────────
// Modal crear/editar ingrediente
// ────────────────────────────────────────────────────────────────────────────

function IngredientModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Ingredient | null;
  onSave: (data: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Ingredient, "_id" | "createdAt" | "updatedAt">>(
    initial
      ? { name: initial.name, unit: initial.unit, unitPrice: initial.unitPrice, category: initial.category, notes: initial.notes, packagePrice: initial.packagePrice ?? 0, packageQuantity: initial.packageQuantity ?? 1, packageUnit: initial.packageUnit ?? "" }
      : { ...EMPTY_FORM }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [byPackage, setByPackage] = useState(
    initial ? !!(initial.packagePrice && initial.packagePrice > 0) : false
  );

  const set = (field: keyof typeof form, val: string | number) =>
    setForm((f) => ({ ...f, [field]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    let dataToSave = { ...form };
    if (byPackage) {
      const qty = form.packageQuantity && form.packageQuantity > 0 ? form.packageQuantity : 1;
      dataToSave = { ...dataToSave, unitPrice: (form.packagePrice ?? 0) / qty };
    } else {
      // Clear package fields when not using package mode
      dataToSave = { ...dataToSave, packagePrice: 0, packageQuantity: 1, packageUnit: "" };
    }
    if (dataToSave.unitPrice < 0) { setError("El precio no puede ser negativo"); return; }
    setSaving(true);
    setError("");
    try {
      await onSave(dataToSave);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-gray-100 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? "Editar ingrediente" : "Nuevo ingrediente"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre *</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="Ej: Harina de trigo"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Unidad base</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                value={form.unit}
                onChange={(e) => set("unit", e.target.value)}
              >
                {UNITS.map((u) => <option key={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* Toggle de modo precio */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={byPackage}
              onChange={(e) => setByPackage(e.target.checked)}
              className="w-4 h-4 accent-[#cd733d] rounded"
            />
            <span className="text-sm font-semibold text-gray-700">¿Viene en paquete/presentación?</span>
          </label>

          {byPackage ? (
            <div className="bg-amber-50 rounded-xl p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-amber-800 mb-1">Precio del paquete (₡)</label>
                  <input
                    type="number"
                    min={0}
                    step="any"
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                    placeholder="0"
                    value={form.packagePrice || ""}
                    onChange={(e) => set("packagePrice", parseFloat(e.target.value) || 0)}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-amber-800 mb-1">Unidades en el paquete</label>
                  <input
                    type="number"
                    min={1}
                    step="any"
                    className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                    placeholder="1"
                    value={form.packageQuantity || ""}
                    onChange={(e) => set("packageQuantity", parseFloat(e.target.value) || 1)}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-amber-800 mb-1">Presentación</label>
                <input
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  placeholder="Ej: paquete x50, bolsa 1kg"
                  value={form.packageUnit || ""}
                  onChange={(e) => set("packageUnit", e.target.value)}
                />
              </div>
              <div className="text-sm font-semibold text-amber-900 bg-amber-100 rounded-lg px-3 py-2">
                → Precio por unidad calculado: 
                <span className="text-[#cd733d]">
                  ₡{((form.packagePrice ?? 0) / Math.max(form.packageQuantity ?? 1, 1)).toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Precio por unidad (₡)</label>
              <input
                type="number"
                min={0}
                step="any"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                placeholder="0"
                value={form.unitPrice || ""}
                onChange={(e) => set("unitPrice", parseFloat(e.target.value) || 0)}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
            <input
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="Ej: Lácteos, Harinas, Azúcares..."
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Notas (opcional)</label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="Marca, proveedor, observaciones..."
              value={form.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#cd733d] text-white rounded-lg text-sm font-semibold hover:bg-[#b5612c] transition-colors disabled:opacity-50"
            >
              {saving ? "Guardando…" : "Guardar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Panel principal
// ────────────────────────────────────────────────────────────────────────────

export function IngredientsPanel() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Ingredient | null>(null);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setIngredients(await fetchIngredients());
    } catch {
      setError("No se pudieron cargar los ingredientes. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Omit<Ingredient, "_id" | "createdAt" | "updatedAt">) => {
    if (modal === "edit" && selected) {
      const updated = await updateIngredient(selected._id, data);
      setIngredients((prev) => prev.map((i) => i._id === updated._id ? updated : i));
    } else {
      const created = await createIngredient(data);
      setIngredients((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)));
    }
    setModal(null);
    setSelected(null);
  };

  const handleDelete = async (ing: Ingredient) => {
    if (!confirm(`¿Eliminar "${ing.name}" del catálogo?`)) return;
    await deleteIngredient(ing._id);
    setIngredients((prev) => prev.filter((i) => i._id !== ing._id));
  };

  const filtered = ingredients.filter(
    (ing) => !search || ing.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">🥕 Catálogo de Ingredientes</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Administrá los precios de los ingredientes. Se usan como referencia en las recetas.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSelected(null); setModal("create"); }}
          className="shrink-0 bg-[#cd733d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#b5612c] transition-colors shadow-sm"
        >
          + Nuevo ingrediente
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Búsqueda */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        />
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Cargando ingredientes...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🧂</p>
          <p className="font-semibold text-lg text-gray-600">
            {search ? "No hay ingredientes que coincidan" : "Aún no hay ingredientes"}
          </p>
          {!search && (
            <p className="text-sm mt-1">
              Presioná{" "}
              <button
                type="button"
                onClick={() => { setSelected(null); setModal("create"); }}
                className="text-[#cd733d] font-semibold hover:underline"
              >
                + Nuevo ingrediente
              </button>{" "}
              para agregar el primero.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((ing) => (
            <div
              key={ing._id}
              className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#cd733d] hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="min-w-0">
                  {ing.category && (
                    <p className="text-xs text-[#cd733d] font-medium mb-0.5">{ing.category}</p>
                  )}
                  <p className="font-bold text-gray-900 truncate">{ing.name}</p>
                  <p className="text-sm text-gray-500 font-mono mt-0.5">
                    ₡{ing.unitPrice.toLocaleString("es-CR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}/{ing.unit}
                  </p>
                  {ing.packagePrice && ing.packagePrice > 0 && ing.packageUnit && (
                    <p className="text-xs text-amber-700 mt-0.5">
                      {ing.packageUnit} → ₡{ing.packagePrice.toLocaleString("es-CR")} el paquete
                    </p>
                  )}
                  {ing.notes && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{ing.notes}</p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => { setSelected(ing); setModal("edit"); }}
                    className="text-gray-300 hover:text-[#cd733d] text-sm transition-colors p-1"
                    title="Editar"
                  >
                    ✏️
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(ing)}
                    className="text-gray-300 hover:text-red-500 text-sm transition-colors p-1"
                    title="Eliminar"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              <div className="pt-3 border-t border-gray-100">
                <span className="inline-flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  Unidad: {ing.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <IngredientModal
          initial={modal === "edit" ? selected : null}
          onSave={handleSave}
          onClose={() => { setModal(null); setSelected(null); }}
        />
      )}
    </div>
  );
}
