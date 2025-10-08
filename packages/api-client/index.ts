export type ApiError = {
  status: number;
  statusText: string;
  message: string;
};

export type ApiResponse<T> = {
  success: boolean;
  data: T | null;
  error: ApiError | null;
};

const isBrowser = () =>
  typeof window !== "undefined" && typeof document !== "undefined";

const isJsonLike = (v: unknown) =>
  v !== undefined &&
  v !== null &&
  typeof v !== "string" &&
  !(v instanceof FormData) &&
  !(v instanceof Blob) &&
  !(v instanceof ArrayBuffer);

function buildUrl(base: string, path: string) {
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/+$/, "")}/${path.replace(/^\/+/, "")}`;
}

function mergeHeaders(
  ...all: Array<HeadersInit | undefined>
): Record<string, string> {
  const out: Record<string, string> = { "Content-Type": "application/json" };
  for (const h of all) {
    if (!h) continue;
    if (Array.isArray(h)) {
      for (const [k, v] of h) out[k] = v as string;
    } else if (h instanceof Headers) {
      h.forEach((v, k) => (out[k] = v));
    } else {
      Object.assign(out, h);
    }
  }
  return out;
}

export class ApiClient {
  constructor(
    private baseUrl: string,
    private defaultInit?: RequestInit
  ) {
    this.baseUrl = baseUrl.replace(/\/+$/, "");
  }

  async fetch<T = unknown>(path: string, init: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const url = buildUrl(this.baseUrl, path);
      const headers = mergeHeaders(this.defaultInit?.headers, init.headers);
      const credentials =
        init.credentials ??
        this.defaultInit?.credentials ??
        (isBrowser() ? "include" : "omit");

      // Choose a body: init.body wins; else defaultInit.body
      let body: BodyInit | undefined = (init.body ?? this.defaultInit?.body) as BodyInit | undefined;

      // Auto-JSON stringify when appropriate
      const ct = headers["Content-Type"] || headers["content-type"] || "";
      if (isJsonLike(body) && ct.toLowerCase().includes("application/json")) {
        body = JSON.stringify(body);
      }

      const res = await fetch(url, {
        ...this.defaultInit,
        ...init,
        headers,
        credentials,
        body,
      });

      if (!res.ok) {
        return {
          success: false,
          data: null,
          error: {
            status: res.status,
            statusText: res.statusText,
            message: `API error: ${res.status} ${res.statusText}`,
          },
        };
      }

      if (res.status === 204) {
        return { success: true, data: null, error: null };
      }

      const text = await res.text();
      if (!text.trim()) return { success: true, data: null, error: null };

      let data: T | null;
      try {
        data = JSON.parse(text) as T;
      } catch {
        // Not JSON — return raw text as T
        data = text as unknown as T;
      }

      return { success: true, data, error: null };
    } catch (e: any) {
      return {
        success: false,
        data: null,
        error: {
          status: -1,
          statusText: "FetchError",
          message: e?.message || "Unknown error",
        },
      };
    }
  }

  get<T = unknown>(path: string, init: RequestInit = {}) {
    return this.fetch<T>(path, { ...init, method: "GET" });
  }

  post<T = unknown>(path: string, body?: unknown, init: RequestInit = {}) {
    return this.fetch<T>(path, { ...init, method: "POST", body: body as any });
  }

  put<T = unknown>(path: string, body?: unknown, init: RequestInit = {}) {
    return this.fetch<T>(path, { ...init, method: "PUT", body: body as any });
  }

  patch<T = unknown>(path: string, body?: unknown, init: RequestInit = {}) {
    return this.fetch<T>(path, { ...init, method: "PATCH", body: body as any });
  }

  delete<T = unknown>(path: string, init: RequestInit = {}) {
    return this.fetch<T>(path, { ...init, method: "DELETE" });
  }
}