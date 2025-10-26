import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";
import {
  CartBuyerIdentityUpdateDocument,
  CartBuyerIdentityUpdateMutation,
  CartBuyerIdentityUpdateMutationVariables,
} from "@/graphql";

export const POST = apiHandler(async (req) => {
  const body = await req.json();
  const result = await storefrontGraphQlRequest<
    CartBuyerIdentityUpdateMutation,
    CartBuyerIdentityUpdateMutationVariables
  >(CartBuyerIdentityUpdateDocument, body);

  if (result.cartBuyerIdentityUpdate?.cart) {
    return {
      success: true,
      statusCode: 200,
      message: "Cart buyer identity updated successfully",
      data: result.cartBuyerIdentityUpdate.cart,
      error: null,
    };
  }

  return {
    success: false,
    statusCode: 400,
    message: "Failed to update cart buyer identity",
    data: null,
    error: {
      type: "bad-request",
      message:
        result.cartBuyerIdentityUpdate?.userErrors?.[0]?.message ??
        "Failed to update cart buyer identity",
      data: result.cartBuyerIdentityUpdate?.userErrors,
    },
  };
});
