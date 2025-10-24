import { shopify } from "@/lib/shopify/shopify.admin";
import { NextRequest, NextResponse } from "next/server";
import { Session } from "@shopify/shopify-api";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");
  const code = searchParams.get("code");

  if (!shop || !code) {
    return NextResponse.json({ error: "Missing shop or code" }, { status: 400 });
  }

  // Exchange code for offline token
  const tokenRes = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY!,
      client_secret: process.env.SHOPIFY_API_SECRET!,
      code,
    }),
  });

  const data = await tokenRes.json();

  console.log("Approved response:", data);

  // Create a proper Session instance
  const session = new Session({
    id: `offline_${shop}`, // unique session ID
    shop, // shop domain
    state: "offline", // optional state string
    isOnline: false, // offline token
    accessToken: data.access_token, // token returned from Shopify
    scope: data.scope, // scopes string
  });
  // Store the session in your MongoDB session storage
  await shopify.config.sessionStorage.storeSession(session);
  const redirectUrl = `${process.env.SHOPIFY_APP_URL}/admin/auth/session/success?shop=${shop}`;

  return NextResponse.redirect(redirectUrl);
}
