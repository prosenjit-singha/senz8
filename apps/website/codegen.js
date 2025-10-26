module.exports = {
  schema: [
    {
      "https://senz8.myshopify.com/api/2025-10/graphql.json": {
        headers: {
          "X-Shopify-Storefront-Access-Token":
            "828d05d4f9ac9d538aed5c9d6a83ad27",
        },
      },
    },
  ],
  documents: "src/graphql/**/*.graphql",
  generates: {
    "src/graphql/index.ts": {
      plugins: ["typescript", "typescript-operations", "typed-document-node"],
      config: { avoidOptionals: true },
    },
  },
};
