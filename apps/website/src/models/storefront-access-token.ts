import "server-only";

import mongoose from "mongoose";

export const mStorefrontAccessToken = new mongoose.Schema(
  {
    title: { type: String, required: true },
    shopId: { type: String, required: true },
    accessToken: { type: String, required: true },
  },
  { timestamps: true }
);

export const StorefrontAccessToken =
  mongoose.models.StorefrontAccessToken ||
  mongoose.model(
    "StorefrontAccessToken",
    mStorefrontAccessToken,
    "StorefrontAccessToken"
  );
