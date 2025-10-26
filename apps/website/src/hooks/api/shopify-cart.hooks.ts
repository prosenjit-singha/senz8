"use client";

import React from "react";
import {
  CartLinesAddMutation,
  CartLinesAddMutationVariables,
  CartLinesRemoveMutation,
  CartLinesRemoveMutationVariables,
  CartLinesUpdateMutation,
  CartLinesUpdateMutationVariables,
  GetCartQuery,
} from "@/graphql";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const cartQueryKey = {
  all: ["shopify-cart"],
  getCart: (cartId?: string) => [...cartQueryKey.all, cartId],
  updateLines: ["update-cart-lines"],
  removeLines: ["remove-cart-lines"],
  addLines: ["add-cart-lines"],
};

export const useGetCartQuery = () => {
  const [enabled, setEnabled] = React.useState(false);
  const [cartId, setCartId] = React.useState<string | undefined>(undefined);
  React.useEffect(() => {
    const cartId = localStorage.getItem("cartId") ?? undefined;
    setCartId(cartId);
    setEnabled(true);
  }, []);

  return useQuery<GetCartQuery["cart"], IApiFailedResponse>({
    queryKey: cartQueryKey.getCart(),
    queryFn: async () => {
      return shopifyAPI
        .get<
          IApiSuccessResponse<GetCartQuery["cart"]>
        >(`/cart${cartId ? `?cartId=${cartId}` : ""}`)
        .then((res) => {
          if (res.data?.id) {
            localStorage.setItem("cartId", res.data.id);
          }
          return res.data;
        });
    },
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: false,
    enabled,
  });
};

export const useCartLinesUpdate = () => {
  return useMutation<
    NonNullable<CartLinesUpdateMutation["cartLinesUpdate"]>["cart"],
    IApiFailedResponse,
    CartLinesUpdateMutationVariables
  >({
    mutationFn: async (body) => {
      return shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CartLinesUpdateMutation["cartLinesUpdate"]>["cart"]
          >
        >("/cart/update-line-items", body)
        .then((res) => res.data);
    },
    mutationKey: cartQueryKey.updateLines,
    meta: {
      invalidateQueries: cartQueryKey.getCart(),
      successMessage: "Cart lines updated successfully",
      errorMessage: "Failed to update cart lines",
    },
  });
};

export const useCartLinesRemove = () => {
  return useMutation<
    NonNullable<CartLinesRemoveMutation["cartLinesRemove"]>["cart"],
    IApiFailedResponse,
    CartLinesRemoveMutationVariables
  >({
    mutationFn: async (body) => {
      return shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CartLinesRemoveMutation["cartLinesRemove"]>["cart"]
          >
        >("/cart/remove-lines", body)
        .then((res) => res.data);
    },
    mutationKey: cartQueryKey.removeLines,
    meta: {
      invalidateQueries: cartQueryKey.getCart(),
      successMessage: "Cart lines removed successfully",
      errorMessage: "Failed to remove cart lines",
    },
  });
};

export const useCartLinesAdd = () => {
  return useMutation<
    NonNullable<CartLinesAddMutation["cartLinesAdd"]>["cart"],
    IApiFailedResponse,
    CartLinesAddMutationVariables
  >({
    mutationFn: async (body) => {
      return shopifyAPI
        .post<
          IApiSuccessResponse<
            NonNullable<CartLinesAddMutation["cartLinesAdd"]>["cart"]
          >
        >("/cart/add-lines", body)
        .then((res) => res.data);
    },
    mutationKey: cartQueryKey.addLines,
    meta: {
      invalidateQueries: cartQueryKey.getCart(),
      successMessage: "Cart lines added successfully",
      errorMessage: "Failed to add cart lines",
    },
  });
};

export const useGetCartQueryCache = () => {
  const queryClient = useQueryClient();
  return queryClient.getQueryData<GetCartQuery["cart"]>(cartQueryKey.getCart());
};
