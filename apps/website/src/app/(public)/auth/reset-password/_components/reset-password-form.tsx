"use client";

import React from "react";
import { Button } from "@workspace/ui/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import z from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import { cn } from "@workspace/ui/lib/utils";
import { EyeIcon, EyeOffIcon, KeyIcon, SendIcon } from "lucide-react";
import {
  useResetPassword,
  useSendRecoveryEmail,
} from "@/hooks/api/shopify-customer.hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@workspace/ui/components/spinner";
import { zCustomerSignUpSchema } from "@/zod-schemas/shopify/customer.z";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";

type AccountRecoverFormProps = Omit<
  React.ComponentProps<typeof Card>,
  "children"
>;

const schema = zCustomerSignUpSchema.pick({
  password: true,
  confirmPassword: true,
});

function ResetPasswordForm({ className, ...props }: AccountRecoverFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutateAsync: sendRecoveryEmail, isPending } = useResetPassword();

  const handleSubmit = form.handleSubmit((data) => {
    // toast.promise(sendRecoveryEmail(data.email), {
    //   loading: "Sending recovery email...",
    //   success: () => {
    //     router.push("/auth/reset-password");
    //     return "Recovery email sent successfully!";
    //   },
    //   error: "Failed to send recovery email.",
    // });
  });

  return (
    <Card
      className={cn("w-full", className)}
      {...props}
      data-slot="account-recover-form"
    >
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>
          Enter your password to reset your password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form className="flex flex-col gap-4">
          <Controller
            name="password"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  htmlFor={field.name}
                  data-invalid={fieldState.invalid}
                >
                  Password
                </FieldLabel>
                <InputGroup aria-invalid={fieldState.invalid}>
                  <InputGroupInput
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    required
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
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
                {fieldState.error && (
                  <FieldError
                    errors={[{ message: fieldState.error.message }]}
                  />
                )}
              </Field>
            )}
          />
          <Controller
            name="confirmPassword"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel
                  htmlFor={field.name}
                  data-invalid={fieldState.invalid}
                >
                  Confirm Password
                </FieldLabel>
                <InputGroup aria-invalid={fieldState.invalid}>
                  <InputGroupInput
                    id={field.name}
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter your password"
                    {...field}
                    required
                    autoComplete="off"
                    aria-invalid={fieldState.invalid}
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
                {fieldState.error && (
                  <FieldError
                    errors={[{ message: fieldState.error.message }]}
                  />
                )}
              </Field>
            )}
          />
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="flex-1"
          onClick={handleSubmit}
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Spinner />
              Sending password reset link
            </>
          ) : (
            <>
              <SendIcon />
              Send Reset Password Link
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}

export default ResetPasswordForm;
