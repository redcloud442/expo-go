import { authClient } from "@/lib/auth/auth-client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { router, Stack, useNavigationContainerRef } from "expo-router";
import * as React from "react";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  MD2Colors,
  MD3DarkTheme,
  PaperProvider,
} from "react-native-paper";
import Toast from "react-native-toast-message";

const queryClient = new QueryClient();

const theme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: "#BB86FC",
    secondary: "#03DAC6",
  },
};

export default function MainLayout() {
  const { data: session, isPending } = authClient.useSession();

  const navContainerRef = useNavigationContainerRef();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // 🔐 Auth state + routing
  useEffect(() => {
    if (!navContainerRef.isReady()) return;

    if (session) {
      setIsAuthenticated(true);
      router.replace("/private/(tabs)/home");
    } else {
      setIsAuthenticated(false);
    }
  }, [session]);

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={theme}>
        {/* Loading Indicator */}
        {isPending && (
          <ActivityIndicator
            style={{ marginBottom: 16 }}
            animating
            color={MD2Colors.red800}
          />
        )}

        {/* Navigation Stack */}
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={!isAuthenticated}>
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="index" />
          </Stack.Protected>

          <Stack.Protected guard={isAuthenticated}>
            <Stack.Screen name="private/(tabs)/home" />
            <Stack.Screen name="private/(chat)/chat" />
          </Stack.Protected>
        </Stack>

        <Toast />
      </PaperProvider>
    </QueryClientProvider>
  );
}
