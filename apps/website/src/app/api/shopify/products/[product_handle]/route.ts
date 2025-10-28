import {
  GetProductByHandleDocument,
  GetProductByHandleQuery,
  GetProductByHandleQueryVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";

type Params = { product_handle: string };

export const GET = apiHandler<Params>(
  {
    successMsg: "Product details retrieved successfully",
    errorMsg: "Failed to retrieve product details",
  },
  async ({ req, params }) => {
    const productHandle = params.product_handle;

    const result = await storefrontGraphQlRequest<
      GetProductByHandleQuery,
      GetProductByHandleQueryVariables
    >(GetProductByHandleDocument, { handle: productHandle });

    if (result.product) {
      return {
        success: true,
        data: result,
        statusCode: 200,
      };
    }

    return {
      success: false,
      statusCode: 404,
      error: {
        type: "not-found",
        message: "Product not found",
        data: null,
      },
    };
  }
);
