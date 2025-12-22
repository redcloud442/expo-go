import { authClient } from "@/lib/auth/auth-client";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";

export default function TabLayout() {
  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();

  // ⏳ Wait for session hydration
  if (isPending) return null;

  const avatarUri =
    session?.user?.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      session?.user?.name ?? "User"
    )}`;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.outline,
        tabBarStyle: {
          height: 72,
          paddingBottom: 12,
          paddingTop: 8,
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 20,
          position: "absolute",
          backgroundColor: theme.colors.surface,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Protected guard={!!session}>
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="goals"
          options={{
            title: "Goals",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name={focused ? "medal" : "medal-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        <Tabs.Screen
          name="insights"
          options={{
            title: "Insights",
            tabBarIcon: ({ color, focused }) => (
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name={focused ? "bar-chart" : "bar-chart-outline"}
                  size={24}
                  color={color}
                />
              </View>
            ),
          }}
        />

        {/* 👤 Profile */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profile",
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: "center" }}>
                <Avatar.Image
                  size={30}
                  source={{ uri: avatarUri }}
                  style={{
                    borderWidth: focused ? 2 : 0,
                    borderColor: theme.colors.primary,
                  }}
                />
                {focused && (
                  <View
                    style={{
                      marginTop: 4,
                      width: 6,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: theme.colors.primary,
                    }}
                  />
                )}
              </View>
            ),
          }}
        />
      </Tabs.Protected>
    </Tabs>
  );
}
