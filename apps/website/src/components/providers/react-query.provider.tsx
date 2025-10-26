"use client";
import React from "react";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider,
  QueryKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

declare module "@tanstack/react-query" {
  interface Register {
    mutationMeta: {
      invalidateQueries?: QueryKey;
      successMessage?: string;
      errorMessage?: string;
    };
  }
}

const queryClient = new QueryClient({
  mutationCache: new MutationCache({
    onSuccess: (_data, _variables, _ctx, mutation) => {
      if (mutation.meta?.successMessage) {
        toast.success(mutation.meta.successMessage);
      }
    },
    onError: (error, _variables, _context, mutation) => {
      if ((error as any)?.status === 401) {
        // perform logout
        localStorage.removeItem("access-token"); // or whatever you store
        window.location.href = "/auth/login"; // or navigate with router
      }
      if (mutation.meta?.errorMessage) {
        toast.error(mutation.meta.errorMessage);
      }
    },
    onSettled: (_data, _errors, _variables, _context, mutation) => {
      if (mutation.meta?.invalidateQueries) {
        queryClient.invalidateQueries({
          queryKey: mutation.meta.invalidateQueries,
        });
      }
    },
  }),
});

export default function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode | React.ReactNode[];
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
