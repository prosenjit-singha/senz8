import { CartLinesUpdateDocument, CartLinesUpdateMutation } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Update Line Items  */
export const POST = apiHandler(
  {
    errorMsg: "Failed to update cart line items",
    successMsg: "Cart line items updated successfully",
  },
  async ({ req }) => {
    const body = await req.json();
    const { cartLinesUpdate: result } =
      await storefrontGraphQlRequest<CartLinesUpdateMutation>(
        CartLinesUpdateDocument,
        body
      );

    if (result?.cart) {
      return {
        success: true,
        statusCode: 200,
        data: result?.cart,
      };
    }
    return {
      success: false,
      statusCode: 400,
      error: {
        type: "bad-request",
        message:
          result?.userErrors[0].message || "Failed to update cart line items",
        data: result?.userErrors,
      },
    };
  }
);
