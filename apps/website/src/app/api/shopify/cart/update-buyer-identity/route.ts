import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";
import {
  CartBuyerIdentityUpdateDocument,
  CartBuyerIdentityUpdateMutation,
  CartBuyerIdentityUpdateMutationVariables,
} from "@/graphql";

export const POST = apiHandler(
  {
    errorMsg: "Failed to update cart buyer identity",
    successMsg: "Cart buyer identity updated successfully",
  },
  async ({ req }) => {
    const body = await req.json();
    const result = await storefrontGraphQlRequest<
      CartBuyerIdentityUpdateMutation,
      CartBuyerIdentityUpdateMutationVariables
    >(CartBuyerIdentityUpdateDocument, body);

    if (result.cartBuyerIdentityUpdate?.cart) {
      return {
        success: true,
        statusCode: 200,
        data: result.cartBuyerIdentityUpdate.cart,
      };
    }

    return {
      success: false,
      statusCode: 400,
      error: {
        type: "bad-request",
        message:
          result.cartBuyerIdentityUpdate?.userErrors?.[0]?.message ??
          "Failed to update cart buyer identity",
        data: result.cartBuyerIdentityUpdate?.userErrors,
      },
    };
  }
);
