import "server-only";

import mongoose from "mongoose";

export const mCustomerCart = new mongoose.Schema(
  {
    customerId: { type: String, required: true, unique: true },
    cartId: { type: String, required: true },
    cartKey: { type: String, required: true },
  },
  { timestamps: true }
);

export const CustomerCart =
  mongoose.models.CustomerCart ||
  mongoose.model("CustomerCart", mCustomerCart, "CustomerCart");
