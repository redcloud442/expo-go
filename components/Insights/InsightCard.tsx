import { AiInsight } from "@/lib/types/types";
import { StyleSheet, View } from "react-native";
import { Card, Icon, Text, useTheme } from "react-native-paper";

export const InsightCard = ({ insight }: { insight: AiInsight | null }) => {
  const theme = useTheme();

  // Handle empty state
  if (!insight) {
    return (
      <Card style={styles.emptyCard} mode="outlined">
        <Card.Content>
          <Text variant="bodyMedium" style={styles.emptyText}>
            Analyze your spending to see AI insights.
          </Text>
        </Card.Content>
      </Card>
    );
  }

  // 1. Map Severity to Colors (Matching your Prisma Enum)
  const getSeverityStyles = () => {
    switch (insight.aiInsight.severity) {
      case "CRITICAL":
        return { color: theme.colors.error, bg: theme.colors.error + "15" };
      case "WARNING":
        return { color: "#FFA500", bg: "#FFA500" + "15" };
      case "INFO":
      default:
        return { color: theme.colors.primary, bg: theme.colors.primary + "15" };
    }
  };

  const { color, bg } = getSeverityStyles();

  // 2. Map Type to Icons (Matching your Prisma Enum)
  const getIcon = () => {
    switch (insight.aiInsight.type) {
      case "BUDGET_WARNING":
        return "alert-decagram";
      case "SAVINGS_OPPORTUNITY":
        return "piggy-bank";
      case "POSITIVE_FEEDBACK":
        return "star-face";
      case "ANOMALY":
        return "lightning-bolt";
      case "SPENDING_TREND":
        return "chart-line";
      default:
        return "lightbulb-on";
    }
  };

  return (
    <Card
      style={[styles.summaryCard, { borderLeftColor: color }]}
      mode="contained"
    >
      <Card.Content style={styles.summaryContent}>
        <View style={[styles.iconCircle, { backgroundColor: bg }]}>
          <Icon source={getIcon()} size={24} color={color} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={styles.cardTitleRow}>
            <Text
              variant="labelLarge"
              style={{ color: color, fontWeight: "800" }}
            >
              {insight.aiInsight.title}
            </Text>
            {insight.aiInsight.confidence && (
              <Text variant="labelSmall" style={styles.confidence}>
                {Math.round(Number(insight.aiInsight.confidence) * 100)}% Match
              </Text>
            )}
          </View>
          <Text variant="bodyMedium" style={styles.messageText}>
            {insight.aiInsight.message}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    borderRadius: 20,
    borderLeftWidth: 6,
    marginVertical: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  emptyCard: {
    borderRadius: 20,
    borderStyle: "dashed",
    marginVertical: 8,
  },
  emptyText: { textAlign: "center", opacity: 0.5 },
  summaryContent: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingVertical: 8,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  confidence: { opacity: 0.4, fontStyle: "italic" },
  messageText: { marginTop: 2, opacity: 0.8, lineHeight: 18 },
});
