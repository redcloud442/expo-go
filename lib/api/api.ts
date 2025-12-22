// lib/api.ts
import axios from "axios";
import { clearSession, getSession, saveSession } from "../session/session";

export const api = axios.create({
  baseURL: process.env.BETTER_AUTH_URL,
});

api.interceptors.request.use(async config => {
  const { access } = await getSession();
  if (access) {
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
});

api.interceptors.response.use(
  res => res,
  async error => {
    if (error.response?.status === 401) {
      const session = await getSession();
      if (!session.refresh) {
        await clearSession();
        throw error;
      }

      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/auth/refresh`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: session.refresh }),
        }
      );

      if (!res.ok) {
        await clearSession();
        throw error;
      }

      const data = await res.json();
      await saveSession(data);

      error.config.headers.Authorization =
        `Bearer ${data.accessToken}`;

      return api.request(error.config);
    }

    throw error;
  }
);
