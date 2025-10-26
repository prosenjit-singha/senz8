"use client";
import React from "react";
import LogoutClientButton from "@/components/shared/logout-client-button";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup } from "@workspace/ui/components/button-group";
import Link from "next/link";
import { cn } from "@workspace/ui/lib/utils";
import { usePathname } from "next/navigation";

type MyAccountNavigationProps = Omit<React.ComponentProps<"div">, "children">;

const links = [
  { href: "/my-account/details", label: "Account Details" },
  { href: "/my-account/addresses", label: "Addresses" },
  { href: "/my-account/orders", label: "Orders" },
];

export default function MyAccountNavigation({
  className,
  ...props
}: MyAccountNavigationProps) {
  const pathname = usePathname();
  return (
    <div className={cn("flex gap-4 justify-between", className)} {...props}>
      <ButtonGroup className="grid grid-cols-3 w-fit">
        {links.map((link) => (
          <Button
            key={link.href}
            variant={pathname === link.href ? "default" : "outline"}
            data-active={pathname.startsWith(link.href)}
            className="data-[active=true]:bg-primary data-[active=true]:text-white"
            asChild
          >
            <Link href={link.href}>{link.label}</Link>
          </Button>
        ))}
      </ButtonGroup>
      <Button variant="destructive" asChild>
        <LogoutClientButton />
      </Button>
    </div>
  );
}
