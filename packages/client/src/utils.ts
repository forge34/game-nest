export type RouteError = {
  status: number;
  message: string;
  errors?: unknown[];
};
async function safeFetch<TData>(url: string, init: RequestInit): Promise<TData>;
async function safeFetch<TData>(
  url: string,
  init: RequestInit,
  supressAuthError: boolean,
): Promise<TData | null>;
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

export const ratingOrganizations: Record<number, string> = {
  1: "ESRB",
  2: "PEGI",
  3: "CERO",
  4: "USK",
  5: "GRAC",
  6: "CLASSIND",
  7: "ACB",
};

export const ratingCategories: Record<number, string> = {
  1: "3+",
  2: "7+",
  3: "12+",
  4: "16+",
  5: "18+",
  6: "RP (Rating Pending)",
  7: "EC (Early Childhood)",
  8: "E (Everyone)",
  9: "E10+",
  10: "T (Teen)",
  11: "M (Mature)",
  12: "AO (Adults Only)",
};

export { safeFetch };
