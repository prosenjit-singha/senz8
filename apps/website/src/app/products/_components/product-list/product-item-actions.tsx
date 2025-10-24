"use client";
import React from "react";
import { HeartIcon, MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { useCartStore } from "@/stores/cart.store";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import { formatINRAmount } from "@/lib/utils";
function ProductItemActions({
  product,
}: {
  product: GetShopifyProductsRes["products"][number];
}) {
  const [variantIndex, setVariantIndex] = React.useState(0);
  const { state, actions } = useCartStore();

  const isAdded = state.data?.lines.find(
    (item) => item.merchandiseId === product.variants[variantIndex].id
  );

  return (
    <div className="grid grid-cols-2 gap-4 p-4 mt-auto">
      {product.variants.length > 1 && (
        <Select
          value={variantIndex.toString()}
          onValueChange={(value) => setVariantIndex(Number(value))}
        >
          <SelectTrigger size={"sm"} className="col-span-2 w-full">
            <SelectValue placeholder="Select variant" />
          </SelectTrigger>
          <SelectContent>
            {product.variants.map((variant, i) => (
              <SelectItem key={variant.id} value={i.toString()}>
                {variant.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      <strong className="text-primary font-black text-xl my-auto text-nowrap">
        {formatINRAmount(product.variants[variantIndex].price)}
      </strong>

      {isAdded ? (
        <ButtonGroup orientation={"horizontal"} className="ml-auto">
          <Button
            variant="outline"
            size={"icon-sm"}
            onClick={() =>
              actions.removeProduct(product.variants[variantIndex].id)
            }
          >
            <MinusIcon />{" "}
          </Button>
          <Button
            variant="outline"
            size={"icon-sm"}
            className="pointer-events-none"
          >
            {" "}
            {isAdded?.quantity || 0}{" "}
          </Button>
          <Button
            variant="outline"
            size={"icon-sm"}
            onClick={() =>
              actions.addProduct({
                quantity: 1,
                merchandiseId: product.variants[variantIndex].id,
                attributes: [],
              })
            }
          >
            <PlusIcon />{" "}
          </Button>
        </ButtonGroup>
      ) : (
        <Button
          size="icon"
          className="ml-auto"
          onClick={() =>
            actions.addProduct({
              quantity: 1,
              merchandiseId: product.variants[variantIndex].id,
              attributes: [],
            })
          }
        >
          <ShoppingCartIcon />
        </Button>
      )}
    </div>
  );
}

export default ProductItemActions;
