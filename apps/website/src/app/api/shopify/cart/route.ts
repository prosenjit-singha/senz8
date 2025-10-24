import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";
import { getSession } from "@/lib/auth/auth.session";
import { CustomerCart } from "@/models/cart.model";
import { zShopifyCartCreateInput } from "@/zod-schemas/shopify/cart.z";
import {
  CartCreateDocument,
  GetCartDocument,
  GetCartQuery,
  GetCartQueryVariables,
} from "@/graphql/index";

export const GET = apiHandler(async (req) => {
  const session = await getSession();
  if (!session) {
    return {
      success: false,
      statusCode: 401,
      message: "Failed to create cart",
      data: null,
      error: {
        type: "authentication",
        message: "Unauthentic user",
      },
    };
  }

  const cart = await CustomerCart.findOne({ customerId: session?.user?.id });

  if (!cart) {
    return {
      success: false,
      statusCode: 404,
      message: "Cart not found",
      data: null,
      error: {
        type: "bad-request",
        message: "Cart not found! Please create a cart first",
      },
    };
  }

  const shopifyCart = await storefrontGraphQlRequest<
    GetCartQuery,
    GetCartQueryVariables
  >(GetCartDocument, { cartId: cart.cartId });

  if (shopifyCart.data?.cart) {
    return {
      success: true,
      statusCode: 200,
      message: "Cart fetched successfully",
      data: shopifyCart.data?.cart,
      error: null,
    };
  }

  return {
    success: false,
    statusCode: 400,
    message: "Failed to get cart",
    data: null,
    error: {
      type: "bad-request",
      message: "Failed to get cart from Shopify",
      data: shopifyCart.errors,
    },
  };
});

export const POST = apiHandler(async (req) => {
  const session = await getSession();
  const body = await req.json();

  // optional input validation
  const input = zShopifyCartCreateInput.parse(body);

  // if guest, remove any buyer info before sending to Shopify
  const isGuest = !session;
  const cartInput = isGuest
    ? { ...input, buyerIdentity: undefined }
    : {
        ...input,
        buyerIdentity: {
          customerAccessToken: session?.accessToken, // optional
          email: session?.user?.email,
          phone: session?.user?.phone,
        },
      };

  type Res = {
    cartCreate: {
      cart: {
        id: string;
        createdAt: string;
        updatedAt: string;
        checkoutUrl: string;
        cost: {
          totalAmount: { amount: string; currencyCode: string };
          subtotalAmount: { amount: string; currencyCode: string };
          totalTaxAmount: { amount: string; currencyCode: string };
        };
      } | null;
      userErrors: { field: string[]; message: string }[];
    };
  };

  const result = await storefrontGraphQlRequest<Res>(CartCreateDocument, {
    input: cartInput,
  });

  const cart = result.data?.cartCreate?.cart;
  const userErrors = result.data?.cartCreate?.userErrors;

  if (cart?.id) {
    // If user logged in, link the cart to customer
    if (session?.user?.id) {
      await CustomerCart.findOneAndUpdate(
        { customerId: session.user.id },
        { cartId: cart.id },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      statusCode: 201,
      message: "Cart created successfully",
      data: {
        id: cart.id,
        checkoutUrl: cart.checkoutUrl,
        createdAt: cart.createdAt,
        updatedAt: cart.updatedAt,
        cost: cart.cost,
      },
      error: null,
    };
  }

  return {
    success: false,
    statusCode: 400,
    message: "Failed to create cart",
    data: null,
    error: {
      type: "bad-request",
      message: "Cart creation failed",
      data: userErrors ?? result.errors,
    },
  };
});
