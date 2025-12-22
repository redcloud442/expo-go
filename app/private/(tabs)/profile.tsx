import { authClient } from "@/lib/auth/auth-client";
import { router } from "expo-router";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Card,
  Divider,
  List,
  Text,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const theme = useTheme();
  const { data: session, isPending } = authClient.useSession();

  if (isPending) return null;
  if (!session) return null;

  const user = session.user;

  const handleLogout = async () => {
    await authClient.signOut();
    Toast.show({
      type: "success",
      text1: "Signed out",
    });
    router.replace("/");
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Image
          size={88}
          source={{
            uri:
              user.image ||
              `https://ui-avatars.com/api/?name=${user.name}&background=0D8ABC&color=fff`,
          }}
        />

        <Text variant="titleLarge" style={styles.name}>
          {user.name}
        </Text>

        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          {user.email}
        </Text>
      </View>

      {/* Account Info */}
      <Card style={styles.card}>
        <Card.Title title="Account Information" />
        <Divider />

        <List.Item
          title="Email Verified"
          description={user.emailVerified ? "Yes" : "No"}
          left={(props) => <List.Icon {...props} icon="email-check-outline" />}
        />
      </Card>

      {/* Actions */}
      <Card style={styles.card}>
        <Card.Title title="Actions" />
        <Divider />

        <List.Item
          title="Sign out"
          left={(props) => <List.Icon {...props} icon="logout" />}
          onPress={handleLogout}
        />
      </Card>

      {/* Footer spacing */}
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 24,
  },
  name: {
    marginTop: 12,
    fontWeight: "600",
  },
  card: {
    marginBottom: 16,
    borderRadius: 14,
    overflow: "hidden",
  },
});
