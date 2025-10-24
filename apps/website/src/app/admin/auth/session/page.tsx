"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import { Input } from "@workspace/ui/components/input";
import { Card } from "@workspace/ui/components/card";

export default function ShopifySessionPage() {
  const handleInstall = async (formData: FormData) => {
    const shopName = formData.get("shop");
    if (typeof shopName === "string") {
      window.location.href = `/api/shopify/auth/permission?shop=${encodeURIComponent(shopName)}`;
    }
  };

  return (
    <div className="min-h-svh w-full flex items-center justify-center">
      <Card className="p-4 flex flex-col gap-4">
        <form action={handleInstall} className="flex gap-4 flex-col">
          <div className="space-x-1">
            <label className="text-sm">Shopify Shop Name</label>
            <Input
              name="shop"
              placeholder="your-shop-name.myshopify.com"
              required
              min="14"
              // type="url"
            />
          </div>
          <Button type="submit" className="px-4 py-2 bg-black text-white rounded-lg">
            Install Shopify App
          </Button>
        </form>
      </Card>
    </div>
  );
}
