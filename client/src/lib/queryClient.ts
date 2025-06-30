import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth, hasFirebaseConfig } from "./firebase";

const API_BASE_URL = "/";

export const apiRequest = async (
  method: string,
  endpoint: string,
  body?: any
): Promise<Response> => {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint.slice(1) : endpoint}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Add user authentication header
  if (hasFirebaseConfig && auth?.currentUser) {
    headers['x-user-id'] = auth.currentUser.uid;
  } else {
    // For demo mode, get user from localStorage
    const demoUser = localStorage.getItem('demoUser');
    if (demoUser) {
      const userData = JSON.parse(demoUser);
      headers['x-user-id'] = userData.id || userData.firebaseUid;
    }
  }

  const options: RequestInit = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  return fetch(url, options);
};

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
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