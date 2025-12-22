import React from "react";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  ProgressBar,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

export default function GoalsSection() {
  const theme = useTheme();

  const MOCK_GOALS = [
    {
      id: "1",
      name: "Emergency Fund",
      target: 5000,
      current: 2500,
      icon: "shield-check",
      color: theme.colors.primary,
    },
    {
      id: "2",
      name: "Japan Vacation",
      target: 3000,
      current: 1200,
      icon: "airplane",
      color: theme.colors.secondary,
    },
    {
      id: "3",
      name: "New Gaming PC",
      target: 1500,
      current: 1400,
      icon: "laptop",
      color: theme.colors.tertiary,
    },
  ];

  const renderGoal = ({ item }: { item: (typeof MOCK_GOALS)[0] }) => {
    const progress = item.current / item.target;
    const remaining = item.target - item.current;

    return (
      <Surface
        elevation={2}
        style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}
      >
        {/* Header */}
        <View style={styles.goalHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.surfaceVariant },
            ]}
          >
            <IconButton icon={item.icon} iconColor={item.color} size={22} />
          </View>

          <View style={styles.goalText}>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.onSurface }}
            >
              {item.name}
            </Text>

            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              ${item.current.toLocaleString()} / ${item.target.toLocaleString()}
            </Text>
          </View>

          <Text
            variant="labelLarge"
            style={{ color: item.color, fontWeight: "700" }}
          >
            {Math.round(progress * 100)}%
          </Text>
        </View>

        {/* Progress */}
        <ProgressBar
          progress={progress}
          color={item.color}
          style={[
            styles.progressBar,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
        />

        {/* Footer */}
        <View style={styles.goalFooter}>
          <Text
            variant="labelSmall"
            style={{ color: theme.colors.onSurfaceVariant }}
          >
            {remaining > 0
              ? `$${remaining.toLocaleString()} left`
              : "Goal reached 🎉"}
          </Text>

          <Button
            mode="contained-tonal"
            compact
            textColor={theme.colors.onSecondaryContainer}
            style={{ borderRadius: 10 }}
            onPress={() => {}}
          >
            Add
          </Button>
        </View>
      </Surface>
    );
  };

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.container}
    >
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text
            variant="titleLarge"
            style={{ color: theme.colors.onBackground, fontWeight: "800" }}
          >
            Savings Goals
          </Text>

          <IconButton
            icon="plus"
            size={22}
            mode="contained-tonal"
            containerColor={theme.colors.primaryContainer}
            iconColor={theme.colors.onPrimaryContainer}
            onPress={() => {}}
          />
        </View>

        <FlatList
          data={MOCK_GOALS}
          renderItem={renderGoal}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    paddingHorizontal: 20,
    gap: 16,
  },
  goalCard: {
    width: 260,
    padding: 16,
    borderRadius: 22,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  iconContainer: {
    borderRadius: 14,
  },
  goalText: {
    flex: 1,
    marginLeft: 12,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  goalFooter: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
