import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";
import { getSession } from "@/lib/auth/auth.session";
import { CustomerCart } from "@/models/cart.model";
import { zShopifyCartCreateInput } from "@/zod-schemas/shopify/cart.z";
import {
  CartCreateDocument,
  CartCreateMutation,
  GetCartDocument,
  GetCartQuery,
  GetCartQueryVariables,
} from "@/graphql/index";
import { connectDB } from "@/helpers/db.helper";

export const GET = apiHandler(async (req) => {
  await connectDB();
  const session = await getSession();
  const { searchParams } = req.nextUrl;
  let cartId = searchParams.get("cartId");

  if (session) {
    const cart = await CustomerCart.findOne({ customerId: session?.user?.id });

    if (cart) {
      cartId = cart.cartId;
    }
  }

  console.log({ cartId });

  // if cart id provided get the cart details from shopify
  if (cartId) {
    const shopifyCart = await storefrontGraphQlRequest<
      GetCartQuery,
      GetCartQueryVariables
    >(GetCartDocument, { cartId });

    if (shopifyCart.cart) {
      if (session) {
        await CustomerCart.findOneAndUpdate(
          { customerId: session?.user?.id },
          { cartId: shopifyCart?.cart.id },
          { upsert: true, new: true }
        );
      }
      return {
        success: true,
        statusCode: 200,
        message: "Cart fetched successfully",
        data: shopifyCart.cart,
        error: null,
      };
    } else {
      return {
        success: false,
        statusCode: 404,
        message: "Cart not found",
        data: null,
        error: {
          type: "bad-request",
          message:
            "Cart not found! Please create a cart first with cartId " + cartId,
        },
      };
    }
  } else {
    // create new cart
    const isGuest = !session;
    const cartInput = isGuest
      ? {}
      : {
          buyerIdentity: {
            customerAccessToken: session?.accessToken, // optional
            email: session?.user?.email,
            phone: session?.user?.phone,
          },
        };
    const result = await storefrontGraphQlRequest<CartCreateMutation>(
      CartCreateDocument,
      {
        input: cartInput,
      }
    );

    if (result.cartCreate?.cart) {
      if (session) {
        await CustomerCart.findOneAndUpdate(
          { customerId: session?.user?.id },
          { cartId: result.cartCreate?.cart.id },
          { upsert: true, new: true }
        );
      }
      return {
        success: true,
        statusCode: 201,
        message: "Cart created successfully",
        data: result.cartCreate?.cart,
        error: null,
      };
    } else {
      return {
        success: false,
        statusCode: 400,
        message: "Failed to create cart",
        data: null,
        error: {
          type: "bad-request",
          message: Array.isArray(result.cartCreate?.userErrors)
            ? result.cartCreate?.userErrors?.[0]?.message
            : "Failed to create cart",
          data: result.cartCreate?.userErrors,
        },
      };
    }
  }
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

  const cart = result?.cartCreate?.cart;
  const userErrors = result?.cartCreate?.userErrors;

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
      data: userErrors,
    },
  };
});
