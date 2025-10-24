"use client";
import React from "react";
import { HeartIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";

function ProductItemActions() {
  return (
    <div className="grid grid-cols-2 p-4 gap-4">
      <button
        className="cursor-pointer group"
        aria-label="Add to wishlist"
        title="Add to wishlist"
        data-selected="false"
      >
        <HeartIcon className="group-data-[selected=true]:fill-current text-yellow-400 group-hover:scale-110 transition-all duration-300 active:scale-90" />
      </button>
      <Button size="icon" className="ml-auto">
        <ShoppingCartIcon />
      </Button>
    </div>
  );
}

export default ProductItemActions;
