import { useRouter } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Avatar,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export default function NewChatScreen() {
  const theme = useTheme();
  const router = useRouter();

  const SUGGESTED_PROMPTS = [
    "How much can I spend this week?",
    "Review my subscription goals",
    "How do I save for a new laptop?",
    "Explain my spending in Food",
  ];

  const startChat = (prompt: string) => {
    // Logic: Create session in DB, then navigate
    const id = "temp-" + Date.now();
    router.push({
      pathname: `/private/(chat)/[sessionId]`,
      params: { sessionId: id, initialMessage: prompt }, // Pass the prompt to the actual chat screen
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Avatar.Icon size={80} icon="robot-confused-outline" />
          <Text variant="headlineMedium" style={styles.title}>
            Financial AI
          </Text>
          <Text variant="bodyLarge" style={styles.subtitle}>
            Ask me anything about your spending, goals, or budget.
          </Text>
        </View>

        <View style={styles.grid}>
          {SUGGESTED_PROMPTS.map((prompt, index) => (
            <TouchableRipple
              key={index}
              onPress={() => startChat(prompt)}
              style={[
                styles.card,
                { backgroundColor: theme.colors.surfaceVariant },
              ]}
              borderless
            >
              <Text variant="bodyMedium">{prompt}</Text>
            </TouchableRipple>
          ))}
        </View>
      </ScrollView>

      {/* Persistent Input at bottom */}
      <Surface style={styles.footer} elevation={1}>
        <TextInput
          placeholder="Type your first message..."
          mode="outlined"
          outlineStyle={{ borderRadius: 30 }}
          right={
            <TextInput.Icon
              icon="arrow-up-circle"
              onPress={() => startChat("New Chat")}
            />
          }
        />
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 24, paddingTop: 60 },
  hero: { alignItems: "center", marginBottom: 40 },
  title: { fontWeight: "900", marginTop: 16 },
  subtitle: { textAlign: "center", opacity: 0.7, marginTop: 8 },
  grid: { gap: 12 },
  card: { padding: 16, borderRadius: 16 },
  footer: { padding: 16, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
});
