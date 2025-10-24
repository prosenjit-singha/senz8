/**
 * Shopify CartCreate input payload.
 * Use this when calling the `cartCreate` mutation.
 */
export interface ShopifyCartCreateInput {
  /** Optional custom cart-level attributes (key-value pairs). */
  attributes?: {
    key: string;
    value: string;
  }[];

  /** Line items in the cart (products, subscriptions, etc). */
  lines?: {
    /** Optional custom attributes specific to this line item. */
    attributes?: {
      key: string;
      value: string;
    }[];
    /** Quantity of the item. */
    quantity: number;
    /** Product variant ID (gid://shopify/ProductVariant/...). */
    merchandiseId: string;
    /** Optional selling plan ID (for subscriptions). */
    sellingPlanId?: string;
    /** Optional parent bundle reference (for nested products). */
    parent?: Record<string, any>;
  }[];

  /** Discount code(s) applied to this cart. */
  discountCodes?: string[];

  /** Gift card code(s) applied to this cart. */
  giftCardCodes?: string[];

  /** Optional note attached to the cart. */
  note?: string;

  /** Buyer information — identifies the customer who owns the cart. */
  buyerIdentity?: {
    /** Customer email address. */
    email?: string;
    /** Customer phone number. */
    phone?: string;
    /** Company location (if applicable). */
    companyLocationId?: string;
    /** ISO 2-letter country code (e.g., "US", "CA"). */
    countryCode?: string;
    /** Customer access token from Shopify customer authentication. */
    customerAccessToken?: string;
    /** Optional buyer preferences metadata. */
    preferences?: Record<string, any>;
  };

  /** Delivery information (shipping addresses, etc). */
  delivery?: {
    addresses?: Record<string, any>[];
  };

  /** Metafields attached to the cart for custom data. */
  metafields?: {
    key: string;
    value: string;
    type: string; // e.g. "single_line_text_field"
  }[];
}

export type ShopifyDeliveryMethod = "PICK_UP" | "PICKUP_POINT" | "SHIPPING";

export interface ShopifyCart {
  id: string;
  createdAt: string;
  updatedAt: string;

  /** List of line items in the cart */
  lines: {
    edges: {
      node: {
        id: string;
        quantity: number;
        attributes: { key: string; value: string }[];
        merchandise: {
          id: string;
          title: string;
          price: {
            amount: string;
            currencyCode: string;
          };
          product: {
            id: string;
            title: string;
            handle: string;
            featuredImage?: {
              url: string;
              altText: string | null;
            } | null;
          };
        };
      };
    }[];
  };

  /** Cart-level custom attributes */
  attributes: { key: string; value: string }[];

  /** Cost summary for the cart */
  cost: {
    subtotalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalAmount: {
      amount: string;
      currencyCode: string;
    };
    totalTaxAmount?: {
      amount: string;
      currencyCode: string;
    } | null;
    totalDutyAmount?: {
      amount: string;
      currencyCode: string;
    } | null;
  };

  /** Buyer identity details */
  buyerIdentity: {
    email: string | null;
    phone: string | null;
    countryCode: string | null;
    customer?: {
      id: string;
      displayName: string;
      email: string;
    } | null;
    preferences?: {
      delivery?: {
        /** e.g., ["PICK_UP", "SHIP_TO_HOME"] */
        deliveryMethod: ShopifyDeliveryMethod[];
        pickupHandle: string[];
      };
    };
  };

  /** New delivery schema replacing deliveryAddressPreferences */
  delivery?: {
    address?: {
      address1?: string;
      address2?: string | null;
      city?: string;
      provinceCode?: string;
      countryCodeV2?: string;
      zip?: string;
    } | null;
    method?: {
      handle: string;
      title: string;
      description?: string | null;
      estimatedDeliveryTime?: {
        timeRange?: {
          start?: string;
          end?: string;
        };
      };
    } | null;
  } | null;
}
