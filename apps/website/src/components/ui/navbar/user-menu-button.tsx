"use client";
import React from "react";
import { useSession } from "@/components/providers/session.provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@workspace/ui/components/avatar";
import {
  LogOutIcon,
  LogsIcon,
  SettingsIcon,
  UserRoundIcon,
} from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";
import Link from "next/link";

export default function UserMenuButton() {
  const { status, update } = useSession();

  if (status === "uninitialized" || status === "loading")
    return <Skeleton className="w-8 h-8 rounded-full" />;
  else if (status === "success") {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@pj" />
            <AvatarFallback>PJ</AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[150px]" align="end">
          <DropdownMenuItem asChild>
            <Link href="/my-account/details">
              <UserRoundIcon /> Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-account/addresses">
              <SettingsIcon /> Addresses
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/my-account/orders">
              <LogsIcon /> Orders
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => update(null)}>
            <LogOutIcon /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else return null;
}
