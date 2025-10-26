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

import { GetCustomerOrdersDocument } from "@/graphql";
import { storefrontGraphQlRequest } from "@/graphql/shopify";

export const GET = async (req: Request) => {
  const url = new URL(req.url);
  const customerAccessToken = url.searchParams.get("customerAccessToken")!;
  const first = parseInt(url.searchParams.get("first") || "10", 10);
  const after = url.searchParams.get("after") || undefined;
  const orderId = url.searchParams.get("orderId") || undefined;
  const minDate = url.searchParams.get("minDate") || undefined;
  const maxDate = url.searchParams.get("maxDate") || undefined;
  const sortOrder = url.searchParams.get("sortOrder") === "DESC";

  const queryFilter = buildOrderQuery({ orderId, minDate, maxDate });

  const response = await storefrontGraphQlRequest(GetCustomerOrdersDocument, {
    customerAccessToken,
    first,
    after,
    query: queryFilter,
    reverse: !sortOrder, // Shopify API: reverse=true for ascending
  });

  return new Response(JSON.stringify(response));
};
