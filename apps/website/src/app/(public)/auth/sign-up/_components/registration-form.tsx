"use client";
import React from "react";
import { useRegistrationForm } from "./registration-form.provider";
import { Input } from "@workspace/ui/components/input";
import { FieldGroup, Field, FieldLabel, FieldError } from "@workspace/ui/components/field";
import { Controller } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@workspace/ui/components/input-group";
import { EyeIcon, EyeOffIcon, KeyIcon, MailIcon, PhoneIcon } from "lucide-react";
import { Checkbox } from "@workspace/ui/components/checkbox";

export default function CustomerRegistrationForm() {
  const form = useRegistrationForm();

  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <FieldGroup className="">
      <FieldGroup className="grid grid-cols-2 gap-y-4 gap-x-6 w-full">
        <Controller
          name="firstName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="firstName">First Name</FieldLabel>
              <Input id="firstName" placeholder="John" required {...field} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="lastName"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
              <Input id="lastName" placeholder="Doe" required {...field} autoComplete="off" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...field}
                  required
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <MailIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="phone"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel htmlFor="phone">
                Phone <span className="text-muted-foreground">(optional)</span>
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  type="tel"
                  id="phone"
                  placeholder="Enter your phone number"
                  {...field}
                  required
                  autoComplete="off"
                />
                <InputGroupAddon>
                  <PhoneIcon />
                </InputGroupAddon>
              </InputGroup>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="password"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  {...field}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller
          name="confirmPassword"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password again"
                  {...field}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="acceptsMarketing"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field className="col-span-2">
              <FieldLabel className="flex flex-row gap-2 items-center">
                <Checkbox
                  checked={field.value}
                  name={field.name}
                  onCheckedChange={field.onChange}
                />
                Accepts Marketing
              </FieldLabel>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </FieldGroup>
    </FieldGroup>
  );
}
