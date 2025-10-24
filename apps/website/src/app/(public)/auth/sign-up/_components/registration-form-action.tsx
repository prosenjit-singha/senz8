"use client";
import React from "react";
import { useRegistrationForm } from "./registration-form.provider";
import { Button } from "@workspace/ui/components/button";
import { LogInIcon } from "lucide-react";
import { useFormStatus } from "react-dom";
import { Spinner } from "@workspace/ui/components/spinner";

function RegistrationFormAction() {
  const form = useRegistrationForm();
  const { pending } = useFormStatus();

  const handleSubmit = form.handleSubmit(() => {
    const form = document.getElementById("customer-signup-form");
    if (form) {
      (form as HTMLFormElement).requestSubmit();
    }
  });

  return (
    <Button className="w-full" onClick={handleSubmit} disabled={pending}>
      {pending ? <Spinner /> : <LogInIcon />}
      {pending ? "Signing up..." : "Sign up"}
    </Button>
  );
}

export default RegistrationFormAction;
