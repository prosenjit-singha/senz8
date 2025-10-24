"use client";
import React from "react";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";
import { shopifyAPI } from "@/helpers/api.helpers";

interface LoadMoreProductsProps {
  pageInfo: GetShopifyProductsRes["pageInfo"];
}

export default function LoadMoreProducts({ pageInfo }: LoadMoreProductsProps) {
  const onClick = async () => {
    const res = await shopifyAPI.get<GetShopifyProductsRes>(
      `/products/list?after=${pageInfo.endCursor}`
    );
    console.log("Load more products", res);
  };
  return (
    <div className="flex justify-center items-center py-4">
      <button className="btn btn-primary" onClick={onClick}>
        Load More
      </button>
    </div>
  );
}
