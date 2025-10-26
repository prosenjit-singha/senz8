"use client";
import { CustomerDetailsForm } from "./_components/details-form";
import { CustomerPasswordForm } from "./_components/password-form";

function ProfileSettingPage() {
  return (
    <div className="flex flex-col gap-8">
      <CustomerDetailsForm />
      <CustomerPasswordForm />
    </div>
  );
}

export default ProfileSettingPage;
