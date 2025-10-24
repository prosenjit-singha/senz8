import React from "react";
import LoginForm from "./_components/login-form";

function LoginPage() {
  return (
    <main className="min-h-screen mx-page-margin-auto py-page-margin flex flex-col items-center justify-center">
      <LoginForm className="max-w-lg" />
    </main>
  );
}

export default LoginPage;
