import { CategoryCircle } from "@/components/Insights/CategoryCircle";
import { InsightCard } from "@/components/Insights/InsightCard";
import { getAiInsights } from "@/services/finance/financeService";
import React, { useMemo } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { Icon, ProgressBar, Surface, Text, useTheme } from "react-native-paper";

export default function InsightsScreen() {
  const theme = useTheme();

  const { data, isLoading } = getAiInsights();

  const totalSpent = data?.totalSpent ?? 0;
  const budgetLimit = data?.budgetLimit ?? 1;

  // ✅ 2. Calculations using hooks (keep them above the return)
  const progress = useMemo(
    () => Math.min(totalSpent / budgetLimit, 1),
    [totalSpent, budgetLimit]
  );

  // ✅ 3. Only now can you do a conditional return
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator color={theme.colors.primary} />
      </View>
    );
  }

  const percentageUsed = Math.round(progress * 100);

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Spending Insights
        </Text>
        <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
          Current Month Analysis
        </Text>
      </View>

      {/* Main Budget Card */}
      <Surface
        style={[styles.statCard, { backgroundColor: theme.colors.surface }]}
        elevation={1}
      >
        <View style={styles.cardHeader}>
          <Text variant="titleMedium">Monthly Budget</Text>
          <Icon
            source={progress > 0.9 ? "alert-circle" : "trending-up"}
            size={20}
            color={progress > 0.9 ? theme.colors.error : theme.colors.primary}
          />
        </View>

        <View style={styles.amountContainer}>
          <Text variant="displaySmall" style={styles.amountText}>
            ₱{totalSpent.toLocaleString()}
          </Text>
          <Text variant="titleMedium" style={styles.limitText}>
            of ₱{budgetLimit.toLocaleString()}
          </Text>
        </View>

        <ProgressBar
          progress={progress}
          color={progress > 0.9 ? theme.colors.error : theme.colors.primary}
          style={styles.progressBar}
        />

        <View style={styles.infoRow}>
          <Icon
            source="information-outline"
            size={16}
            color={theme.colors.primary}
          />
          <Text variant="bodySmall" style={styles.infoText}>
            You've used <Text style={styles.bold}>{percentageUsed}%</Text> of
            your budget. {data?.daysLeft} days left.
          </Text>
        </View>
      </Surface>

      {/* Top Categories Mapping */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Top Categories
      </Text>
      <View style={styles.categoryRow}>
        {data?.topCategories.map(
          (
            item: {
              categoryName: string;
              categoryColor: string;
              categoryAmount: number;
            },
            index: number
          ) => (
            <CategoryCircle
              key={item.categoryName || index}
              label={item.categoryName || "Other"}
              percent={
                totalSpent > 0
                  ? Math.round(
                      (Number(item.categoryAmount || 0) / totalSpent) * 100
                    )
                  : 0
              }
              color={item.categoryColor || theme.colors.secondary}
            />
          )
        )}
      </View>

      {/* Dynamic AI Insight Card */}
      <Text variant="titleLarge" style={styles.sectionTitle}>
        Latest Insight
      </Text>
      {data?.aiInsight ? (
        <InsightCard insight={data} />
      ) : (
        <Text style={styles.emptyText}>No AI insights generated yet.</Text>
      )}
    </ScrollView>
  );
}

/* -------------------- Styles -------------------- */

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  scrollContent: { padding: 20, paddingTop: 60, paddingBottom: 120 },
  header: { marginBottom: 24 },
  title: { fontWeight: "900", letterSpacing: -0.5 },
  statCard: { padding: 20, borderRadius: 28 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  amountContainer: { flexDirection: "row", alignItems: "baseline", gap: 8 },
  amountText: { fontWeight: "800", letterSpacing: -1 },
  limitText: { opacity: 0.6 },
  progressBar: { height: 10, borderRadius: 5, marginVertical: 16 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 8, opacity: 0.8 },
  infoText: { flex: 1 },
  bold: { fontWeight: "700" },
  sectionTitle: { marginTop: 32, marginBottom: 16, fontWeight: "800" },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 0,
  },
  circleBase: {
    width: 85,
    height: 85,
    borderRadius: 43,
    borderWidth: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  progressArc: {
    position: "absolute",
    width: 85,
    height: 85,
    borderRadius: 43,
    borderWidth: 6,
    borderColor: "transparent",
    transform: [{ rotate: "45deg" }],
  },
  percentText: { fontWeight: "bold" },
  categoryLabel: {
    marginTop: 10,
    fontWeight: "600",
    opacity: 0.7,
    textAlign: "center",
  },
  summaryCard: { borderRadius: 24, borderLeftWidth: 6 },
  summaryContent: { flexDirection: "row", gap: 16, alignItems: "center" },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: { opacity: 0.5, textAlign: "center", marginTop: 10 },
});
