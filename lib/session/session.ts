// lib/session.ts
import * as SecureStore from "expo-secure-store";

export async function saveSession(data: {
  accessToken: string;
  refreshToken: string;
  user: any;
}) {
  await SecureStore.setItemAsync("access", data.accessToken);
  await SecureStore.setItemAsync("refresh", data.refreshToken);
  await SecureStore.setItemAsync("user", JSON.stringify(data.user));
}

export async function getSession() {
  const access = await SecureStore.getItemAsync("access");
  const refresh = await SecureStore.getItemAsync("refresh");
  const userRaw = await SecureStore.getItemAsync("user");

  return {
    access,
    refresh,
    user: userRaw ? JSON.parse(userRaw) : null,
  };
}

export async function clearSession() {
  await SecureStore.deleteItemAsync("access");
  await SecureStore.deleteItemAsync("refresh");
  await SecureStore.deleteItemAsync("user");
}
