"use client";
import React from "react";
import { GetProductByHandleQuery } from "@/graphql";
import { formatAmount } from "@/helpers/currency.helper";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { Button } from "@workspace/ui/components/button";
import { motion } from "motion/react";
import {
  useCartLinesAdd,
  useCartLinesRemove,
  useCartLinesUpdate,
  useGetCartQuery,
} from "@/hooks/api/shopify-cart.hooks";
import { Spinner } from "@workspace/ui/components/spinner";

type ProductActionsProps = Omit<React.ComponentProps<"section">, "children"> & {
  data: NonNullable<GetProductByHandleQuery["product"]>;
};

export default function ProductActions({
  data,
  className,
  ...props
}: ProductActionsProps) {
  const option: Record<string, string> = {};
  data.options.forEach((op) => {
    option[op.name] = op.values[0];
  });
  const [selectedOption, setSelectedOptions] =
    React.useState<Record<string, string>>(option);

  const variantIndex = data.variants.nodes.findIndex((variant) =>
    variant.selectedOptions.every((op) => op.value === selectedOption[op.name])
  );
  const { data: cache } = useGetCartQuery();
  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const isAdded = cache?.lines?.nodes?.find(
    (line) => line.merchandise.id === data.variants.nodes[variantIndex].id
  );

  const isLoading = isAdding || isRemoving || isUpdating;

  const handleAddQuantity = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId) return;
    addProduct({
      cartId,
      lines: [
        {
          attributes: [],
          quantity: 1,
          merchandiseId: data.variants.nodes[variantIndex].id,
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
          // @ts-expect-error: Ignored keys can cause issue
          {
            id: isAdded.id,
            quantity: isAdded.quantity - 1,
          },
        ],
      });
    }
  };

  const isOutOfStock = !data.variants.nodes[variantIndex].availableForSale;

  return (
    <section
      data-slot="product-details"
      {...props}
      className={cn("flex flex-col flex-1", className)}
    >
      <Badge variant={"outline"}>{data.productType}</Badge>
      <h1 className="text-2xl font-bold my-2">{data.title}</h1>
      <div className="flex gap-4 items-center">
        <strong className="text-green-600 text-xl">
          {formatAmount(
            data.variants.nodes[variantIndex].price.amount,
            data.variants.nodes[variantIndex].price.currencyCode as any
          )}
        </strong>
        {!isOutOfStock ? (
          <div className="rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-2 px-2 text-xs py-1">
            <div className="size-1.5 rounded-full bg-green-500" /> In Stock
          </div>
        ) : (
          <div className="rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-2 px-2 text-xs py-1">
            <div className="size-1.5 rounded-full bg-red-500" /> Out of Stock
          </div>
        )}
      </div>
      <div data-slot={"option-selector"} className="flex flex-col gap-4 mt-6">
        {data.options.map((option, i) => (
          <div key={option.id} className="flex flex-col gap-2">
            <label>{option.name}</label>
            <ul className="flex border w-fit">
              {option.values.map((value, j) => (
                <li
                  role="button"
                  key={j}
                  className="relative flex-1 px-3 py-2 text-lg cursor-pointer border-r last:border-r-0"
                  onClick={() => {
                    setSelectedOptions({
                      ...selectedOption,
                      [option.name]: value,
                    });
                  }}
                >
                  {value === selectedOption[option.name] && (
                    <motion.span
                      layoutId={`active-${option.name}`}
                      className="absolute top-0 left-0 h-full w-full rounded-[inherit] bg-primary"
                    />
                  )}
                  <span className="z-[10] relative">{value}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-4 mt-6">
        {isAdded ? (
          <Button
            variant={"destructive"}
            size="lg"
            disabled={isLoading || isOutOfStock}
            onClick={() => {
              const cartId = localStorage.getItem("cartId")!;
              if (!cartId || !isAdded) return;
              removeProduct({
                cartId,
                lineIds: [isAdded.id],
              });
            }}
          >
            {isRemoving ? (
              <>
                <Spinner /> Removing from Cart
              </>
            ) : (
              "Remove From Cart"
            )}
          </Button>
        ) : (
          <Button
            disabled={isLoading || isOutOfStock}
            size="lg"
            variant={"outline"}
            onClick={handleAddQuantity}
          >
            {isAdding ? (
              <>
                <Spinner /> Adding to Cart
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        )}

        <Button size="lg" disabled={isLoading || isOutOfStock}>
          Buy Now
        </Button>
      </div>
    </section>
  );
}
