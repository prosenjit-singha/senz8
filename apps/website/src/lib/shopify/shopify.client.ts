import { createFetcher } from "@/helpers";

export const storefrontGraphQlApi = createFetcher({
  baseURL: `https://${process.env.NEXT_PUBLIC_SHOP_DOMAIN}/api/2025-10/graphql.json`,
  headers: {
    "X-Shopify-Storefront-Access-Token": process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// export const storefrontRestApi = createFetcher({
//     baseURL: `https://${process.env.NEXT_PUBLIC_SHOP_DOMAIN}/admin/api/2025-10/`,
//     headers: {
//         "X-Shopify-Access-Token":
//             process.env.NEXT_PUBLIC_SHOPIFY_ACCESS_TOKEN!,
//         "Content-Type": "application/json",
//         Accept: "application/json",
//     },
// })
