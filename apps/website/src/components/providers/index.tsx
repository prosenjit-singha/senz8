"use client";

import React from "react";
import ReactQueryProvider from "./react-query.provider";
import { Toaster } from "sonner";
import Navbar from "../ui/navbar";
import PublicPageFooter from "../ui/footer";
import CartSheet from "../shared/cart-sheet";
import { SessionProvider } from "./session.provider";

export function Providers({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <>
      <Toaster />
      <ReactQueryProvider>
        <SessionProvider>
          <Navbar />
          {children}
          <PublicPageFooter />
          <CartSheet />
        </SessionProvider>
      </ReactQueryProvider>
    </>
  );
}
