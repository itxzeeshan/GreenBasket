import mongoose from "mongoose";

// Embedded sub-schema: NOT a separate model/collection
const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true, // traceability, product may be deleted later
  },
  nameAtPurchase: { type: String, required: true },
  priceAtPurchase: { type: Number, required: true, min: 0 },
  unitAtPurchase: { type: String, required: true },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    validate: {
      validator: Number.isInteger,
      message: "quantity must be an integer",
    },
  },
  lineTotal: { type: Number, required: true, min: 0 }, // priceAtPurchase x quantity
});

const orderSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "packed", "dispatched", "cancelled"],
      required: true,
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      required: true,
      default: "pending",
    },
    stripePaymentIntentId: {
      type: String, // set at checkout in Ch 19
    },
    orderItems: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items) => items.length > 0,
        message: "An order must have at least one item",
      },
    },
    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

orderSchema.index({ storeId: 1 }); // vendor reads their orders
orderSchema.index({ customerId: 1 }); // customer order history

export default mongoose.model("Order", orderSchema);
