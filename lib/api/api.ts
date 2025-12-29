// lib/api.ts
import { authClient } from "../auth/auth-client";

type ApiOptions = RequestInit & {
  headers?: Record<string, string>;
};

const BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL!;

export const api = async <T = unknown>(
  path: string,
  options: ApiOptions = {}
): Promise<T> => {
  const cookies = authClient.getCookie();

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers ?? {}),
  } as Record<string, string>;

  if (cookies) {
    headers.Cookie = cookies;
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "omit", // REQUIRED per Better Auth docs
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(
      `API Error ${response.status}: ${text || response.statusText}`
    );
  }

  // auto-handle empty responses
  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as unknown as T;
};
