"use client";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet";
import { useCartStore } from "@/stores/cart.store";
import { ScrollArea } from "@workspace/ui/components/scroll-area";
import { Button } from "@workspace/ui/components/button";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import { formatAmount } from "@/helpers/currency.helper";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Label } from "@workspace/ui/components/label";
function CartSheet() {
  const { state, actions } = useCartStore();
  return (
    <Sheet open={state.isOpen} onOpenChange={actions.setOpenState}>
      <SheetContent className="sm:max-w-md lg:max-w-lg xl:max-w-xl gap-0">
        <SheetHeader className="border-b">
          <SheetTitle>My Cart</SheetTitle>
          <SheetDescription></SheetDescription>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <ul className="flex flex-col gap-2 p-4">
            {state.data?.lines?.map((item, i) => (
              <li key={i} className="flex gap-4 items-center">
                <Checkbox />
                <div className="flex gap-3 border rounded-md p-2 flex-1">
                  <figure className="w-20 aspect-square rounded bg-muted"></figure>

                  <div className="flex flex-col ">
                    <p className="font-semibold text-lg truncate">Test</p>
                    <span className="text-muted-foreground">variant</span>
                    <b className="font-black">{formatAmount(1000, "INR")}</b>
                  </div>

                  <div className="flex flex-col gap-2 ml-auto items-end">
                    <Button
                      size="icon"
                      variant="destructive"
                      aria-label="Remove"
                    >
                      <TrashIcon />
                    </Button>
                    <ButtonGroup orientation="horizontal">
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="increase quantity"
                      >
                        <MinusIcon />
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="quantity"
                        aria-readonly
                      >
                        1
                      </Button>
                      <Button
                        size="icon"
                        variant="outline"
                        aria-label="decrease quantity"
                      >
                        <PlusIcon />
                      </Button>
                    </ButtonGroup>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
        <SheetFooter className="flex-row border-t">
          <div className="flex gap-2 items-center">
            <Checkbox /> <Label>All</Label>
          </div>
          <div className="flex gap-2 items-center flex-1 justify-end">
            <div className="flex flex-col ">
              <b>Subtotal: {formatAmount(1000, "INR")}</b>
            </div>
            <Button>Checkout</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default CartSheet;
