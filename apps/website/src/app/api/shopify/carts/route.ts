import { apiHandler } from "@/helpers/api.handler";
import { ShopifyCart } from "@/interfaces/shopify/shopify-cart.interface";
import { getSession } from "@/lib/auth/auth.session";
import { storefrontGraphQlApi } from "@/lib/shopify/shopify.client";
import { CustomerCart } from "@/models/cart.model";
import { zShopifyCartCreateInput } from "@/zod-schemas/shopify/cart.z";
import { ClientResponse } from "@shopify/storefront-api-client";

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

  const shopifyCart = await storefrontGraphQlApi.post<ClientResponse<{ cart: ShopifyCart }>>(``, {
    query: `
      {
        cart(id: "${cart.cartId}") {
          id
          createdAt
          updatedAt

          # Cart line items
          lines(first: 20) {
            edges {
              node {
                id
                quantity
                attributes {
                  key
                  value
                }
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    price {
                      amount
                      currencyCode
                    }
                    product {
                      id
                      title
                      handle
                      featuredImage {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }

          # Cart-level attributes
          attributes {
            key
            value
          }

          # Cart cost summary
          cost {
            subtotalAmount {
              amount
              currencyCode
            }
            totalAmount {
              amount
              currencyCode
            }
            totalTaxAmount {
              amount
              currencyCode
            }
            totalDutyAmount {
              amount
              currencyCode
            }
          }

          # Buyer identity details
          buyerIdentity {
            email
            phone
            customer {
              id
              displayName
              email
            }
            countryCode
            preferences {
              delivery {
                deliveryMethod
              }
            }
          }

          # New delivery schema (replaces deliveryAddressPreferences)
          delivery {
            address {
              address1
              address2
              city
              provinceCode
              countryCodeV2
              zip
            }
            method {
              handle
              title
              description
              estimatedDeliveryTime {
                timeRange {
                  start
                  end
                }
              }
            }
          }
        }
      }
    `,
  });

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

/**
 * Create Cart
 */
export const POST = apiHandler(async (req) => {
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

  const body = await req.json();

  const input = zShopifyCartCreateInput.parse(body);

  const query = `mutation cartCreate($input: CartInput) {
  cartCreate(input: $input) {
    cart {
      id
      createdAt
      updatedAt
      lines(first: 10) {
        edges {
          node {
            id
            merchandise {
              ... on ProductVariant {
                id
              }
            }
          }
        }
      }
      buyerIdentity {
        deliveryAddressPreferences {
          __typename
        }
        preferences {
          delivery {
            deliveryMethod
          }
        }
      }
      attributes {
        key
        value
      }
      # The estimated total cost of all merchandise that the customer will pay at checkout.
      cost {
        totalAmount {
          amount
          currencyCode
        }
        # The estimated amount, before taxes and discounts, for the customer to pay at checkout.
        subtotalAmount {
          amount
          currencyCode
        }
        # The estimated tax amount for the customer to pay at checkout.
        totalTaxAmount {
          amount
          currencyCode
        }
        # The estimated duty amount for the customer to pay at checkout.
        totalDutyAmount {
          amount
          currencyCode
        }
      }
    }
  }
    userErrors {
      field
      message
    }
    warnings {
      # CartWarning fields
    }
  }
}`;

  const result = await storefrontGraphQlApi.post<
    ClientResponse<{
      cartCreate: {
        cart: {
          id: string;
          createdAt: string;
          updatedAt: string;
          cost: {
            total: {
              amount: number;
              currencyCode: string;
            };
            subtotal: {
              amount: number;
              currencyCode: string;
            };
            totalTax: {
              amount: number;
              currencyCode: string;
            };
            totalDuty: {
              amount: number;
              currencyCode: string;
            };
          };
        };
      };
    }>
  >("/", {
    query,
    variables: { input },
  });

  if (result.data?.cartCreate?.cart) {
    const cart = result.data?.cartCreate?.cart!;

    if (cart?.id) {
      await CustomerCart.findOneAndUpdate(
        { customerId: session?.user?.id },
        { cartId: cart?.id },
        { upsert: true, new: true }
      );
    }

    return {
      success: true,
      statusCode: 201,
      message: "Cart created successfully",
      data: {
        // id: cart?.id,
        createdAt: cart?.createdAt,
        updatedAt: cart?.updatedAt,
        cost: cart?.cost,
      },
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
        message: "Failed to create cart",
        data: result.errors,
      },
    };
  }
});
