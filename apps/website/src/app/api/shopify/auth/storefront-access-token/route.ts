import { connectDB } from "@/helpers/db.helper";
import { IApiFailedResponse, IApiSuccessResponse } from "@/interfaces";
import { createStorefrontAccessToken } from "@/lib/shopify/shopify.admin";
import { StorefrontAccessToken } from "@/models/storefront-access-token";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
  try {
    await connectDB();
    const result = await createStorefrontAccessToken("Localhost");

    // console.log(result);

    if (
      (result as any)?.data?.storefrontAccessTokenCreate?.storefrontAccessToken
    ) {
      const shop = (result as any)?.data?.storefrontAccessTokenCreate?.shop;
      const storefrontAccessToken = (result as any)?.data
        ?.storefrontAccessTokenCreate?.storefrontAccessToken;
      await StorefrontAccessToken.create({
        shopId: shop.id,
        title: storefrontAccessToken.title,
        accessToken: storefrontAccessToken.accessToken,
      });
    }

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
