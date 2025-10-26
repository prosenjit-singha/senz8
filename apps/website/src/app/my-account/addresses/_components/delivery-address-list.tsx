"use client";
import React from "react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@workspace/ui/components/item";
import { MapPinHouseIcon } from "lucide-react";
import { Badge } from "@workspace/ui/components/badge";
import { cn } from "@workspace/ui/lib/utils";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@workspace/ui/components/empty";
import { useGetMyAccountDetailsQuery } from "@/hooks/api/shopify-customer.hooks";
import { Spinner } from "@workspace/ui/components/spinner";
import { useCustomerAddressForm } from "./default-address-form.provider";
type AddressListProps = Omit<React.ComponentProps<"ul">, "children">;

export default function CustomerDeliveryAddressList({
  className,
  ...props
}: AddressListProps) {
  const form = useCustomerAddressForm();
  const { data, isLoading } = useGetMyAccountDetailsQuery();

  React.useEffect(() => {
    const { id } = form.getValues();
    if (data?.defaultAddress && !id) {
      form.reset({
        id: data.defaultAddress.id,
        firstName: data.defaultAddress.firstName ?? "",
        lastName: data.defaultAddress.lastName ?? "",
        company: data.defaultAddress.company ?? "",
        address1: data.defaultAddress.address1 ?? "",
        address2: data.defaultAddress.address2 ?? "",
        city: data.defaultAddress.city ?? "",
        country: data.defaultAddress.country ?? "",
        phone: data.defaultAddress.phone ?? "",
        province: data.defaultAddress.province ?? "",
        zip: data.defaultAddress.zip ?? "",
      });
    }
  }, [data]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex flex-col gap-4 justify-center items-center text-muted-foreground lg:min-w-sm xl:min-w-md 2xl:min-w-lg">
        <Spinner className="size-10" />
        <i className="animate-pulse text-sm">Loading...</i>
      </div>
    );
  }

  if (!data?.addresses.nodes.length) {
    return (
      <Empty className="h-full border lg:min-w-sm xl:min-w-md 2xl:min-w-lg">
        <EmptyHeader>
          <EmptyMedia variant="icon" className="size-15 rounded-full">
            <MapPinHouseIcon />
          </EmptyMedia>
          <EmptyTitle className="text-yellow-500">
            No Delivery Address Yet
          </EmptyTitle>
          <EmptyDescription>
            You haven&apos;t created any delivery address yet. Get started by
            creating your first delivery address.
          </EmptyDescription>
        </EmptyHeader>
        {/* <EmptyContent>
        <div className="flex gap-2">
          <Button>Create Project</Button>
          <Button variant="outline">Import Project</Button>
        </div>
      </EmptyContent> */}
      </Empty>
    );
  }

  return (
    <ul
      className={cn("flex flex-col gap-2 lg:w-sm xl:w-md 2xl:w-lg", className)}
      {...props}
    >
      {data?.addresses.nodes.map((address) => (
        <li
          className=""
          key={address.id}
          role="button"
          onClick={() =>
            form.reset({
              id: address.id,
              firstName: address.firstName ?? "",
              lastName: address.lastName ?? "",
              company: address.company ?? "",
              address1: address.address1 ?? "",
              address2: address.address2 ?? "",
              city: address.city ?? "",
              country: address.country ?? "",
              phone: address.phone ?? "",
              province: address.province ?? "",
              zip: address.zip ?? "",
            })
          }
        >
          <Item
            variant="outline"
            className="cursor-pointer hover:border-primary"
          >
            <ItemContent>
              <ItemTitle className="font-normal text-base line-clamp-1 leading-none">
                {address.formatted.join(", ")}
              </ItemTitle>
              <ItemDescription className="font-normal text-base">
                {address.firstName} {address.lastName}
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              {data?.defaultAddress?.id === address.id && (
                <Badge variant="default">default</Badge>
              )}
              {/* <ChevronRightIcon className="size-4" /> */}
            </ItemActions>
          </Item>
        </li>
      ))}
    </ul>
  );
}
