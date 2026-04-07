import { useState, useEffect } from "react";
import type { Recipe, RecipeIngredient, RecipeIngredientRef, Ingredient } from "../types";
import { fetchRecipes, createRecipe, updateRecipe, deleteRecipe, fetchIngredients } from "../api";

// ────────────────────────────────────────────────────────────────────────────
// Helpers de costo
// ────────────────────────────────────────────────────────────────────────────

function calcCosts(r: Omit<Recipe, "_id" | "createdAt" | "updatedAt">) {
  // Ingredients are entered per unit (not per batch)
  const ingredientCost = r.ingredients.reduce(
    (sum, ing) => sum + ing.quantity * ing.unitPrice,
    0
  );
  // Labor cost distributed across all units in the batch
  const batch = r.batchSize > 0 ? r.batchSize : 1;
  const laborCost = (r.laborMinutes / 60) * r.laborRatePerHour / batch;
  const subtotal = ingredientCost + laborCost;
  // Overhead applied on per-unit subtotal
  const overhead = subtotal * (r.overheadPercent / 100);
  const costPerUnit = subtotal + overhead;
  // True margin formula: price = cost / (1 - margin%)
  const safeProfitMargin = Math.min(r.profitMargin, 99.99);
  const suggestedPrice = costPerUnit / (1 - safeProfitMargin / 100);
  return { ingredientCost, laborCost, overhead, costPerUnit, suggestedPrice };
}

const fmt = (n: number) =>
  "₡" + Math.round(n).toLocaleString("es-CR");

const UNITS = ["g", "kg", "ml", "L", "unidad", "taza", "cdta", "cda", "oz"];
const CATEGORIES = ["Repostería", "Panadería", "Platos Fuertes", "Postres", "Bebidas", "Otros"];

const EMPTY_INGREDIENT: RecipeIngredientRef = {
  name: "",
  quantity: 1,
  unit: "g",
  unitPrice: 0,
};

const EMPTY_RECIPE: Omit<Recipe, "_id" | "createdAt" | "updatedAt"> = {
  name: "",
  category: CATEGORIES[0],
  description: "",
  ingredients: [{ ...EMPTY_INGREDIENT }],
  laborMinutes: 0,
  laborRatePerHour: 3000,
  batchSize: 1,
  overheadPercent: 10,
  profitMargin: 50,
};

// ────────────────────────────────────────────────────────────────────────────
// Sub-componente: fila de ingrediente
// ────────────────────────────────────────────────────────────────────────────

function IngredientRow({
  ing,
  index,
  onChange,
  onCatalogSelect,
  onRemove,
  canRemove,
  catalogIngredients,
}: {
  ing: RecipeIngredientRef;
  index: number;
  onChange: (i: number, field: keyof RecipeIngredient, val: string | number) => void;
  onCatalogSelect: (i: number, catalogIng: Ingredient | null) => void;
  onRemove: (i: number) => void;
  canRemove: boolean;
  catalogIngredients: Ingredient[];
}) {
  const selectValue = ing.ingredientId || (ing.name ? "__manual__" : "");

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "__manual__" || val === "") {
      onCatalogSelect(index, null);
    } else {
      const found = catalogIngredients.find((ci) => ci._id === val) || null;
      onCatalogSelect(index, found);
    }
  };

  return (
    <div className="grid grid-cols-12 gap-2 items-start">
      <div className="col-span-4 space-y-1">
        <select
          className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
          value={selectValue}
          onChange={handleSelectChange}
        >
          <option value="">-- Seleccionar del catálogo --</option>
          {catalogIngredients.map((ci) => (
            <option key={ci._id} value={ci._id}>{ci.name} ({ci.unit})</option>
          ))}
          <option value="__manual__">✏️ Ingresar manualmente</option>
        </select>
        {!ing.ingredientId && (
          <input
            className="w-full border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
            placeholder="Nombre del ingrediente"
            value={ing.name}
            onChange={(e) => onChange(index, "name", e.target.value)}
          />
        )}
      </div>
      <input
        type="number"
        min={0}
        step="any"
        className="col-span-2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        placeholder="Cant."
        value={ing.quantity || ""}
        onChange={(e) => onChange(index, "quantity", parseFloat(e.target.value) || 0)}
      />
      <select
        className="col-span-2 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        value={ing.unit}
        onChange={(e) => onChange(index, "unit", e.target.value)}
      >
        {UNITS.map((u) => <option key={u}>{u}</option>)}
      </select>
      <input
        type="number"
        min={0}
        step="any"
        className="col-span-3 border border-gray-300 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        placeholder="Precio unitario ₡"
        value={ing.unitPrice || ""}
        onChange={(e) => onChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
      />
      <button
        type="button"
        disabled={!canRemove}
        onClick={() => onRemove(index)}
        className="col-span-1 text-red-400 hover:text-red-600 disabled:opacity-20 text-xl leading-none font-bold"
      >
        ×
      </button>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-componente: Modal crear/editar receta
// ────────────────────────────────────────────────────────────────────────────

function RecipeModal({
  initial,
  onSave,
  onClose,
}: {
  initial: Omit<Recipe, "_id" | "createdAt" | "updatedAt"> | null;
  onSave: (data: Omit<Recipe, "_id" | "createdAt" | "updatedAt">) => Promise<void>;
  onClose: () => void;
}) {
  const [form, setForm] = useState<Omit<Recipe, "_id" | "createdAt" | "updatedAt">>(
    initial ?? { ...EMPTY_RECIPE, ingredients: [{ ...EMPTY_INGREDIENT }] }
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [catalogIngredients, setCatalogIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    fetchIngredients().then(setCatalogIngredients).catch(() => {});
  }, []);

  const set = (field: string, val: unknown) =>
    setForm((f) => ({ ...f, [field]: val }));

  const setIngredient = (i: number, field: keyof RecipeIngredient, val: string | number) => {
    setForm((f) => {
      const ings = [...f.ingredients];
      ings[i] = { ...ings[i], [field]: val };
      return { ...f, ingredients: ings };
    });
  };

  const addIngredient = () =>
    setForm((f) => ({ ...f, ingredients: [...f.ingredients, { ...EMPTY_INGREDIENT }] }));

  const removeIngredient = (i: number) =>
    setForm((f) => ({ ...f, ingredients: f.ingredients.filter((_, idx) => idx !== i) }));

  const handleCatalogSelect = (i: number, catalogIng: Ingredient | null) => {
    setForm((f) => {
      const ings = [...f.ingredients] as RecipeIngredientRef[];
      if (catalogIng) {
        ings[i] = { ...ings[i], ingredientId: catalogIng._id, name: catalogIng.name, unit: catalogIng.unit, unitPrice: catalogIng.unitPrice };
      } else {
        ings[i] = { ...ings[i], ingredientId: undefined };
      }
      return { ...f, ingredients: ings };
    });
  };

  const costs = calcCosts(form);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError("El nombre es obligatorio"); return; }
    if (form.ingredients.some((ing) => !ing.name.trim())) {
      setError("Todos los ingredientes deben tener nombre");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error al guardar");
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 className="text-lg font-bold text-gray-900">
            {initial ? "Editar receta" : "Nueva receta"}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre y categoría */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nombre de la receta *</label>
              <input
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                placeholder="Ej: Tres Leches porción"
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Categoría</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
                value={form.category}
                onChange={(e) => set("category", e.target.value)}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Descripción (opcional)</label>
            <textarea
              rows={2}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
              placeholder="Notas sobre la receta..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          {/* Ingredientes */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-semibold text-gray-700">Ingredientes</label>
              <button
                type="button"
                onClick={addIngredient}
                className="text-xs bg-[#cd733d] text-white px-3 py-1 rounded-lg hover:bg-[#b5612c] transition-colors"
              >
                + Agregar
              </button>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-12 gap-2 text-xs text-gray-400 font-medium mb-1 px-0.5">
                <span className="col-span-4">Nombre</span>
                <span className="col-span-2">Cantidad</span>
                <span className="col-span-2">Unidad</span>
                <span className="col-span-3">Precio unitario</span>
              </div>
              {form.ingredients.map((ing, i) => (
                <IngredientRow
                  key={i}
                  ing={ing}
                  index={i}
                  onChange={setIngredient}
                  onCatalogSelect={handleCatalogSelect}
                  onRemove={removeIngredient}
                  canRemove={form.ingredients.length > 1}
                  catalogIngredients={catalogIngredients}
                />
              ))}
            </div>
          </div>

          {/* Mano de obra */}
          <div className="bg-amber-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-amber-800">⏱️ Mano de obra</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-amber-700 mb-1">Minutos de trabajo</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  placeholder="30"
                  value={form.laborMinutes || ""}
                  onChange={(e) => set("laborMinutes", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs text-amber-700 mb-1">Tarifa por hora (₡)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border border-amber-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  placeholder="3000"
                  value={form.laborRatePerHour || ""}
                  onChange={(e) => set("laborRatePerHour", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Producción y parámetros */}
          <div className="bg-blue-50 rounded-xl p-4 space-y-3">
            <p className="text-sm font-semibold text-blue-800">📦 Producción y margen</p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-blue-700 mb-1">Unidades del lote (para calcular MO por unidad)</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  value={form.batchSize || ""}
                  onChange={(e) => set("batchSize", parseFloat(e.target.value) || 1)}
                />
                <p className="text-xs text-blue-400 mt-1 leading-snug">
                  Los ingredientes se ingresan por unidad. Este número solo divide la mano de obra.
                </p>
              </div>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Gastos generales (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  placeholder="10"
                  value={form.overheadPercent ?? ""}
                  onChange={(e) => set("overheadPercent", parseFloat(e.target.value) || 0)}
                />
              </div>
              <div>
                <label className="block text-xs text-blue-700 mb-1">Margen de ganancia (%)</label>
                <input
                  type="number"
                  min={0}
                  className="w-full border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white"
                  placeholder="50"
                  value={form.profitMargin ?? ""}
                  onChange={(e) => set("profitMargin", parseFloat(e.target.value) || 0)}
                />
              </div>
            </div>
          </div>

          {/* Desglose en tiempo real */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <p className="font-semibold text-gray-700 mb-3">📊 Resumen en tiempo real</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-600">
              <span>Ingredientes (por unidad)</span>
              <span className="text-right font-medium">{fmt(costs.ingredientCost)}</span>
              <span>MO ({form.laborMinutes} min ÷ {form.batchSize} ud{form.batchSize !== 1 ? "s" : "."})</span>
              <span className="text-right font-medium">{fmt(costs.laborCost)}</span>
              <span>Gastos generales ({form.overheadPercent}%)</span>
              <span className="text-right font-medium">{fmt(costs.overhead)}</span>
              <span className="font-semibold text-gray-800">Costo por unidad</span>
              <span className="text-right font-bold text-[#cd733d]">{fmt(costs.costPerUnit)}</span>
              <span className="text-gray-400 text-xs">Lote de {form.batchSize} unidad{form.batchSize !== 1 ? "es" : ""} (informativo)</span>
              <span className="text-right text-gray-400 text-xs">{fmt(costs.costPerUnit * form.batchSize)}</span>
            </div>
            <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between items-center">
              <span className="font-bold text-gray-800">Precio sugerido (margen {form.profitMargin}%)</span>
              <span className="text-xl font-extrabold text-[#cd733d]">{fmt(costs.suggestedPrice)}</span>
            </div>
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
              {saving ? "Guardando…" : "Guardar receta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Sub-componente: Detalle de receta (modal de solo lectura)
// ────────────────────────────────────────────────────────────────────────────

function RecipeDetail({
  recipe,
  onClose,
  onEdit,
  onDelete,
}: {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const costs = calcCosts(recipe);
  const [simQty, setSimQty] = useState(1);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 overflow-y-auto bg-black/50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#cd733d] to-[#e89360] text-white p-6 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white/70 text-xs font-medium">{recipe.category}</p>
              <h2 className="text-2xl font-bold mt-0.5">{recipe.name}</h2>
              {recipe.description && (
                <p className="text-white/80 text-sm mt-1">{recipe.description}</p>
              )}
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white text-2xl font-bold leading-none">×</button>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Ingredientes */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">🧂 Ingredientes</h3>
            <div className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex justify-between text-sm py-1 border-b border-gray-100 last:border-0">
                  <span className="text-gray-700">
                    {ing.name} — {ing.quantity} {ing.unit}
                  </span>
                  <span className="text-gray-500 font-mono text-xs">
                    {fmt(ing.unitPrice)}/{ing.unit} = {fmt(ing.quantity * ing.unitPrice)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Desglose de costos */}
          <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-2">
            <h3 className="font-semibold text-gray-800 mb-3">📊 Desglose de costos</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-600">
              <span>Ingredientes (por unidad)</span>
              <span className="text-right">{fmt(costs.ingredientCost)}</span>
              <span>MO ({recipe.laborMinutes} min ÷ {recipe.batchSize} ud{recipe.batchSize !== 1 ? "s" : "."})</span>
              <span className="text-right">{fmt(costs.laborCost)}</span>
              <span>Gastos generales ({recipe.overheadPercent}%)</span>
              <span className="text-right">{fmt(costs.overhead)}</span>
              <span className="font-semibold text-gray-800 pt-2 border-t border-gray-200">Costo por unidad</span>
              <span className="text-right font-bold text-[#cd733d] pt-2 border-t border-gray-200">{fmt(costs.costPerUnit)}</span>
              <span className="text-gray-400 text-xs">Lote de {recipe.batchSize} unidad{recipe.batchSize !== 1 ? "es" : ""} (informativo)</span>
              <span className="text-right text-gray-400 text-xs">{fmt(costs.costPerUnit * recipe.batchSize)}</span>
            </div>
            <div className="mt-4 pt-4 border-t-2 border-[#cd733d]/20 flex justify-between items-center">
              <div>
                <p className="font-bold text-gray-800">Precio sugerido de venta</p>
                <p className="text-xs text-gray-400">Con {recipe.profitMargin}% de margen real de ganancia</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-extrabold text-[#cd733d]">{fmt(costs.suggestedPrice)}</p>
                <p className="text-xs text-gray-400">por unidad</p>
              </div>
            </div>
          </div>

          {/* Simulador de producción */}
          <div className="bg-emerald-50 rounded-xl p-4 text-sm space-y-3">
            <h3 className="font-semibold text-emerald-800">🧮 Simulador de producción</h3>
            <div className="flex items-center gap-3">
              <label className="text-emerald-700 text-sm shrink-0">¿Cuántas unidades querés producir?</label>
              <input
                type="number"
                min={1}
                value={simQty}
                onChange={(e) => setSimQty(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-20 border border-emerald-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d] bg-white text-center font-bold"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-gray-600">
              <span>Costo unitario</span>
              <span className="text-right font-semibold text-gray-800">{fmt(costs.costPerUnit)}</span>
              <span className="font-semibold text-gray-800">Costo para {simQty} unidad{simQty !== 1 ? "es" : ""}</span>
              <span className="text-right font-bold text-emerald-700">{fmt(costs.costPerUnit * simQty)}</span>
            </div>
            {simQty > 1 && (
              <div className="pt-2 border-t border-emerald-200 space-y-1">
                <p className="text-xs font-medium text-gray-500 mb-1">Desglose para {simQty} unidades:</p>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-gray-500">
                  <span>Ingredientes</span>
                  <span className="text-right">{fmt(costs.ingredientCost * simQty)}</span>
                  <span>Mano de obra</span>
                  <span className="text-right">{fmt(costs.laborCost * simQty)}</span>
                  <span>Gastos generales</span>
                  <span className="text-right">{fmt(costs.overhead * simQty)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Acciones */}
          <div className="flex justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onDelete}
              className="text-red-500 text-sm hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors"
            >
              🗑️ Eliminar
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={onEdit}
                className="px-4 py-2 bg-[#cd733d] text-white rounded-lg text-sm font-semibold hover:bg-[#b5612c] transition-colors"
              >
                ✏️ Editar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Panel principal
// ────────────────────────────────────────────────────────────────────────────

export function CostCalculatorPanel() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Recipe | null>(null);
  const [detail, setDetail] = useState<Recipe | null>(null);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      setRecipes(await fetchRecipes());
    } catch {
      setError("No se pudieron cargar las recetas. ¿Está corriendo el backend?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (data: Omit<Recipe, "_id" | "createdAt" | "updatedAt">) => {
    if (modal === "edit" && selected) {
      const updated = await updateRecipe(selected._id, data);
      setRecipes((prev) => prev.map((r) => r._id === updated._id ? updated : r));
    } else {
      const created = await createRecipe(data);
      setRecipes((prev) => [created, ...prev]);
    }
    setModal(null);
    setSelected(null);
    setDetail(null);
  };

  const handleDelete = async (recipe: Recipe) => {
    if (!confirm(`¿Eliminar la receta "${recipe.name}"?`)) return;
    await deleteRecipe(recipe._id);
    setRecipes((prev) => prev.filter((r) => r._id !== recipe._id));
    setDetail(null);
  };

  const categories = ["all", ...Array.from(new Set(recipes.map((r) => r.category).filter(Boolean)))];

  const filtered = recipes.filter((r) => {
    const matchCat = catFilter === "all" || r.category === catFilter;
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto py-6 px-4">
      {/* Encabezado */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">💰 Calculadora de Costos</h2>
          <p className="text-gray-500 mt-1 text-sm">
            Calculá el costo real de cada receta y obtené el precio de venta sugerido.
          </p>
        </div>
        <button
          type="button"
          onClick={() => { setSelected(null); setModal("create"); }}
          className="shrink-0 bg-[#cd733d] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-[#b5612c] transition-colors shadow-sm"
        >
          + Nueva receta
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Filtros */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        />
        <select
          value={catFilter}
          onChange={(e) => setCatFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#cd733d]"
        >
          {categories.map((c) => (
            <option key={c} value={c}>{c === "all" ? "Todas las categorías" : c}</option>
          ))}
        </select>
      </div>

      {/* Contenido */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-gray-400">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p>Cargando recetas...</p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <p className="text-5xl mb-4">🍰</p>
          <p className="font-semibold text-lg text-gray-600">{search ? "No hay recetas que coincidan" : "Aún no hay recetas"}</p>
          {!search && (
            <p className="text-sm mt-1">
              Presioná{" "}
              <button
                type="button"
                onClick={() => { setSelected(null); setModal("create"); }}
                className="text-[#cd733d] font-semibold hover:underline"
              >
                + Nueva receta
              </button>{" "}
              para agregar la primera.
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((recipe) => {
            const costs = calcCosts(recipe);
            return (
              <div
                key={recipe._id}
                onClick={() => setDetail(recipe)}
                className="bg-white rounded-2xl border border-gray-200 p-5 hover:border-[#cd733d] hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="min-w-0">
                    <p className="text-xs text-[#cd733d] font-medium mb-0.5">{recipe.category}</p>
                    <p className="font-bold text-gray-900 truncate">{recipe.name}</p>
                    {recipe.description && (
                      <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{recipe.description}</p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setSelected(recipe); setModal("edit"); }}
                    className="shrink-0 text-gray-300 hover:text-[#cd733d] text-sm transition-colors"
                    title="Editar"
                  >
                    ✏️
                  </button>
                </div>

                <div className="space-y-1.5 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Costo por unidad</span>
                    <span className="font-semibold text-gray-800">{fmt(costs.costPerUnit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Lote de {recipe.batchSize} ud{recipe.batchSize !== 1 ? "s" : "."}</span>
                    <span className="font-semibold text-gray-800">{fmt(costs.costPerUnit * recipe.batchSize)}</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-400">Precio sugerido</p>
                    <p className="text-lg font-extrabold text-[#cd733d]">{fmt(costs.suggestedPrice)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-400">Margen</p>
                    <p className="text-sm font-bold text-emerald-600">{recipe.profitMargin}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal crear/editar */}
      {modal && (
        <RecipeModal
          initial={modal === "edit" && selected ? { ...selected } : null}
          onSave={handleSave}
          onClose={() => { setModal(null); setSelected(null); }}
        />
      )}

      {/* Modal detalle */}
      {detail && modal === null && (
        <RecipeDetail
          recipe={detail}
          onClose={() => setDetail(null)}
          onEdit={() => { setSelected(detail); setDetail(null); setModal("edit"); }}
          onDelete={() => handleDelete(detail)}
        />
      )}
    </div>
  );
}
