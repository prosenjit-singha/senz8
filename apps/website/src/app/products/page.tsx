import React from "react";
import ShopFilterSection from "./_components/filter-section";
import { shopifyAPI } from "../../helpers/api.helpers";
import { GetProductsQuery } from "@/graphql";
import { IApiSuccessResponse } from "@/interfaces";
import ProductList from "./_components/product-list";

export async function getProducts(): Promise<
  IApiSuccessResponse<GetProductsQuery["products"]>
> {
  return await shopifyAPI.get<
    IApiSuccessResponse<GetProductsQuery["products"]>
  >("/products/list?first=50");
}

export const dynamic = "force-dynamic";

const ShopPage = async (pageProps: { params: Promise<{ id: string }> }) => {
  const res = await getProducts();

  return (
    <div className="mt-20">
      <ShopFilterSection />
      <ProductList data={res.data} />
    </div>
  );
};

export default ShopPage;
