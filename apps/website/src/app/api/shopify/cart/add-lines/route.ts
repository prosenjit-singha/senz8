import { CartLinesAddDocument, CartLinesAddMutation } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Add Line Items  */
export const POST = apiHandler(async (req) => {
  const body = await req.json();

  const { cartLinesAdd: result } =
    await storefrontGraphQlRequest<CartLinesAddMutation>(
      CartLinesAddDocument,
      body
    );

  if (result?.cart) {
    return {
      success: true,
      message: "Cart line items added successfully",
      statusCode: 200,
      data: result?.cart,
      error: null,
    };
  }
  return {
    success: false,
    statusCode: 400,
    data: null,
    message: "Failed to add cart line items",
    error: {
      type: "bad-request",
      message:
        result?.userErrors?.[0]?.message ?? "Failed to add cart line items",
      data: result?.userErrors,
    },
  };
});
