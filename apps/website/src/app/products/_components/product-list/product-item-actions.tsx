"use client";
import React from "react";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select";
import {
  useCartLinesAdd,
  useCartLinesRemove,
  useGetCartQuery,
  useCartLinesUpdate,
} from "@/hooks/api/shopify-cart.hooks";
import { Spinner } from "@workspace/ui/components/spinner";
import { formatAmount } from "@/helpers/currency.helper";
function ProductItemActions({
  product,
}: {
  product: GetShopifyProductsRes["products"][number];
}) {
  console.log(product);
  const [variantIndex, setVariantIndex] = React.useState(0);
  const { data: cache } = useGetCartQuery();
  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const isAdded = cache?.lines?.nodes?.find(
    (line) => line.merchandise.id === product.variants[variantIndex].id
  );

  const handleAddQuantity = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId) return;
    addProduct({
      cartId,
      lines: [
        {
          attributes: [],
          quantity: 1,
          merchandiseId: product.variants[variantIndex].id,
          sellingPlanId: null,
          parent: null,
        },
      ],
    });
  };

  const handleRemoveProduct = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !isAdded) return;

    if (isAdded.quantity === 1) {
      removeProduct({
        cartId,
        lineIds: [isAdded.id],
      });
    } else {
      updateLines({
        cartId,
        lines: [
          // @ts-expect-error
          {
            id: isAdded.id,
            quantity: isAdded.quantity - 1,
          },
        ],
      });
    }
  };

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
        {formatAmount(
          product.variants[variantIndex].price
          // product.variants[variantIndex].unitPrice.currencyCode as any
        )}
      </strong>

      {isAdded ? (
        <ButtonGroup orientation={"horizontal"} className="ml-auto">
          <Button
            variant="outline"
            size={"icon-sm"}
            disabled={isRemoving}
            onClick={handleRemoveProduct}
          >
            {isUpdating || isRemoving ? <Spinner /> : <MinusIcon />}
          </Button>
          <Button
            variant="outline"
            size={"icon-sm"}
            className="pointer-events-none"
          >
            {" "}
            {isAdded?.quantity}{" "}
          </Button>
          <Button
            variant="outline"
            size={"icon-sm"}
            disabled={isAdding}
            onClick={handleAddQuantity}
          >
            {isAdding ? <Spinner /> : <PlusIcon />}
          </Button>
        </ButtonGroup>
      ) : (
        <Button
          disabled={isAdding}
          size="icon"
          className="ml-auto"
          onClick={handleAddQuantity}
        >
          {isAdding ? <Spinner /> : <ShoppingCartIcon />}
        </Button>
      )}
    </div>
  );
}

export default ProductItemActions;
