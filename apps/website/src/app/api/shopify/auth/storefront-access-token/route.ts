import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { createStorefrontAccessToken } from "@/lib/shopify/shopify.admin";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    const result = await createStorefrontAccessToken("Localhost");

    return NextResponse.json({
      success: true,
      statusCode: 201,
      data: result,
      message: "Storefront access token created successfully",
    } as IApiSuccessResponse);
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      statusCode: 500,
      data: null,
      message: "Failed to create storefront access token",
      error: {
        type: "internal-server-error",
        message: error.message || "unknown",
      },
    } as IApiFailedResponse);
  }
};
