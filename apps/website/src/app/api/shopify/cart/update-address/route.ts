import {
  CartDeliveryAddressesUpdateDocument,
  CartDeliveryAddressesUpdateMutation,
} from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Update Line Items  */
export const POST = apiHandler(
  {
    errorMsg: "Failed to update cart delivery address",
    successMsg: "Cart delivery address updated successfully",
  },
  async ({ req }) => {
    const body = await req.json();
    const result =
      await storefrontGraphQlRequest<CartDeliveryAddressesUpdateMutation>(
        CartDeliveryAddressesUpdateDocument,
        body
      );
    if (result.cartDeliveryAddressesUpdate?.cart) {
      return {
        success: true,
        statusCode: 200,
        data: result.cartDeliveryAddressesUpdate.cart,
      };
    }

    return {
      success: false,
      statusCode: 400,
      error: {
        type: "bad-request",
        message:
          result.cartDeliveryAddressesUpdate?.userErrors?.[0]?.message ??
          "Failed to update cart delivery address",
        data: result.cartDeliveryAddressesUpdate?.userErrors,
      },
    };
  }
);
