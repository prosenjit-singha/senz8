"use client";
import { zShopifyCustomerAddress } from "@/zod-schemas/shopify/customer-default-address.z";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import z from "zod";

type Value = z.infer<typeof zShopifyCustomerAddress>;

export function DefaultAddressFormProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  const form = useForm({
    defaultValues: {
      address1: "",
      address2: "",
      city: "",
      country: "",
      firstName: "",
      lastName: "",
      phone: "",
      province: "",
      zip: "",
      company: "",
    },
    resolver: zodResolver(zShopifyCustomerAddress),
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export const useCustomerAddressForm = () => useFormContext<Value>();
