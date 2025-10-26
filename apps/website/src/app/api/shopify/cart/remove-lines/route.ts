import { CartLinesRemoveDocument, CartLinesRemoveMutation } from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

/** Remove Line Items  */
export const POST = apiHandler(async (req) => {
  const body = await req.json();

  console.log(body);

  const { cartLinesRemove: result } =
    await storefrontGraphQlRequest<CartLinesRemoveMutation>(
      CartLinesRemoveDocument,
      body
    );

  if (result?.cart) {
    return {
      success: true,
      message: "Cart line items removed successfully",
      statusCode: 200,
      data: result?.cart,
      error: null,
    };
  } else {
    return {
      success: false,
      statusCode: 400,
      message: "Failed to remove cart line items",
      data: null,
      error: {
        type: "bad-request",
        message:
          result?.userErrors[0].message ?? "Failed to remove cart line items",
        data: result?.userErrors,
      },
    };
  }
});
