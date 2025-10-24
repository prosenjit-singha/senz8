import { CartLinesUpdateDocument } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Update Line Items  */
export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const result = await storefrontGraphQlRequest(CartLinesUpdateDocument, body);
  if (Array.isArray(result.errors)) {
    return {
      success: false,
      statusCode: 400,
      message: "Failed to update cart line items",
      error: {
        type: "bad-request",
        message: result.errors[0].message,
        data: result.errors,
      },
    };
  }
  return {
    success: true,
    message: "Cart line items updated successfully",
    statusCode: 200,
    data: result.data,
    error: null,
  };
});
