import mongoose from "mongoose";

export const UNITS = ["each", "bunch", "kg", "g", "L", "ml", "pack"];
export const CATEGORIES = [
  "produce",
  "dairy",
  "bakery",
  "pantry",
  "frozen",
  "beverages",
  "household",
];

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // per unit
    },
    unit: {
      type: String,
      enum: UNITS,
      required: true,
    },
    weightOrQuantity: {
      type: Number,
      min: 0, // pack size hint, e.g. 500 for a 500g pack
    },
    stockQty: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "stockQty must be an integer",
      },
    },
    isPerishable: {
      type: Boolean,
      required: true,
      default: false,
    },
    category: {
      type: String,
      enum: CATEGORIES,
      required: true,
    },
    isPublished: {
      type: Boolean,
      required: true,
      default: false, // draft until the vendor publishes
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
  },
  { timestamps: true },
);

productSchema.index({ storeId: 1 }); // vendor's product list
productSchema.index({ storeId: 1, isPublished: 1 }); // catalogue queries

export default mongoose.model("Product", productSchema);
