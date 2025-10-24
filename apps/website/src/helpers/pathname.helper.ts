/**
 * Matches a route path against a template and extracts params.
 *
 * @param routeTemplate - The route template (e.g. "/contacts/:contactId/mobiles/:mobileNo")
 * @param routePath - The actual path to check (e.g. "/contacts/001/mobiles/1232")
 * @returns Object { match: boolean, params?: Record<string,string> }
 */
export function isRouteMatch(
  routeTemplate: string,
  routePath: string
): { match: boolean; params: Record<string, string>; path: string } {
  const cleanPath = routePath.split("?")[0];

  const templateSegments = routeTemplate.split("/").filter(Boolean);
  const pathSegments = cleanPath.split("/").filter(Boolean);

  if (templateSegments.length !== pathSegments.length) {
    return { match: false, path: cleanPath, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < templateSegments.length; i++) {
    const template = templateSegments[i];
    const actual = pathSegments[i];

    if (template.startsWith(":")) {
      params[template.slice(1)] = actual;
    } else if (template !== actual) {
      return { match: false, path: cleanPath, params: {} };
    }
  }

  return { match: true, path: cleanPath, params };
}
