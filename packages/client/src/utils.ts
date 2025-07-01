export type RouteError = {
  status: number;
  message: string;
  errors?: unknown[];
};

async function safeFetch<TData>(
  url: string,
  init: RequestInit,
): Promise<TData> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API}/${url}`, {
      mode: "cors",
      ...init,
    });
    const contentType = res.headers.get("Content-Type");
    const isJson = contentType?.includes("application/json");

    const body = isJson ? await res.json().catch(() => null) : null;

    if (!res.ok || body === null) {
      throw {
        status: res.status,
        message: body?.message || res.statusText || "Request failed",
        errors: body?.errors,
      } satisfies RouteError;
    }

    return body as TData;
  } catch {
    throw {
      status: 503,
      message: "Server is unreachable. Please try again later.",
    } satisfies RouteError;
  }
}

export { safeFetch };
