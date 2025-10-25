import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { ClientResponse } from "@shopify/storefront-api-client";
import { request } from "graphql-request";

const endpoint = `https://${process.env.NEXT_PUBLIC_SHOP_DOMAIN}/api/2025-10/graphql.json`;
const headers = {
  "X-Shopify-Storefront-Access-Token":
    process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
  "Content-Type": "application/json",
};

export const storefrontGraphQlRequest = <
  T = unknown,
  V = object,
  A = unknown,
  B = any,
>(
  document: TypedDocumentNode<A, B>,
  variables?: V
) => {
  return request<T>(endpoint, document, variables as object, headers);
};
