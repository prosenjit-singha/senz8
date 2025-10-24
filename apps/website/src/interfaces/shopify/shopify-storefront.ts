export interface CreateStoreAccessTokenRes {
  storefrontAccessTokenCreate: {
    userErrors: Array<unknown>;
    shop: {
      id: string;
    };
    storefrontAccessToken: {
      accessScopes: Array<{
        handle: string;
      }>;
      accessToken: string;
      title: string;
    };
  };
}
