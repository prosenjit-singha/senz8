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
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
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
  data: {
    merchandiseId: string;
    currentItemQuantity: number;
    lineId?: string;
  };
  disabled?: boolean;
};

export function CartActions({ className, data, ...props }: CartActionProps) {
  const { data: cache } = useGetCartQuery();
  const { mutateAsync: addProduct, isPending: isAdding } = useCartLinesAdd();
  const { mutateAsync: removeProduct, isPending: isRemoving } =
    useCartLinesRemove();
  const { mutateAsync: updateLines, isPending: isUpdating } =
    useCartLinesUpdate();

  const handleAddProduct = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !data.merchandiseId) return;
    addProduct({
      cartId,
      lines: [
        {
          attributes: [],
          quantity: 1,
          merchandiseId: data.merchandiseId,
          sellingPlanId: null,
          parent: null,
        },
      ],
    });
  };

  const handleRemoveProduct = () => {
    const cartId = localStorage.getItem("cartId")!;
    if (!cartId || !data.lineId) return;

    if (data.currentItemQuantity === 1) {
      removeProduct({
        cartId,
        lineIds: [data.lineId],
      });
    } else {
      updateLines({
        cartId,
        lines: [
          // @ts-expect-error: Ignored keys can cause issue
          {
            id: data.merchandiseId,
            quantity: data.currentItemQuantity - 1,
          },
        ],
      });
    }
  };

  return (
    <div
      className={cn("flex gap-2 items-center", className)}
      {...props}
      data-slot="cart-action-buttons"
    ></div>
  );
}

export default CartSheet;
