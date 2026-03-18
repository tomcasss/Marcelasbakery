import { Router } from "express";
import { Recipe } from "../models/Recipe.js";

export const recipesRouter = Router();

// GET /api/admin/recipes
recipesRouter.get("/", async (_req, res) => {
  try {
    const recipes = await Recipe.find().sort({ createdAt: -1 });
    res.json(recipes);
  } catch {
    res.status(500).json({ error: "Error al listar recetas" });
  }
});

// GET /api/admin/recipes/:id
recipesRouter.get("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.json(recipe);
  } catch {
    res.status(500).json({ error: "Error al obtener receta" });
  }
});

// POST /api/admin/recipes
recipesRouter.post("/", async (req, res) => {
  try {
    const recipe = await Recipe.create(req.body);
    res.status(201).json(recipe);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al crear receta" });
  }
});

// PUT /api/admin/recipes/:id
recipesRouter.put("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.json(recipe);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al actualizar receta" });
  }
});

// DELETE /api/admin/recipes/:id
recipesRouter.delete("/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findByIdAndDelete(req.params.id);
    if (!recipe) return res.status(404).json({ error: "Receta no encontrada" });
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error al eliminar receta" });
  }
});
