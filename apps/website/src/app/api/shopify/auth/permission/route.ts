import { NextResponse } from "next/server";
import { allScopes } from "@/constants/shopify.const";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shop = searchParams.get("shop");

  if (!shop) {
    return NextResponse.json({ error: "Missing shop" }, { status: 400 });
  }

  const redirectUri = `${process.env.SHOPIFY_APP_URL}/api/shopify/auth/approved`;
  const state = crypto.randomUUID();

  const installUrl = new URL(`https://${shop}/admin/oauth/authorize`);
  installUrl.searchParams.set("client_id", process.env.SHOPIFY_API_KEY!);
  installUrl.searchParams.set("scope", allScopes.join(","));
  installUrl.searchParams.set("redirect_uri", redirectUri);
  installUrl.searchParams.set("state", state);

  return NextResponse.redirect(installUrl.toString());
}
