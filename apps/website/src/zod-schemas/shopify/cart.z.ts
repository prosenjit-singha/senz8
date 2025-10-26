import { z } from "zod";
import { zPhoneNumber } from "./customer.z";

/**
 * 🧩 Zod schema for creating a Shopify cart via Storefront API
 * Matches the structure of `ShopifyCartCreateInput`.
 */
export const zShopifyCartCreateInput = z.object({
  /** Optional custom cart-level attributes (key-value pairs). */
  attributes: z
    .array(
      z.object({
        key: z.string().min(1, "Attribute key is required"),
        value: z.string(),
      })
    )
    .optional(),
  /** Buyer information — identifies the customer who owns the cart. */
  buyerIdentity: z
    .object({
      /** Customer email address. */
      email: z.email().optional(),

      /** Customer phone number. */
      phone: zPhoneNumber.optional(),

      /** Company location (if applicable). */
      companyLocationId: z.string().optional(),

      /** ISO 2-letter country code (e.g., "US", "CA"). */
      countryCode: z.string().optional(),

      /** Customer access token from Shopify customer authentication. */
      customerAccessToken: z.string().optional(),

      /** Optional buyer preferences metadata. */
      preferences: z
        .object({
          wallet: z.string().optional(),
          delivery: z.object({
            coordinates: z
              .object({
                countryCode: z.string().min(2, "Country code is required"),
                latitude: z.float32(),
                longitude: z.float32(),
              })
              .optional(),
            deliveryMethod: z.enum(["PICK_UP", "PICKUP_POINT", "SHIPPING"]),
            pickupHandle: z.string(),
          }),
        })
        .optional(),
      purchasingCompany: z
        .object({
          company: z
            .object({
              createdAt: z.string(),
              /** The date and time (ISO 8601 format) at which the company was created in Shopify. */
              externalId: z.string(),
              id: z.string(),
              name: z.string(),
              updatedAt: z.string(),
            })
            .optional(),
          contact: z
            .object({
              createdAt: z.iso.datetime(),
              id: z.string(),
              local: z.string(),
              title: z.string(),
              updatedAt: z.string(),
            })
            .optional(),
          location: z
            .object({
              id: z.string(),
              createdAt: z.string(),
              updatedAt: z.string(),
              local: z.string().optional(),
              name: z.string(),
            })
            .optional(),
        })
        .optional(),
    })
    .optional(),

  /** Line items in the cart (products, subscriptions, etc). */
  lines: z
    .array(
      z.object({
        /** Optional custom attributes specific to this line item. */
        attributes: z
          .array(
            z.object({
              key: z.string().min(1, "Attribute key is required"),
              value: z.string(),
            })
          )
          .optional(),

        /** Quantity of the item. Must be at least 1. */
        quantity: z.number().min(1, "Quantity must be at least 1"),

        /** Product variant ID (gid://shopify/ProductVariant/...). */
        merchandiseId: z.string().min(1, "Merchandise ID is required"),

        /** Optional selling plan ID (for subscriptions). */
        sellingPlanId: z.string().optional(),

        /** Optional parent bundle reference (for nested products). */
        parent: z.record(z.string(), z.any()).optional(),
      })
    )
    .default([]),

  /** Discount code(s) applied to this cart. */
  discountCodes: z.array(z.string()).optional(),

  /** Gift card code(s) applied to this cart. */
  giftCardCodes: z.array(z.string()).optional(),

  /** Optional note attached to the cart. */
  note: z.string().optional(),

  /** Delivery information (shipping addresses, etc). */
  delivery: z
    .object({
      addresses: z.array(z.object({})).optional(),
    })
    .optional(),

  /** Metafields attached to the cart for custom data. */
  metafields: z
    .array(
      z.object({
        key: z.string().min(1, "Metafield key is required"),
        value: z.string(),
        type: z.string().min(1, "Metafield type is required"),
      })
    )
    .optional(),
});

/**
 * ✅ Type inference for TypeScript
 * Use this wherever you want strong typing.
 */
export type ShopifyCartCreateInput = z.infer<typeof zShopifyCartCreateInput>;
