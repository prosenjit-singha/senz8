import React from "react";
import AccountRecoverForm from "./_components/recover-form";

export default function RecoverPassword() {
  return (
    <main className="min-h-screen mx-page-margin-auto py-page-margin flex flex-col items-center justify-center">
      <AccountRecoverForm className="max-w-lg" />
    </main>
  );
}
