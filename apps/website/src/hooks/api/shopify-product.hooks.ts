import { useQuery } from "@tanstack/react-query";

export const useGetShopifyProducts = (params: {
  limit?: number | `${number}`;
  page_info?: string;
}) => {
  return useQuery({
    queryKey: ["shopify-products"],
    queryFn: () => {},
  });
};
