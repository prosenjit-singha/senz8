import { apiHandler } from "@/helpers/api.handler";
import { getShopDetails } from "@/services/shopify/shopify-shop.service";

export const GET = apiHandler(
  {
    successMsg: "Shop details fetched successfully",
    errorMsg: "Failed to fetch shop details",
  },
  async () => {
    const result = await getShopDetails();

    if (result.shop) {
      return {
        success: true,
        statusCode: 200,
        data: result.shop,
      };
    }
    return {
      success: false,
      statusCode: 500,
      error: {
        type: "bad-request",
        message: "Failed to fetch shop details",
      },
    };
  }
);
