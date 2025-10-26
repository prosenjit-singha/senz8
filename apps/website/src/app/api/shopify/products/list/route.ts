import { getAllProducts } from "../route";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    console.log(
      "process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN",
      process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
    );
    const { searchParams } = req.nextUrl;
    searchParams.set("status", "active");

    const response = await getAllProducts(searchParams);
    return NextResponse.json(response);
  } catch (error: any) {
    console.error("Shopify request failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
