"use client";

import { GetCartQuery } from "@/graphql";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const cartQueryKey = {
  all: ["shopify-cart"],
  getCart: (cartId?: string) => [...cartQueryKey.all, cartId],
};

export const useGetCartQuery = () => {
  const cartId = localStorage.getItem("cartId") ?? undefined;
  return useQuery<GetCartQuery["cart"], IApiFailedResponse>({
    queryKey: cartQueryKey.getCart(cartId),
    queryFn: () => {
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
    retry: false,
  });
};

export const useGetCartQueryCache = () => {
  const queryClient = useQueryClient();
  const cartId = localStorage.getItem("cartId") ?? undefined;
  return queryClient.getQueryData<GetCartQuery["cart"]>(
    cartQueryKey.getCart(cartId)
  );
};
