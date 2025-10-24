import React from "react";
import { RegistrationFormProvider } from "./_components/registration-form.provider";
import SignUpFormCard from "./_components/registraction-form-card";

export default function RegistrationPage() {
  return (
    <main className="min-h-screen mx-page-margin py-page-margin flex flex-col items-center justify-center">
      <RegistrationFormProvider>
        <SignUpFormCard />
      </RegistrationFormProvider>
    </main>
  );
}
