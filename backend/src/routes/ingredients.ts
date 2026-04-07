import { Router } from "express";
import { Ingredient } from "../models/Ingredient.js";

export const ingredientsRouter = Router();

// GET /api/admin/ingredients
ingredientsRouter.get("/", async (_req, res) => {
  try {
    const ingredients = await Ingredient.find().sort({ name: 1 });
    res.json(ingredients);
  } catch {
    res.status(500).json({ error: "Error al listar ingredientes" });
  }
});

// GET /api/admin/ingredients/:id
ingredientsRouter.get("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findById(req.params.id);
    if (!ingredient) return res.status(404).json({ error: "Ingrediente no encontrado" });
    res.json(ingredient);
  } catch {
    res.status(500).json({ error: "Error al obtener ingrediente" });
  }
});

// POST /api/admin/ingredients
ingredientsRouter.post("/", async (req, res) => {
  try {
    const ingredient = await Ingredient.create(req.body);
    res.status(201).json(ingredient);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al crear ingrediente" });
  }
});

// PUT /api/admin/ingredients/:id
ingredientsRouter.put("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!ingredient) return res.status(404).json({ error: "Ingrediente no encontrado" });
    res.json(ingredient);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al actualizar ingrediente" });
  }
});

// DELETE /api/admin/ingredients/:id
ingredientsRouter.delete("/:id", async (req, res) => {
  try {
    const ingredient = await Ingredient.findByIdAndDelete(req.params.id);
    if (!ingredient) return res.status(404).json({ error: "Ingrediente no encontrado" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error al eliminar ingrediente" });
  }
});
