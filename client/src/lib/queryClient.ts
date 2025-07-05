import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  let fetchUrl = url;
  if (url.startsWith("/api/poster/")) {
    const id = url.substring("/api/poster/".length);
    fetchUrl = `/.netlify/functions/poster?id=${id}`;
  } else if (url.startsWith("/api/user-usage/")) {
    const userId = url.substring("/api/user-usage/".length);
    fetchUrl = `/.netlify/functions/user-usage?userId=${userId}`;
  }

  const res = await fetch(fetchUrl, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    let fetchUrl = queryKey[0] as string;
    
    // Handle dynamic routes for GET requests too
    if (fetchUrl.startsWith("/api/poster/")) {
      const id = fetchUrl.substring("/api/poster/".length);
      fetchUrl = `/.netlify/functions/poster?id=${id}`;
    } else if (fetchUrl.startsWith("/api/user-usage/")) {
      const userId = fetchUrl.substring("/api/user-usage/".length);
      fetchUrl = `/.netlify/functions/user-usage?userId=${userId}`;
    }
    
    const res = await fetch(fetchUrl, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
