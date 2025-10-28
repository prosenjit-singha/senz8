import { CartLinesRemoveDocument, CartLinesRemoveMutation } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Remove Line Items  */
export const POST = apiHandler(
  {
    errorMsg: "Failed to remove cart line items",
    successMsg: "Cart line items removed successfully",
  },
  async ({ req }) => {
    const body = await req.json();

    const { cartLinesRemove: result } =
      await storefrontGraphQlRequest<CartLinesRemoveMutation>(
        CartLinesRemoveDocument,
        body
      );

    if (result?.cart) {
      return {
        success: true,
        statusCode: 200,
        data: result?.cart,
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        error: {
          type: "bad-request",
          message:
            result?.userErrors[0].message ?? "Failed to remove cart line items",
          data: result?.userErrors,
        },
      };
    }
  }
);
