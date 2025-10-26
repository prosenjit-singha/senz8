"use client";

import { useSession } from "@/components/providers/session.provider";
import { cn } from "@workspace/ui/lib/utils";
import { LogOutIcon } from "lucide-react";

type LogoutClientButtonProps = React.ComponentProps<"button">;

export default function LogoutClientButton({
  className,
  ...props
}: LogoutClientButtonProps) {
  const { status, update } = useSession();

  if (status === "uninitialized" || status === "loading") return null;
  else if (status === "success") {
    return (
      <button
        onClick={() => update(null)}
        className={cn("flex gap-2 px-3 py-1 rounded-md", className)}
        aria-label="Logout"
        {...props}
      >
        <LogOutIcon /> Logout
      </button>
    );
  } else return null;
}
