type FetcherConfig = {
  baseURL?: string;
  headers?: Record<string, string>;
};

type FetcherRequestInit = RequestInit & { path?: string };

export const createFetcher = (config: FetcherConfig) => {
  const baseURL = config.baseURL?.replace(/\/$/, ""); // remove trailing slash
  const defaultHeaders = config.headers || {};

  // internal helper to build full URL
  const buildURL = (pathOrURL: string | URL) => {
    if (typeof pathOrURL === "string" && !pathOrURL.startsWith("http")) {
      return `${baseURL || ""}/${pathOrURL.replace(/^\//, "")}`;
    }
    return pathOrURL.toString();
  };

  // generic request method
  const request = async <T>(
    pathOrURL: string | URL,
    init?: FetcherRequestInit
  ): Promise<T> => {
    const url = buildURL(pathOrURL);
    const mergedHeaders = { ...defaultHeaders, ...init?.headers };
    const res = await fetch(url, { ...init, headers: mergedHeaders });

    const contentType = res.headers.get("Content-Type") || "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : await res.text();

    if (!res.ok) {
      throw data;
    }
    return data as T;
  };

  // convenience methods
  return {
    get: <T>(pathOrURL: string | URL, init?: FetcherRequestInit) =>
      request<T>(pathOrURL, { ...init, method: "GET" }),
    post: <T>(pathOrURL: string | URL, body?: any, init?: FetcherRequestInit) =>
      request<T>(pathOrURL, {
        ...init,
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
        headers: { "Content-Type": "application/json", ...init?.headers },
      }),
    put: <T>(pathOrURL: string | URL, body?: any, init?: FetcherRequestInit) =>
      request<T>(pathOrURL, {
        ...init,
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
        headers: { "Content-Type": "application/json", ...init?.headers },
      }),
    patch: <T>(
      pathOrURL: string | URL,
      body?: any,
      init?: FetcherRequestInit
    ) =>
      request<T>(pathOrURL, {
        ...init,
        method: "PATCH",
        body: body ? JSON.stringify(body) : undefined,
        headers: { "Content-Type": "application/json", ...init?.headers },
      }),
    delete: <T>(pathOrURL: string | URL, init?: FetcherRequestInit) =>
      request<T>(pathOrURL, { ...init, method: "DELETE" }),
  };
};
