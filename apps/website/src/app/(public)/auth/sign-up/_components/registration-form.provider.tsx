"use client";

import React from "react";
import { useForm, useFormContext, FormProvider } from "react-hook-form";
import {
  CustomerSignUpBody,
  zCustomerSignUpSchema,
} from "@/zod-schemas/shopify/customer.z";
import { zodResolver } from "@hookform/resolvers/zod";

const defaultValues: CustomerSignUpBody = {
  email: "aheibamprosenjit@gmail.com",
  firstName: "Prosenjit",
  lastName: "Singha",
  phone: "+8801763943389",
  password: "1P@ssword",
  confirmPassword: "1P@ssword",
  acceptsMarketing: true,
};

interface RegistrationFormProviderProps {
  children: React.ReactNode | React.ReactNode[];
}

export function RegistrationFormProvider({
  children,
}: RegistrationFormProviderProps) {
  const form = useForm({
    defaultValues,
    // incompatible zod version to resolve typescript warning
    resolver: zodResolver(zCustomerSignUpSchema as any),
  });
  return <FormProvider {...form}>{children}</FormProvider>;
}

export const useRegistrationForm = () => useFormContext<CustomerSignUpBody>();
