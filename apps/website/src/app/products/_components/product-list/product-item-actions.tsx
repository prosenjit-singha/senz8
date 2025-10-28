"use client";
import React from "react";
import { formatAmount } from "@/helpers/currency.helper";
import { GetProductsQuery } from "@/graphql";
import { CartActions } from "@/components/shared/cart-sheet";

function ProductItemActions({
  product,
}: {
  product: GetProductsQuery["products"]["nodes"][number];
}) {
  const [variantIndex, setVariantIndex] = React.useState(0);

  React.useEffect(() => {
    const outOfStock = document.getElementById(
      product.handle + "-out-of-stock"
    );
    if (outOfStock) {
      if (product.variants.nodes[variantIndex].quantityAvailable === 0) {
        outOfStock.classList.remove("invisible");
      }
    }
  }, [variantIndex]);

  return (
    <div className="grid grid-cols-2 gap-4 p-4 mt-auto">
      <strong className="text-primary vis font-black text-xl my-auto text-nowrap">
        {formatAmount(
          product.variants.nodes[variantIndex].price.amount
          // product.variants[variantIndex].unitPrice.currencyCode as any
        )}
      </strong>
      <CartActions
        className="ml-auto"
        setActiveVariantIndex={setVariantIndex}
        data={{
          variants: product.variants.nodes.map((v) => ({
            id: v.id,
            title: v.title,
            price: v.price,
            availableForSale: v.availableForSale,
            quantityAvailable: v.quantityAvailable,
            currentlyNotInStock: v.currentlyNotInStock,
            quantityRule: v.quantityRule,
          })),
          options: product.options,
        }}
      />
    </div>
  );
}

export default ProductItemActions;
