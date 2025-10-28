"use client";
import React from "react";
import { Card } from "@workspace/ui/components/card";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
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
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { EyeIcon, EyeOffIcon, KeyIcon, SaveIcon } from "lucide-react";
import { zCustomerSignUpSchema } from "@/zod-schemas/shopify/customer.z";
import { useUpdateMyAccountDetailsMutation } from "@/hooks/api/shopify-customer.hooks";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";

const schema = zCustomerSignUpSchema.pick({
  password: true,
  confirmPassword: true,
});

type FormValues = z.infer<typeof schema>;

export function CustomerPasswordForm() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { mutateAsync: updateDetails } = useUpdateMyAccountDetailsMutation();

  const form = useForm<FormValues>({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    // zod version mismatch. using any to resolve typescript error
    resolver: zodResolver(schema as any),
  });

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSave = form.handleSubmit(async (data) => {
    setIsSubmitting(true);
    // @ts-expect-error: only password field is provided
    toast.promise(updateDetails({ password: data.password }), {
      loading: "Updating password...",
      success: "Password updated successfully",
      error: "Failed to update password",
      finally: () => setIsSubmitting(false),
    });
  });

  return (
    <Card className="px-6">
      <form onSubmit={handleSave}>
        <FieldSet>
          <div className="flex gap-4 items-center justify-between">
            <div>
              <FieldLegend>Password</FieldLegend>
              <FieldDescription>
                Update password to secure your account
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
                      <SaveIcon /> Update Password
                    </>
                  )}
                </Button>
              )}
          </div>

          <FieldGroup className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
            <Controller
              name="password"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      {...field}
                      required
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <KeyIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton
                        size="icon-xs"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="confirmPassword"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field className="" data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="confirmPassword">
                    Confirm Password
                  </FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password again"
                      {...field}
                      required
                      aria-invalid={fieldState.invalid}
                      autoComplete="off"
                    />
                    <InputGroupAddon>
                      <KeyIcon />
                    </InputGroupAddon>
                    <InputGroupAddon align={"inline-end"}>
                      <InputGroupButton
                        size="icon-xs"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? <EyeIcon /> : <EyeOffIcon />}
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Button
              disabled={isSubmitting || !form.formState.isValid}
              className="min-w-[180px] sm:hidden w-full"
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Saving...
                </>
              ) : (
                <>
                  <SaveIcon /> Update Password
                </>
              )}
            </Button>
          </FieldGroup>
        </FieldSet>
      </form>
    </Card>
  );
}
