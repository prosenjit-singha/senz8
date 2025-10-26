import { createFetcher } from "./fetcher";

export const shopifyAPI = createFetcher({
  baseURL: process.env.NEXT_PUBLIC_HOST_URL + "/api/shopify",
  headers: {
    "Content-Type": "application/json",
  },
});

export const localAPI = createFetcher({
  baseURL: process.env.NEXT_PUBLIC_HOST_URL + "/api",
});
