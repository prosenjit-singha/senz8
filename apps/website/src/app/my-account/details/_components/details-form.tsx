"use client";
import React from "react";
import { Card } from "@workspace/ui/components/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z, { ZodObject } from "zod";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { MailIcon, PhoneIcon, SaveIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiSuccessResponse } from "@/interfaces";
import { GetCustomerQuery } from "@/graphql";
import { toast } from "sonner";
import { useUpdateMyAccountDetailsMutation } from "@/hooks/api/shopify-customer.hooks";
import { Checkbox } from "@workspace/ui/components/checkbox";
import { Spinner } from "@workspace/ui/components/spinner";

const schema = z.object({
  firstName: z.string().min(2, "First name is required").max(255),
  lastName: z.string().max(255).optional(),
  email: z.email(),
  phone: z.string().optional(),
  acceptsMarketing: z.boolean().optional(),
});

export function CustomerDetailsForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutateAsync: updateDetails } = useUpdateMyAccountDetailsMutation();
  const form = useForm({
    defaultValues: () =>
      shopifyAPI
        .get<
          IApiSuccessResponse<GetCustomerQuery["customer"]>
        >("/customers/me", { next: { tags: ["my-account-details"] } })
        .then((res) => res.data),
    // @ts-expect-error defaultValues return and schema type mismatch
    resolver: zodResolver(schema),
  });

  const handleSave = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    // @ts-expect-error password is not required
    toast.promise(updateDetails(data), {
      loading: "Saving...",
      success: "Saved successfully",
      error: "Failed to save",
      finally: () => setIsSubmitting(false),
    });
  });

  return (
    <Card className="px-6">
      <form onSubmit={handleSave}>
        <FieldSet>
          <div className="flex gap-4 items-center justify-between">
            <div>
              <FieldLegend>Basic Information</FieldLegend>
              <FieldDescription>
                Please fill in your basic information
              </FieldDescription>
            </div>

            {Object.keys(form.formState.touchedFields).length > 0 &&
              form.formState.isValid && (
                <Button
                  disabled={isSubmitting}
                  size="lg"
                  className="min-w-[180px]"
                  type="submit"
                >
                  {isSubmitting ? (
                    <>
                      <Spinner /> Saving...
                    </>
                  ) : (
                    <>
                      <SaveIcon /> Save Changes
                    </>
                  )}
                </Button>
              )}
          </div>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Controller
              name="firstName"
              control={form.control}
              disabled={form.formState.isLoading}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor={field.name}>First Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="John"
                    required
                    aria-invalid={!!fieldState.error}
                    {...field}
                    value={field.value || ""}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="lastName"
              control={form.control}
              disabled={form.formState.isLoading}
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor={field.name}>Last Name</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="Doe"
                    required
                    aria-invalid={!!fieldState.error}
                    {...field}
                    value={field.value || ""}
                  />
                  {fieldState.error && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="email"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="" data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                      aria-invalid={!!fieldState.error}
                      autoComplete="off"
                      {...field}
                      readOnly
                      value={field.value || ""}
                    />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="phone"
              control={form.control}
              disabled={form.formState.isLoading}
              render={({ field, fieldState }) => (
                <Field className="" data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="phone">
                    Phone{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="tel"
                      id="phone"
                      placeholder="Enter your phone number"
                      {...field}
                      required
                      aria-invalid={!!fieldState.error}
                      autoComplete="off"
                      value={field.value || ""}
                    />
                    <InputGroupAddon>
                      <PhoneIcon />
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="acceptsMarketing"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="sm:col-span-2">
                  <FieldLabel className="flex flex-row gap-2 items-center w-fit">
                    <Checkbox
                      checked={field.value}
                      name={field.name}
                      onCheckedChange={field.onChange}
                    />
                    Accepts Marketing
                  </FieldLabel>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Button
              disabled={
                form.formState.isLoading ||
                isSubmitting ||
                !form.formState.isValid ||
                Object.keys(form.formState.touchedFields).length === 0
              }
              size="lg"
              className="min-w-[180px] sm:hidden w-full"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon /> Save Changes
                </>
              )}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </Card>
  );
}
