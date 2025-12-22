import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { secureStoreAdapter } from "./secure-store";

export const authClient = createAuthClient({
  baseURL: process.env.EXPO_PUBLIC_BETTER_AUTH_URL!, // Base URL of your Better Auth backend.
  plugins: [
    expoClient({
      scheme: "expogo",
      storagePrefix: "expogo",
      storage: secureStoreAdapter,
      cookiePrefix: "expogo",
    }),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
