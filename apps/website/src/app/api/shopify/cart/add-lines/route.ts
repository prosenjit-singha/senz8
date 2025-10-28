import { CartLinesAddDocument, CartLinesAddMutation } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Add Line Items  */
export const POST = apiHandler(
  {
    errorMsg: "Failed to add cart line items",
    successMsg: "Cart line items added successfully",
  },
  async ({ req }) => {
    const body = await req.json();

    const { cartLinesAdd: result } =
      await storefrontGraphQlRequest<CartLinesAddMutation>(
        CartLinesAddDocument,
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
          result?.userErrors?.[0]?.message ?? "Failed to add cart line items",
        data: result?.userErrors,
      },
    };
  }
);
