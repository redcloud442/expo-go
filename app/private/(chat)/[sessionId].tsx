import { useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import {
  Avatar,
  IconButton,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

type Message = { id: string; text: string; sender: "user" | "ai" };

export default function ChatScreen() {
  const theme = useTheme();
  const { sessionId } = useLocalSearchParams();
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const flatListRef = useRef<FlatList>(null);

  const SUGGESTIONS = [
    { label: "Analyze my budget", icon: "chart-arc" },
    { label: "Saving for a car", icon: "car" },
    { label: "Debt strategy", icon: "bank" },
  ];

  const handleSend = (text: string = input) => {
    if (!text.trim()) return;

    const newMsg: Message = { id: Date.now().toString(), text, sender: "user" };
    setMessages((prev) => [...prev, newMsg]);
    setInput("");

    // Simulate AI Response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm looking into your finance data now. Based on your current goals...",
        sender: "ai",
      };
      setMessages((prev) => [...prev, aiResponse]);
    }, 1000);
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.sender === "user";
    return (
      <View style={[styles.messageRow, isUser ? styles.userRow : styles.aiRow]}>
        {!isUser && (
          <Avatar.Icon
            size={32}
            icon="robot"
            style={{ backgroundColor: theme.colors.primaryContainer }}
          />
        )}
        <Surface
          style={[
            styles.bubble,
            isUser
              ? {
                  backgroundColor: theme.colors.primary,
                  borderBottomRightRadius: 4,
                }
              : {
                  backgroundColor: theme.colors.elevation.level2,
                  borderBottomLeftRadius: 4,
                },
          ]}
          elevation={isUser ? 2 : 0}
        >
          <Text style={{ color: isUser ? "white" : theme.colors.onSurface }}>
            {item.text}
          </Text>
        </Surface>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {messages.length === 0 ? (
        /* Empty State / Welcome UI */
        <View style={styles.emptyState}>
          <Avatar.Icon size={80} icon="sparkles" style={styles.logo} />
          <Text variant="headlineMedium" style={styles.welcomeText}>
            How can I help?
          </Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map((s, i) => (
              <TouchableRipple
                key={i}
                onPress={() => handleSend(s.label)}
                style={[
                  styles.chip,
                  { borderColor: theme.colors.outlineVariant },
                ]}
              >
                <View style={styles.chipContent}>
                  <IconButton icon={s.icon} size={18} />
                  <Text variant="bodyMedium">{s.label}</Text>
                </View>
              </TouchableRipple>
            ))}
          </View>
        </View>
      ) : (
        /* Active Chat List */
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => flatListRef.current?.scrollToEnd()}
        />
      )}

      {/* Input Area */}
      <Surface style={styles.inputWrapper} elevation={3}>
        <TextInput
          mode="outlined"
          placeholder="Message AI Assistant..."
          value={input}
          onChangeText={setInput}
          style={[
            styles.input,
            { backgroundColor: theme.colors.elevation.level1 },
          ]}
          outlineStyle={{ borderRadius: 28, borderWidth: 0 }}
          multiline
          right={
            <TextInput.Icon
              icon="send-circle"
              size={32}
              color={input ? theme.colors.primary : theme.colors.outline}
              onPress={() => handleSend()}
            />
          }
        />
      </Surface>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  logo: { marginBottom: 20 },
  welcomeText: { fontWeight: "900", marginBottom: 32 },
  suggestions: { width: "100%", gap: 10 },
  chip: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: "hidden",
  },
  chipContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 16,
  },
  listContent: { padding: 16, gap: 16 },
  messageRow: { flexDirection: "row", alignItems: "flex-end", gap: 8 },
  userRow: { alignSelf: "flex-end", flexDirection: "row-reverse" },
  aiRow: { alignSelf: "flex-start" },
  bubble: {
    padding: 12,
    borderRadius: 20,
    maxWidth: "80%",
  },
  inputWrapper: {
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: Platform.OS === "ios" ? 28 : 12,
  },
  input: {
    maxHeight: 120,
  },
});
