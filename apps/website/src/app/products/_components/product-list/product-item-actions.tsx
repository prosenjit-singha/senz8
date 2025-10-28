"use client";
import React from "react";
import { MinusIcon, PlusIcon, ShoppingCartIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
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
import { GetProductsQuery } from "@/graphql";
import { motion } from "motion/react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";

function ProductItemActions({
  product,
}: {
  product: GetProductsQuery["products"]["nodes"][number];
}) {
  const option: Record<string, string> = {};
  product.options.forEach((op) => {
    option[op.name] = op.values[0];
  });
  const [selectedOption, setSelectedOption] =
    React.useState<Record<string, string>>(option);

  const variantIndex = product.variants.nodes.findIndex((variant) =>
    variant.selectedOptions.every((op) => op.value === selectedOption[op.name])
  );

  const { data: cache } = useGetCartQuery();
  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const isPending = isAdding || isRemoving || isUpdating;

  const isAdded = cache?.lines?.nodes?.find(
    (line) => line.merchandise.id === product.variants.nodes[variantIndex].id
  );

  const isOutOfStock = !product.variants.nodes[variantIndex].availableForSale;

  const handleAddQuantity = async () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId) return;
    await addProduct({
      cartId,
      lines: [
        {
          attributes: [],
          quantity: 1,
          merchandiseId: product.variants.nodes[variantIndex].id,
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

  return (
    <div className="grid grid-cols-2 gap-4 p-4 mt-auto">
      <strong className="text-primary font-black text-xl my-auto text-nowrap">
        {formatAmount(
          product.variants.nodes[variantIndex].price.amount
          // product.variants[variantIndex].unitPrice.currencyCode as any
        )}
      </strong>

      {isAdded ? (
        <ButtonGroup orientation={"horizontal"} className="ml-auto">
          <Button
            variant="outline"
            size={"icon-sm"}
            disabled={isPending}
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
            disabled={isPending}
            onClick={handleAddQuantity}
          >
            {isAdding ? <Spinner /> : <PlusIcon />}
          </Button>
        </ButtonGroup>
      ) : product.variants.nodes.length > 1 ? (
        <VariantSelectorAlert
          product={product}
          setSelectedOption={setSelectedOption}
          selectedOption={selectedOption}
          isOutOfStock={isOutOfStock}
          variantIndex={variantIndex}
          handleAddQuantity={handleAddQuantity}
          isPending={isPending}
        />
      ) : (
        <Button
          size="icon"
          className="ml-auto"
          onClick={handleAddQuantity}
          disabled={isOutOfStock || isPending}
        >
          {isAdding ? <Spinner /> : <ShoppingCartIcon />}
        </Button>
      )}
    </div>
  );
}

function VariantSelectorAlert({
  product,
  setSelectedOption,
  selectedOption,
  isOutOfStock,
  variantIndex,
  handleAddQuantity,
  isPending,
}: {
  product: GetProductsQuery["products"]["nodes"][number];
  setSelectedOption: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  selectedOption: Record<string, string>;
  isOutOfStock: boolean;
  variantIndex: number;
  handleAddQuantity: () => Promise<void>;
  isPending: boolean;
}) {
  const [open, setOpen] = React.useState(false);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button size="icon" className="ml-auto">
          <ShoppingCartIcon />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Add to Cart</AlertDialogTitle>
          <AlertDialogDescription>
            Select size and quantity
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex gap-4">
          <div data-slot={"option selector"} className="flex flex-col gap-4">
            {product.options.map((option, i) => (
              <div key={option.id} className="flex flex-col gap-2">
                <label>{option.name}</label>
                <ul className="flex border w-fit">
                  {option.values.map((value, j) => (
                    <li
                      role="button"
                      key={j}
                      className="relative flex-1 px-3 py-2 text-lg cursor-pointer border-r last:border-r-0"
                      onClick={() => {
                        setSelectedOption({
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
                      <span className="z-[10] relative text-nowrap">
                        {value}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-4 justify-center items-center h-full flex-1 border p-3">
            <strong className="text-green-600 text-2xl font-bold">
              {formatAmount(
                product.variants.nodes[variantIndex].price.amount,
                product.variants.nodes[variantIndex].price.currencyCode as any
              )}
            </strong>
            {!isOutOfStock ? (
              <div className="rounded-full bg-green-500/10 text-green-600 border border-green-500/20 flex items-center gap-2 px-2 text-xs py-1">
                <div className="size-1.5 rounded-full bg-green-500" /> In Stock
              </div>
            ) : (
              <div className="rounded-full bg-red-500/10 text-red-600 border border-red-500/20 flex items-center gap-2 px-2 text-xs py-1">
                <div className="size-1.5 rounded-full bg-red-500" /> Out of
                Stock
              </div>
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="mr-auto">Cancel</AlertDialogCancel>
          <Button
            onClick={() => handleAddQuantity().then(() => setOpen(false))}
            disabled={isPending || isOutOfStock}
          >
            {isPending ? (
              <>
                <Spinner /> Adding to cart...
              </>
            ) : (
              "Add to Cart"
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ProductItemActions;
