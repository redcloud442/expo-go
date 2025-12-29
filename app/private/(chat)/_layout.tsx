import { useLocalSearchParams, useRouter } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { StyleSheet, View } from "react-native";
import {
  Divider,
  IconButton,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ChatLayout() {
  const theme = useTheme();

  return (
    <Drawer
      drawerContent={(props: any) => <CustomChatDrawer {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: theme.colors.surface },
        headerTintColor: theme.colors.onSurface,
        drawerStyle: {
          width: "85%",
          borderTopRightRadius: 28,
          borderBottomRightRadius: 28,
        },
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Drawer.Screen
        name="[sessionId]"
        options={{
          title: "AI Financial Assistant",
        }}
      />

      <Drawer.Screen
        name="new"
        options={{
          title: "New Chat",
        }}
      />
    </Drawer>
  );
}

function CustomChatDrawer() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { sessionId } = useLocalSearchParams();

  const sessions = [
    { id: "1", title: "Emergency Fund Advice", date: "2m ago" },
    { id: "2", title: "Japan Trip Budgeting", date: "1h ago" },
  ];

  return (
    <View
      style={[
        styles.drawerRoot,
        {
          backgroundColor: theme.colors.surface,
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 20,
        },
      ]}
    >
      {/* Header Section */}
      <View style={styles.headerContainer}>
        <Text variant="headlineSmall" style={styles.drawerHeader}>
          History
        </Text>
        <IconButton
          icon="sparkles"
          iconColor={theme.colors.primary}
          size={24}
        />
      </View>

      {/* New Chat Action */}
      <TouchableRipple
        onPress={() => router.push("/private/(chat)/new")}
        style={[
          styles.newChatBtn,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
        borderless
      >
        <View style={styles.newChatContent}>
          <IconButton
            icon="plus"
            size={20}
            iconColor={theme.colors.onPrimaryContainer}
          />
          <Text
            variant="labelLarge"
            style={{ color: theme.colors.onPrimaryContainer }}
          >
            New Consultation
          </Text>
        </View>
      </TouchableRipple>

      <Divider style={styles.divider} />

      {/* Sessions List */}
      <View style={styles.sessionList}>
        {sessions.map((s) => {
          const isActive = sessionId === s.id;
          return (
            <TouchableRipple
              key={s.id}
              onPress={() => router.replace(`/private/(chat)/[sessionId]`)}
              style={[
                styles.sessionItem,
                isActive && {
                  backgroundColor: theme.colors.secondaryContainer,
                },
              ]}
              borderless
            >
              <View style={styles.sessionInner}>
                <View style={{ flex: 1 }}>
                  <Text
                    variant="bodyMedium"
                    numberOfLines={1}
                    style={{ fontWeight: isActive ? "700" : "400" }}
                  >
                    {s.title}
                  </Text>
                  <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                    {s.date}
                  </Text>
                </View>
                <IconButton icon="dots-vertical" size={16} onPress={() => {}} />
              </View>
            </TouchableRipple>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerRoot: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  drawerHeader: {
    fontWeight: "900",
  },
  newChatBtn: {
    borderRadius: 16,
    marginBottom: 10,
  },
  newChatContent: {
    flexDirection: "row",
    alignItems: "center",
    height: 56,
  },
  divider: {
    marginVertical: 15,
    opacity: 0.5,
  },
  sessionList: {
    flex: 1,
    gap: 4,
  },
  sessionItem: {
    borderRadius: 12,
    paddingLeft: 8,
  },
  sessionInner: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});
