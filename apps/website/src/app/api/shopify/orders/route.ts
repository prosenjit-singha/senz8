function buildOrderQuery({
  orderId,
  minDate,
  maxDate,
}: {
  orderId?: string;
  minDate?: string; // YYYY-MM-DD
  maxDate?: string; // YYYY-MM-DD
}) {
  const filters: string[] = [];

  if (orderId) {
    filters.push(`name:${orderId}*`);
  }

  if (minDate) {
    filters.push(`processed_at:>=${minDate}`);
  }

  if (maxDate) {
    filters.push(`processed_at:<=${maxDate}`);
  }

  // join filters
  return filters.join(" ");
}

import {
  GetCustomerOrdersDocument,
  GetCustomerOrdersQuery,
  GetCustomerOrdersQueryVariables,
} from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";
import { apiHandler } from "@/helpers/api.handler";

export const GET = apiHandler(
  {
    validateSession: true,
    errorMsg: "Failed to fetch orders",
    successMsg: "Orders fetched successfully",
  },
  async ({ session, req }) => {
    const url = new URL(req.url);
    const first = parseInt(url.searchParams.get("first") || "10", 10);
    const after = url.searchParams.get("after") || undefined;
    const orderId = url.searchParams.get("orderId") || undefined;
    const minDate = url.searchParams.get("minDate") || undefined;
    const maxDate = url.searchParams.get("maxDate") || undefined;
    const sortOrder = url.searchParams.get("sortOrder") === "DESC";

    const queryFilter = buildOrderQuery({ orderId, minDate, maxDate });

    const response = await storefrontGraphQlRequest<
      GetCustomerOrdersQuery,
      GetCustomerOrdersQueryVariables
    >(GetCustomerOrdersDocument, {
      customerAccessToken: session.accessToken,
      first,
      // @ts-expect-error Ignored keys can cause issue
      after,
      query: queryFilter,
      reverse: !sortOrder, // Shopify API: reverse=true for ascending
    });

    if (response.customer) {
      return {
        success: true,
        statusCode: 200,
        data: response.customer,
        message: "Orders fetched successfully",
        error: null,
      };
    }

    return {
      success: false,
      statusCode: 500,
      message: "Failed to fetch orders",
      error: {
        type: "bad-request",
        message: "Internal server error",
      },
    };
  }
);
