import { QueryFunction } from "@tanstack/react-query";

export type UnauthorizedBehavior = "returnNull" | "throw";
type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

function throwIfResNotOk(response: Response) {
  if (!response.ok) {
    return response
      .json()
      .then((data) => {
        throw new Error(`${response.status}: ${JSON.stringify(data)}`);
      })
      .catch((e) => {
        // If JSON parsing fails, throw the original error
        if (!(e instanceof SyntaxError)) {
          throw e;
        }
        throw new Error(`${response.status}: ${response.statusText}`);
      });
  }
  return response;
}

export async function apiRequest<T>(method: HttpMethod, url: string, data?: any): Promise<T> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  // Log request data for debugging
  if (data) {
    console.log(`API Request to ${url}:`, JSON.stringify(data));
  }

  const response = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  const checkedResponse = await throwIfResNotOk(response);

  // For empty responses or non-JSON responses
  if (response.status === 204 || response.headers.get("Content-Length") === "0") {
    return {} as T;
  }

  return checkedResponse.json();
}

export const getQueryFn =
  <T>({ on401: unauthorizedBehavior }: { on401: UnauthorizedBehavior }): QueryFunction<T> =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return res.json();
  };
