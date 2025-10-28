import {
  GetCollectionsDocument,
  GetCollectionsQuery,
  GetSingleCollectionDocument,
  GetSingleCollectionQuery,
  GetSingleCollectionQueryVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

export const getCollections = () => {
  const query = storefrontGraphQlRequest<GetCollectionsQuery>(
    GetCollectionsDocument
  );
  return query;
};

export const getSingleCollection = (collectionId: string) =>
  storefrontGraphQlRequest<
    GetSingleCollectionQuery,
    GetSingleCollectionQueryVariables
  >(GetSingleCollectionDocument, { collectionId });
