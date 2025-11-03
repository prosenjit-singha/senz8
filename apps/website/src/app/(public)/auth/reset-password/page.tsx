import React from "react";
import ResetPasswordForm from "./_components/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen mx-page-margin-auto py-page-margin flex flex-col items-center justify-center">
      <ResetPasswordForm className="max-w-lg" />
    </main>
  );
}
