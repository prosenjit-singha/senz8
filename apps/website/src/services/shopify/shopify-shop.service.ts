import { GetShopDetailsDocument, GetShopDetailsQuery } from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

export const getShopDetails = async () => {
  const result = await storefrontGraphQlRequest<GetShopDetailsQuery>(
    GetShopDetailsDocument
  );

  return result;
};
