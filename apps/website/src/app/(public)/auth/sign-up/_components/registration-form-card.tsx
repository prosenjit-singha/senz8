"use client";
import React from "react";
import { useRegistrationForm } from "./registration-form.provider";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import CustomerRegistrationForm from "./registration-form";
import RegistrationFormAction from "./registration-form-action";
import { signup } from "@/lib/auth/customer-auth.action";
import { toast } from "sonner";
import Link from "next/link";
import { AUTH_ROUTES_OBJ } from "@/lib/auth/auth.const";

export default function SignUpFormCard() {
  const form = useRegistrationForm();
  const [state, action] = React.useActionState(signup, undefined);

  React.useEffect(() => {
    if (state?.errors) {
      Object.entries(state.errors).forEach(([key, err]) => {
        form.setError(key as any, {
          type: "manual",
          message: err.map((msg) => msg).join(", "),
        });
      });
    } else {
      form.clearErrors();
    }
  }, [state?.errors]);

  React.useEffect(() => {
    if (state?.message) {
      toast.error(state.message);
    }
  }, [state?.message]);

  return (
    <form action={action} id="customer-signup-form" className="max-w-lg w-full">
      <Card className="">
        <CardHeader>
          <CardTitle>Register</CardTitle>
          <CardDescription>Register to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <CustomerRegistrationForm />
        </CardContent>

        <CardFooter className="flex flex-col gap-4">
          <RegistrationFormAction />
          <p>
            Already have an account?{" "}
            <Link
              href={AUTH_ROUTES_OBJ.signIn!}
              className="text-primary hover:underline cursor-pointer"
            >
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
    </form>
  );
}
