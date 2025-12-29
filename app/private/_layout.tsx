import { authClient } from "@/lib/auth/auth-client";
import { useQueryClient } from "@tanstack/react-query";
import { Slot } from "expo-router";
import { useState } from "react";
import { RefreshControl, ScrollView } from "react-native";
import { MD2Colors } from "react-native-paper";

export default function PrivateLayout() {
  const queryClient = useQueryClient();
  const { isPending, refetch: refetchSession } = authClient.useSession();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    if (isPending) return;

    setRefreshing(true);
    try {
      await Promise.all([
        refetchSession(), // refresh auth
        queryClient.invalidateQueries(), // refresh all queries
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      bounces={false} // 👈 iOS: reduce sensitivity
      contentContainerStyle={{
        flexGrow: 1,
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          enabled={!isPending} // 👈 prevent accidental refresh
          tintColor={MD2Colors.red800}
          progressViewOffset={80} // 👈 Android: pull further
        />
      }
    >
      <Slot />
    </ScrollView>
  );
}
