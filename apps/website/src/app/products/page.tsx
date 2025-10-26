import React from "react";
import ShopFilterSection from "./_components/filter-section";
import ProductList from "./_components/product-list";
import { shopifyAPI } from "../../helpers/api.helpers";
import { GetShopifyProductsRes } from "@/interfaces/shopify/shopify-products.interface";

export async function getProducts(): Promise<GetShopifyProductsRes> {
  return await shopifyAPI.get<GetShopifyProductsRes>("/products/list?first=50");
}

export const dynamic = "force-dynamic";

const ShopPage = async (pageProps: { params: Promise<{ id: string }> }) => {
  const res = await getProducts();

  return (
    <div className="mt-20">
      <ShopFilterSection />
      <ProductList data={res} />
    </div>
  );
};

export default ShopPage;
