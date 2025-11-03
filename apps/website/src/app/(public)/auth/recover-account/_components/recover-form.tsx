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
import { SendIcon } from "lucide-react";
import { useSendRecoveryEmail } from "@/hooks/api/shopify-customer.hooks";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "@workspace/ui/components/spinner";

type AccountRecoverFormProps = Omit<
  React.ComponentProps<typeof Card>,
  "children"
>;

const schema = z.object({
  email: z.email(),
});

function AccountRecoverForm({ className, ...props }: AccountRecoverFormProps) {
  const router = useRouter();
  const form = useForm({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(schema),
  });

  const { mutateAsync: sendRecoveryEmail, isPending } = useSendRecoveryEmail();

  const handleSubmit = form.handleSubmit((data) => {
    toast.promise(sendRecoveryEmail(data.email), {
      loading: "Sending recovery email...",
      success: () => {
        router.push("/auth/reset-password");
        return "Recovery email sent successfully!";
      },
      error: "Failed to send recovery email.",
    });
  });

  return (
    <Card
      className={cn("w-full", className)}
      {...props}
      data-slot="account-recover-form"
    >
      <CardHeader>
        <CardTitle>Recover Account</CardTitle>
        <CardDescription>
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <Controller
            name="email"
            control={form.control}
            disabled={isPending}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  placeholder="Enter your email address"
                  type="email"
                  required
                  {...field}
                />
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

export default AccountRecoverForm;
