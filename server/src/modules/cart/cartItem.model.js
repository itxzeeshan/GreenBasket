import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true, // denormalised so checkout can group by store
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: Number.isInteger,
        message: "quantity must be an integer",
      },
    },
  },
  { timestamps: true },
);

cartItemSchema.index({ userId: 1 }); // fetch a user's cart
cartItemSchema.index({ userId: 1, productId: 1 }, { unique: true }); // one line per product per user

export default mongoose.model("CartItem", cartItemSchema);
