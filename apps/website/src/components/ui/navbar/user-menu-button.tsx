"use client";
import React from "react";
import { useSession } from "@/components/providers/session.provider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@workspace/ui/components/avatar";
import { LogOutIcon, LogsIcon, SettingsIcon, UserRoundIcon } from "lucide-react";
import { Skeleton } from "@workspace/ui/components/skeleton";

export default function UserMenuButton() {
  const { data: session, status, update } = useSession();
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
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <UserRoundIcon /> Profile
          </DropdownMenuItem>
          <DropdownMenuItem>
            <SettingsIcon /> Settings
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogsIcon /> Orders
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => update(null)}>
            <LogOutIcon /> Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  } else return null;
}
