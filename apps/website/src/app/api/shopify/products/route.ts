import { NextRequest, NextResponse } from "next/server";
import { shopifyGraphQlApi } from "@/lib/shopify/shopify.admin";

/**
 * GET /api/shopify/products
 * Fetch paginated and filtered product list from Shopify Admin GraphQL API.
 */
export async function GET(req: NextRequest) {
  try {
    const response = await getAllProducts(req.nextUrl.searchParams);

    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Shopify Products Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products", details: error.message },
      { status: 500 }
    );
  }
}

export const getAllProducts = async (searchParams: URLSearchParams) => {
  const first = parseInt(searchParams.get("first") || "10", 10);
  const after = searchParams.get("after");
  const searchTerm = searchParams.get("searchTerm") || "";
  const productType = searchParams.get("product_type") || "";
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";
  const minPublishedAt = searchParams.get("minPublishedAt") || "";
  const maxPublishedAt = searchParams.get("maxPublishedAt") || "";
  const sortOrder = (searchParams.get("sortOrder") || "DESC").toUpperCase();
  const sortBy = (searchParams.get("sortBy") || "PUBLISHED_AT").toUpperCase();
  const validSortKeys = ["TITLE", "PRICE", "PRODUCT_TYPE", "PUBLISHED_AT"];
  const sortKey = validSortKeys.includes(sortBy) ? sortBy : "PUBLISHED_AT";

  /** Status filter (active/draft/archived) */
  const status = (searchParams.get("status") || "active").toLowerCase();
  const validStatuses = ["active", "archived", "draft"];
  const appliedStatus = validStatuses.includes(status) ? status : "active";

  // Build search filters for Shopify query
  const filters: string[] = [];
  filters.push(`status:${appliedStatus}`);

  if (productType) filters.push(`product_type:${productType}`);
  if (minPublishedAt) filters.push(`published_at:>=${minPublishedAt}`);
  if (maxPublishedAt) filters.push(`published_at:<=${maxPublishedAt}`);
  if (searchTerm) {
    const escaped = searchTerm.replace(/"/g, '\\"');
    filters.push(`(title:*${escaped}* OR product_type:*${escaped}* OR tag:*${escaped}*)`);
  }
  if (minPrice) filters.push(`variants.price:>=${minPrice}`);
  if (maxPrice) filters.push(`variants.price:<=${maxPrice}`);

  const queryFilter = filters.join(" ");

  const QUERY = `
      query GetProducts(
        $first: Int!,
        $after: String,
        $sortKey: ProductSortKeys,
        $reverse: Boolean,
        $query: String
      ) {
        products(first: $first, after: $after, sortKey: $sortKey, reverse: $reverse, query: $query) {
          nodes {
            id
            title
            bodyHtml
            vendor
            productType
            createdAt
            handle
            updatedAt
            publishedAt
            templateSuffix
            tags
            status
            publicationCount
            images(first: 10) {
              edges {
                node {
                  id
                  altText
                  width
                  height
                  url
                }
              }
            }
            options {
              id
              name
              position
              values
            }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    `;
  const variables = {
    first,
    after,
    sortKey,
    reverse: sortOrder?.toLowerCase() === "desc",
    query: queryFilter,
  };

  const response = await shopifyGraphQlApi<any>({
    query: QUERY,
    variables,
  });

  const products = response.data?.products?.nodes?.map((product: any) => ({
    ...product,
    images: product.images?.edges?.map((edge: any) => edge.node) || [],
  }));
  return {
    products,
    pageInfo: response.data?.products?.pageInfo,
  };
};
