import { authClient } from "@/lib/auth/auth-client";
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

  useEffect(() => {
    if (session) {
      setIsAuthenticated(true);
      if (navContainerRef.isReady()) {
        router.push("/private/(tabs)/home");
      }
    }
  }, [isAuthenticated, navContainerRef.isReady()]);

  return (
    <PaperProvider theme={theme}>
      <ActivityIndicator animating={isPending} color={MD2Colors.red800} />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isAuthenticated}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="index" />
        </Stack.Protected>

        <Stack.Protected guard={isAuthenticated}>
          <Stack.Screen name="private/(tabs)/home" />
        </Stack.Protected>
      </Stack>
      <Toast />
    </PaperProvider>
  );
}
