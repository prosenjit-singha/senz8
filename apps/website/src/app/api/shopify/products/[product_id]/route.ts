import { NextRequest, NextResponse } from "next/server";
import { shopify, shopifySession } from "@/lib/shopify/shopify.admin";
// import { auth } from "@/lib/auth"; // your BetterAuth setup

export async function GET(req: NextRequest, { params }: { params: { product_id: string } }) {
  try {
    // 1️⃣ Verify admin session
    // const session = await auth.api.getSession({ headers: req.headers });
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    // }

    // 2️⃣ Get product_id from dynamic route
    const { product_id } = params;
    if (!product_id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    // 3️⃣ Fetch single product from Shopify REST API
    const client = new shopify.clients.Rest({ session: shopifySession });
    const response = await client.get({
      path: `products/${product_id}`,
    });

    // 4️⃣ Return product data
    return NextResponse.json(response.body.product);
  } catch (error: any) {
    console.error("Shopify API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
