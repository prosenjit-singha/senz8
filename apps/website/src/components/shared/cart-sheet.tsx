"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@workspace/ui/components/sheet";
import { useCartStore } from "@/stores/cart.store";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { MinusIcon, PlusIcon, ShoppingCartIcon, TrashIcon } from "lucide-react";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { formatAmount } from "@/helpers/currency.helper";
import {
  useCartLinesAdd,
  useCartLinesRemove,
  useCartLinesUpdate,
  useGetCartQuery,
} from "@/hooks/api/shopify-cart.hooks";
import Link from "next/link";
import Image from "next/image";
import { IMAGE_PLACEHOLDER, PRODUCT_SAMPLES } from "@/constants";
import { Spinner } from "@workspace/ui/components/spinner";
import { GetCartQuery } from "@/graphql";
import { cn } from "@workspace/ui/lib/utils";
import { Separator } from "@workspace/ui/components/separator";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@workspace/ui/components/alert-dialog";
import { motion } from "motion/react";

function CartSheet() {
  const { state, actions } = useCartStore();
  const { data } = useGetCartQuery();

  return (
    <Sheet open={state.isOpen} onOpenChange={actions.setOpenState}>
      <SheetContent
        data-lenis-prevent
        className="!w-full sm:max-w-md lg:max-w-lg xl:max-w-xl gap-0"
      >
        <SheetHeader className="border-b">
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <ul className="flex flex-col gap-2 p-4">
            {data?.lines?.nodes?.map((item, i) => (
              <LineItem key={item.id} data={item} lineIndex={i} />
            ))}
          </ul>
        </ScrollArea>
        <SheetFooter className="flex-row border-t">
          {/* <div className="flex gap-2 items-center">
            <Checkbox /> <Label>All</Label>
          </div> */}
          <div className="flex gap-2 items-center flex-1 justify-end">
            <div className="flex flex-col ">
              <p className="text-lg">
                Subtotal:{" "}
                <span className="text-green-500 font-bold">
                  {formatAmount(
                    data?.cost.totalAmount.amount,
                    data?.cost.totalAmount.currencyCode as any
                  )}
                </span>
              </p>
            </div>
            {data?.checkoutUrl && (
              <Button disabled={!data.checkoutUrl} asChild>
                <Link href={data.checkoutUrl} target="_blank">
                  Checkout
                </Link>
              </Button>
            )}
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type LineItemProps = Omit<React.ComponentProps<"li">, "children"> & {
  data: NonNullable<
    NonNullable<GetCartQuery["cart"]>["lines"]["nodes"][number]
  >;
  lineIndex: number;
};

const LineItem = ({ data, lineIndex, className, ...props }: LineItemProps) => {
  const { data: cache } = useGetCartQuery();
  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const isPending = isAdding || isRemoving || isUpdating;

  const handleAddProduct = () => {
    const item = cache?.lines.nodes[lineIndex];
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !item) return;
    addProduct({
      cartId,
      lines: [
        {
          attributes: item.attributes
            .filter((att) => !!att.value)
            .map((att) => ({
              key: att.key,
              value: att.value!,
            })),
          quantity: 1,
          merchandiseId: item.merchandise.id,
          sellingPlanId: null,
          parent: null,
        },
      ],
    });
  };

  const handleRemoveProduct = () => {
    const item = cache?.lines.nodes[lineIndex];
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !item) return;

    if (item.quantity === 1) {
      removeProduct({
        cartId,
        lineIds: [item.id],
      });
    } else {
      updateLines({
        cartId,
        lines: [
          // @ts-expect-error: Ignored keys can cause issue
          {
            id: item.id,
            quantity: item.quantity - 1,
          },
        ],
      });
    }
  };

  const removeItem = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId) return;
    removeProduct({
      cartId,
      lineIds: [data.id],
    });
  };

  const handleSampleChange = (value: string) => {
    const item = cache?.lines.nodes[lineIndex];
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !item) return;

    const attributes = item.attributes
      .filter((att) => !!att.value)
      .map((att) => {
        if (att.key === PRODUCT_SAMPLES.key) {
          return {
            key: att.key,
            value,
          };
        } else {
          return {
            key: att.key,
            value: att.value!,
          };
        }
      });

    updateLines({
      cartId,
      lines: [
        {
          id: item.id,
          quantity: item.quantity,
          merchandiseId: item.merchandise.id,
          sellingPlanId: null,
          attributes: attributes.length
            ? attributes
            : [
                {
                  key: PRODUCT_SAMPLES.key,
                  value,
                },
              ],
        },
      ],
    });
  };

  return (
    <li className={cn("flex flex-col border", className)} {...props}>
      {/* <Checkbox /> */}
      <div className="flex gap-3  p-2 flex-1">
        <figure className="w-20 aspect-square rounded bg-muted">
          <Image
            src={data.merchandise.image?.url || IMAGE_PLACEHOLDER}
            alt={data.merchandise.product.title || "Product Image"}
            width={100}
            height={100}
            className="w-full h-full object-cover"
          />
        </figure>

        <div className="flex flex-col flex-1 relative">
          <div className="flex flex-col ">
            <p className="font-semibold text-lg truncate leading-none mb-1">
              {data.merchandise.product.title}
            </p>
            <span className="text-muted-foreground leading-none mb-2 ">
              {data.merchandise.product.productType}
            </span>
          </div>

          <div className="flex gap-2 items-center">
            <ButtonGroup orientation="horizontal">
              <Button
                size="icon"
                variant="outline"
                aria-label="increase quantity"
                disabled={isPending}
                onClick={handleRemoveProduct}
              >
                {isPending ? <Spinner /> : <MinusIcon />}
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="quantity"
                aria-readonly
              >
                {data.quantity}
              </Button>
              <Button
                size="icon"
                variant="outline"
                aria-label="decrease quantity"
                disabled={isPending}
                onClick={handleAddProduct}
              >
                {isAdding ? <Spinner /> : <PlusIcon />}
              </Button>
            </ButtonGroup>

            <div className="leading-none text-sm space-y-1.5">
              {data.merchandise.selectedOptions.map((option) => (
                <p key={option.name}>
                  {option.name}: {option.value}
                </p>
              ))}
            </div>

            <p className="font-black text-xl ml-auto">
              {formatAmount(
                data.cost.totalAmount.amount,
                data.cost.totalAmount.currencyCode as any
              )}
            </p>
          </div>

          {/* remove item button */}
          <Button
            size="icon"
            variant="destructive"
            aria-label="Remove"
            disabled={isRemoving}
            onClick={removeItem}
            className="absolute top-1 right-1"
          >
            {isRemoving ? <Spinner /> : <TrashIcon />}
          </Button>
        </div>
      </div>
      <Separator />
    </li>
  );
};

type CartActionProps = Omit<React.ComponentProps<"div">, "children"> & {
  setActiveVariantIndex?: React.Dispatch<React.SetStateAction<number>>;
  data: {
    options: { values: string[]; name: string; id: string }[];
    variants: {
      id: string;
      title: string;
      price: { amount: number; currencyCode: string };
      availableForSale: boolean;
      quantityAvailable: number | null;
      currentlyNotInStock: boolean;
      quantityRule: {
        increment: number;
        maximum?: number | null;
        minimum: number;
      };
    }[];
  };
};

export function CartActions({
  className,
  data,
  setActiveVariantIndex,
  ...props
}: CartActionProps) {
  const option: Record<string, string> = {};
  data.options.forEach((op) => {
    option[op.name] = op.values[0];
  });
  const [selectedOption, setSelectedOption] =
    React.useState<Record<string, string>>(option);

  const [variantIndex, setVariantIndex] = React.useState(0);

  const { data: cache } = useGetCartQuery();

  const isAdded = cache?.lines?.nodes?.find(
    (line) => line.merchandise.id === data.variants[variantIndex].id
  );

  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const handleAddProduct = async () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || variantIndex === -1) return;
    await addProduct({
      cartId,
      lines: [
        {
          attributes: [],
          quantity: 1,
          merchandiseId: data.variants[variantIndex].id,
          sellingPlanId: null,
          parent: null,
        },
      ],
    });
  };

  const handleRemoveProduct = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !isAdded) return;

    if (isAdded?.quantity === 1) {
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

  const disabled =
    isAdding ||
    isRemoving ||
    isUpdating ||
    data.variants[variantIndex].availableForSale === false;
  const isOutOfStock =
    data.variants[variantIndex].quantityAvailable === 0 ||
    !data.variants[variantIndex].availableForSale;

  React.useEffect(() => {
    const names = data.options.map((op) => op.name);
    const title = names.map((name) => selectedOption[name]).join(" / ");

    const index = data.variants.findIndex((variant) => variant.title === title);
    if (index > -1) {
      setVariantIndex(index);
      setActiveVariantIndex?.(index);
    }
  }, [selectedOption]);

  return (
    <div
      className={cn("flex gap-2 items-center", className)}
      {...props}
      data-slot="cart-action-buttons"
    >
      {isAdded && isAdded.quantity > 0 ? (
        <ButtonGroup orientation="horizontal">
          <Button
            size="icon"
            variant="outline"
            aria-label="increase quantity"
            disabled={disabled}
            onClick={handleRemoveProduct}
          >
            {isUpdating || isRemoving ? <Spinner /> : <MinusIcon />}
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="quantity"
            aria-readonly
          >
            {isAdded.quantity}
          </Button>
          <Button
            size="icon"
            variant="outline"
            aria-label="decrease quantity"
            disabled={disabled}
            onClick={handleAddProduct}
          >
            {isAdding ? <Spinner /> : <PlusIcon />}
          </Button>
        </ButtonGroup>
      ) : data.variants.length > 1 ? (
        <VariantSelectorAlert
          handleAddQuantity={handleAddProduct}
          options={data.options}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          isOutOfStock={isOutOfStock}
          isPending={isAdding}
          price={{
            amount: data.variants[variantIndex].price.amount,
            currencyCode: data.variants[variantIndex].price.currencyCode,
          }}
        />
      ) : (
        <Button
          size="icon"
          className="ml-auto"
          onClick={handleAddProduct}
          disabled={isOutOfStock || disabled}
        >
          {isAdding ? <Spinner /> : <ShoppingCartIcon />}
        </Button>
      )}
    </div>
  );
}

function VariantSelectorAlert({
  options,
  setSelectedOption,
  selectedOption,
  isOutOfStock,
  handleAddQuantity,
  isPending,
  price,
}: {
  options: { values: string[]; name: string; id: string }[];
  selectedOption: Record<string, string>;
  setSelectedOption: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  isOutOfStock: boolean;
  handleAddQuantity: () => Promise<void>;
  isPending: boolean;
  price: {
    amount: number;
    currencyCode: string;
  };
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
            {options.map((option, i) => (
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
              {formatAmount(price.amount, price.currencyCode as any)}
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

export default CartSheet;
