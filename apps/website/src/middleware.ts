// import { auth } from "./auth";
import { NextRequest } from "next/server";
import { isRouteMatch } from "./helpers/pathname.helper";
import {
  DEFAULT_LOGIN_REDIRECT,
  AUTH_API_PREFIX,
  AUTH_ROUTES_OBJ,
  AUTH_ROUTES_ARRAY,
  PUBLIC_ROUTES,
} from "./lib/auth/auth.const";
import { getSession } from "./lib/auth/auth.session";

export default async function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const { pathname, searchParams } = nextUrl;
  const isAuthApiRoute = pathname.startsWith(AUTH_API_PREFIX);
  const isPublicRoute = PUBLIC_ROUTES.some((template) => isRouteMatch(template, pathname));

  const isAuthRoute = AUTH_ROUTES_ARRAY.includes(pathname);
  // do not do anything
  if (isAuthApiRoute) return;
  const session = await getSession();

  console.log("Session", session);

  if (isAuthRoute) {
    if (session) {
      let callbackUrl = searchParams.get("callbackUrl");
      if (callbackUrl) {
        callbackUrl = decodeURIComponent(callbackUrl);
      } else {
        callbackUrl = DEFAULT_LOGIN_REDIRECT;
      }
      console.log(`User [${session.user.id}] has already logged in. Redirecting to ${callbackUrl}`);
      return Response.redirect(new URL(callbackUrl, nextUrl));
    }
    return;
  }

  //  handle protected routes
  if (!session && !isPublicRoute) {
    console.log(
      `${pathname} is protected. User is not logged in. Redirecting to ${AUTH_ROUTES_OBJ.signIn}`
    );
    const callbackUrl = encodeURIComponent(pathname);
    return Response.redirect(
      new URL(`${AUTH_ROUTES_OBJ.signIn}?callbackUrl=${callbackUrl}`, nextUrl)
    );
  }
  return;
}
// Optionally, don't invoke Middleware on some paths
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
  unstable_allowDynamic: [
    // use a glob to allow anything in the function-bind 3rd party module
    "./node_modules/mui/utils/esm/ponyfillGlobal.js",
  ],
};
