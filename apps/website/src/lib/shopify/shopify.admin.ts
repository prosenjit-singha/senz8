import "server-only";

import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion, Session } from "@shopify/shopify-api";
import { MongoDBSessionStorage } from "@shopify/shopify-app-session-storage-mongodb";
import { allScopes } from "@/constants/shopify.const";
import { createFetcher } from "@/helpers";
import { CreateStoreAccessTokenRes } from "@/interfaces/shopify/shopify-storefront";

export const shopify = shopifyApi({
  apiKey: process.env.SHOPIFY_API_KEY!,
  apiSecretKey: process.env.SHOPIFY_API_SECRET!,
  apiVersion: ApiVersion.October25,
  scopes: allScopes,
  hostName: process.env.SHOPIFY_APP_URL!.replace(/^https?:\/\//, ""),
  isEmbeddedApp: false, // standalone app
  sessionStorage: new MongoDBSessionStorage(
    process.env.MONGODB_URI as unknown as URL,
    "shopify_sessions"
  ),
});

export const getOfflineSession = async () => {
  return await shopify.config.sessionStorage.loadSession(
    `offline_${process.env.NEXT_PUBLIC_SHOP_DOMAIN}`
  );
};

export const shopifyGraphQlApi = async <T>(body: {
  query: string;
  variables?: Record<string, any>;
}) => {
  const session = await getOfflineSession();

  if (!session) {
    throw new Error("No session found");
  }

  const baseURL = `https://${session.shop}/admin/api/2025-10/graphql.json`;
  const headers = {
    "Content-Type": "application/json",
    "X-Shopify-Access-Token": session.accessToken!,
  };

  const fetcher = createFetcher({
    baseURL,
    headers,
  });

  const response = await fetcher.post<T>("", body);

  return response;
};

export const shopifyRestApi = async () => {
  const db_session = await getOfflineSession();

  if (!db_session) {
    throw new Error("No session found");
  }

  const session = new Session(db_session.toObject());

  const restClient = new shopify.clients.Rest({
    session,
    apiVersion: ApiVersion.October25,
  });
  return restClient;
};

export const createStorefrontAccessToken = async (title: string) => {
  const mutation = `mutation StorefrontAccessTokenCreate($input: StorefrontAccessTokenInput!) {
      storefrontAccessTokenCreate(input: $input) {
        userErrors {
          field
          message
        }
        shop {
          id
        }
        storefrontAccessToken {
          accessScopes {
            handle
          }
          accessToken
          title
        }
      }
    }`;

  const response = await shopifyGraphQlApi<CreateStoreAccessTokenRes>({
    query: mutation,
    variables: {
      input: {
        title,
      },
    },
  });

  // const { userErrors, storefrontAccessToken } = response.data.storefrontAccessTokenCreate;

  // if (userErrors.length) {
  //   throw new Error(userErrors.map(e => e.message).join(", "));
  // }

  // if (!storefrontAccessToken) {
  //   throw new Error("Failed to create storefront access token");
  // }

  return response;
};
