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
import { EyeIcon, EyeOffIcon, KeyIcon, LogInIcon } from "lucide-react";
import { Button } from "@workspace/ui/components/button";
import { Spinner } from "@workspace/ui/components/spinner";
import { useSession } from "@/components/providers/session.provider";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/auth/auth.const";
import Link from "next/link";

type LoginFormProps = Omit<React.ComponentProps<"div">, "children">;

export default function LoginForm({ className, ...props }: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false);
  const formRef = React.useRef<HTMLFormElement>(null);
  const [state, action, pending] = React.useActionState(login, undefined);
  const { update, data: session } = useSession();
  const searchParams = useSearchParams();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  React.useEffect(() => {
    if (state?.session && !session) {
      update(state.session);
      const redirectURL =
        searchParams.get("callbackUrl") || DEFAULT_LOGIN_REDIRECT;
      if (redirectURL) {
        router.replace(decodeURIComponent(redirectURL));
      }
    }
  }, [state?.session, session]);

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
        <CardDescription>Sign in to your account</CardDescription>
      </CardHeader>
      <CardContent>
        <form
          data-slot="login-form"
          ref={formRef}
          action={action}
          className="flex flex-col gap-4"
        >
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              placeholder="Enter your email address"
              type="email"
              name="email"
              required
            />
            {state?.errors?.email && (
              <FieldError errors={[{ message: state.errors.email[0] }]} />
            )}
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
              <InputGroupButton
                size="icon-xs"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <EyeIcon /> : <EyeOffIcon />}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
          {state?.errors?.password && (
            <FieldError errors={[{ message: state.errors.password[0] }]} />
          )}

          <button type="button" className="text-xs text-left text-primary">
            Forgot Password?
          </button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <Button
          type="submit"
          disabled={pending}
          onClick={() => formRef.current?.requestSubmit()}
          className="w-full"
        >
          {pending ? <Spinner /> : <LogInIcon />}
          {pending ? "Signing in..." : "Sign In"}
        </Button>
        <p>
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
