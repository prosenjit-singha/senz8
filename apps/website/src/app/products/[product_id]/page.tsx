import { GetProductByHandleQuery } from "@/graphql";
import { shopifyAPI } from "@/helpers/api.helpers";
import { IApiSuccessResponse } from "@/interfaces";
import React from "react";
import ProductImagePreview from "./_components/image-preview";
import ProductActions from "./_components/product-actions";
import { notFound } from "next/navigation";
import { ProductDescription } from "./_components/product-description";
import StoreRefundPolicy from "./_components/store-refund-policy";
import StoreTermsOfService from "./_components/store-terms-of-service";
import StorePrivacyPolicy from "./_components/store-privacy-policy";

interface PageProps {
  params: Promise<{ product_id: string }>;
  searchParams: Promise<Record<string, string | string[]>>;
}

const ProductDetailsPage = async (props: PageProps) => {
  const params = await props.params;
  const data = await shopifyAPI.get<
    IApiSuccessResponse<GetProductByHandleQuery>
  >("/products/" + params.product_id);

  if (!data.data.product) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-y-6 mx-page-margin-auto my-page-margin">
      <div className="flex flex-col gap-6 lg:flex-row">
        <ProductImagePreview
          data={data.data.product?.images || { nodes: [] }}
        />
        <ProductActions data={data.data.product} />
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <ProductDescription className="sticky top-10">
          {data.data.product.descriptionHtml}
        </ProductDescription>
        <StoreRefundPolicy>
          {data.data.shop.refundPolicy?.body}
        </StoreRefundPolicy>
      </div>
      <div className="flex flex-col gap-6">
        <StoreTermsOfService>
          {data.data.shop.termsOfService?.body}
        </StoreTermsOfService>
        <StorePrivacyPolicy>
          {data.data.shop.privacyPolicy?.body}
        </StorePrivacyPolicy>
      </div>
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
};

export default ProductDetailsPage;
