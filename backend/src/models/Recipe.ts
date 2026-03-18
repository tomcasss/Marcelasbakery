import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: "g" },
    unitPrice: { type: Number, required: true },
  },
  { _id: false }
);

const recipeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: { type: String, default: "" },
    description: { type: String, default: "" },
    ingredients: [ingredientSchema],
    laborMinutes: { type: Number, default: 0 },
    laborRatePerHour: { type: Number, default: 3000 },
    batchSize: { type: Number, default: 1 },
    overheadPercent: { type: Number, default: 10 },
    profitMargin: { type: Number, default: 50 },
  },
  { timestamps: true }
);

export const Recipe = mongoose.model("Recipe", recipeSchema);
