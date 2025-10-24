/**
 * An array of routes that are accessible to the public
 * These routes do not require authentication
 * you can use ':' for dynamic routes like /products/:product-id
 * @type {string[]}
 */
export const PUBLIC_ROUTES: string[] = [
  "/",
  "/products",
  "/products/:product-id",
  "/cart",
  "/about-us",
  "/contact-us",
  "/terms-and-conditions",
  "/privacy-policies",
];

type PageOptions = {
  signIn: string;
  signOut: string; // '/auth/signout';
  error: string; // '/auth/error';
  verifyRequest: string; // '/auth/login',
  newUser: string; // '/auth/new-user';
  resetPassword: string;
};

export const AUTH_ROUTES_OBJ: Partial<PageOptions> = {
  signIn: "/auth/sign-in",
  resetPassword: "/auth/reset-password",
};

/**
 * An array of routes that are used for authentication
 * These routes will redirect users to the dashboard
 * @type {string[]}
 */
export const AUTH_ROUTES_ARRAY: string[] = [
  AUTH_ROUTES_OBJ.signIn!,
  AUTH_ROUTES_OBJ.resetPassword!,
];

/**
 * The prefix for API authentication routes
 * @type {string}
 */
export const AUTH_API_PREFIX: string = "/api/auth";

/**
 * Default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT = "/";
