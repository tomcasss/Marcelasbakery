import mongoose from "mongoose";

const ingredientSchema = new mongoose.Schema(
  {
    name:            { type: String, required: true },
    unit:            { type: String, default: "g" },
    unitPrice:       { type: Number, required: true },
    category:        { type: String, default: "" },
    notes:           { type: String, default: "" },
    packagePrice:    { type: Number, default: 0 },
    packageQuantity: { type: Number, default: 1 },
    packageUnit:     { type: String, default: "" },
  },
  { timestamps: true }
);

export const Ingredient = mongoose.model("Ingredient", ingredientSchema);
