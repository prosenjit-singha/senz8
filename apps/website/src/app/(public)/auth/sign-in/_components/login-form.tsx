"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@workspace/ui/components/card";
import { cn } from "@workspace/ui/lib/utils";
import { login } from "@/lib/auth/customer-auth.action";
import { Field, FieldError, FieldLabel } from "@workspace/ui/components/field";
import { Input } from "@workspace/ui/components/input";
import {
  InputGroup,
  InputGroupInput,
  InputGroupAddon,
  InputGroupButton,
} from "@workspace/ui/components/input-group";
import { EyeIcon, EyeOffIcon, KeyIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";

type LoginFormProps = Omit<React.ComponentProps<"div">, "children">;

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action, pending] = React.useActionState(login, undefined);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form data-slot="login-form" ref={formRef} action={action} className="flex flex-col gap-4">
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" placeholder="Evil Rabbit" type="email" name="email" required />
            {state?.errors?.email && <FieldError errors={[{ message: state.errors.email[0] }]} />}
          </Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <InputGroup>
            <InputGroupInput
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              required
              autoComplete="off"
            />
            <InputGroupAddon>
              <KeyIcon />
            </InputGroupAddon>
            <InputGroupAddon align={"inline-end"}>
              <InputGroupButton size="icon-xs" onClick={togglePasswordVisibility}>
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {state?.errors?.password && (
            <FieldError errors={[{ message: state.errors.password[0] }]} />
          )}
        </form>
      </CardContent>
      <CardFooter>
        <Button type="submit" disabled={pending} onClick={() => formRef.current?.requestSubmit()}>
          {pending && <Spinner />}
          {pending ? "Signing in..." : "Sign In"}
        </Button>
      </CardFooter>
    </Card>
  );
}
