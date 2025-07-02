export type RouteError = {
  status: number;
  message: string;
  errors?: unknown[];
};
async function safeFetch<TData>(url: string, init: RequestInit): Promise<TData>;
async function safeFetch<TData>(url: string, init: RequestInit , supressAuthError:boolean): Promise<TData|null>;
async function safeFetch<TData>(
  url: string,
  init: RequestInit,
  supressAuthError: boolean = false,
): Promise<TData | null> {
  try {
    const res = await fetch(`${import.meta.env.VITE_API}/${url}`, {
      mode: "cors",
      ...init,
    });
    const contentType = res.headers.get("Content-Type");
    const isJson = contentType?.includes("application/json");

    const body = isJson ? await res.json().catch(() => null) : null;
    if ((res.status === 401 || res.status === 403) && supressAuthError) {
      return null;
    }

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
