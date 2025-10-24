import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";
import { CartBuyerIdentityUpdateDocument } from "@/graphql";

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const result = await storefrontGraphQlRequest(
    CartBuyerIdentityUpdateDocument,
    body
  );
  if (Array.isArray(result.errors)) {
    return {
      success: false,
      statusCode: 400,
      message: "Failed to update cart buyer identity",
      data: null,
      error: {
        type: "bad-request",
        message: result.errors[0].message,
        data: result.errors,
      },
    };
  }
  return {
    success: true,
    statusCode: 200,
    message: "Cart buyer identity updated successfully",
    data: result.data,
    error: null,
  };
});
