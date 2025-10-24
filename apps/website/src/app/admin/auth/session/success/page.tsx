import React from "react";

async function ShopifyAuthSuccess({
  searchParams,
}: {
  searchParams: Promise<Partial<Record<string, string>>>;
}) {
  const params = await searchParams;
  return (
    <div className="min-h-screen pt-20 mx-page-margin-auto flex flex-col justify-center items-center">
      <h1>Shopify Auth Success</h1>
      <p>Shop: {params.shop}</p>
    </div>
  );
}

export default ShopifyAuthSuccess;
