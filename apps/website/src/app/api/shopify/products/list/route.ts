import { storefrontGraphQlRequest } from "@/graphql/shopify";
import {
  GetProductsDocument,
  GetProductsQuery,
  GetProductsQueryVariables,
} from "@/graphql";
import { apiHandler } from "@/helpers/api.handler";

export const GET = apiHandler(
  {
    successMsg: "Products list retrieved successfully",
    errorMsg: "Failed to retrieve products list",
  },
  async ({ req }) => {
    const { searchParams } = req.nextUrl;
    const first = parseInt(searchParams.get("first") || "10", 10);
    const after = searchParams.get("after") || undefined;
    const searchTerm = searchParams.get("searchTerm") || "";
    const productType = searchParams.get("product_type") || "";
    const minPrice = searchParams.get("minPrice") || "";
    const maxPrice = searchParams.get("maxPrice") || "";
    const sortOrder = (searchParams.get("sortOrder") || "DESC").toUpperCase();
    const sortBy = (searchParams.get("sortBy") || "CREATED_AT").toUpperCase();

    const validSortKeys = [
      "TITLE",
      "PRICE",
      "PRODUCT_TYPE",
      "CREATED_AT",
      "BEST_SELLING",
      "VENDOR",
      "UPDATED_AT",
    ];
    const sortKey = validSortKeys.includes(sortBy) ? sortBy : "CREATED_AT";

    // Build search filters
    const filters: string[] = [];
    filters.push("status:active"); // only active products
    filters.push("published_at:*"); // only published products

    if (productType) filters.push(`product_type:${productType}`);
    if (searchTerm) {
      const escaped = searchTerm.replace(/"/g, '\\"');
      filters.push(
        `(title:*${escaped}* OR product_type:*${escaped}* OR tag:*${escaped}*)`
      );
    }
    if (minPrice) filters.push(`variants.price:>=${minPrice}`);
    if (maxPrice) filters.push(`variants.price:<=${maxPrice}`);

    const queryFilter = filters.join(" ");

    const response = await storefrontGraphQlRequest<
      GetProductsQuery,
      GetProductsQueryVariables
    >(GetProductsDocument, {
      first,
      // @ts-expect-error: query key may cause error
      after,
      // @ts-expect-error: query key may cause error
      sortKey,
      reverse: sortOrder.toLowerCase() === "desc",
      query: queryFilter,
    });

    if (response.products?.nodes) {
      return {
        success: true,
        statusCode: 200,
        data: response.products ?? null,
      };
    }
    return {
      success: false,
      statusCode: 500,
      error: {
        type: "internal-server-error",
        message: "Failed to retrieve products list",
        data: null,
      },
    };
  }
);
