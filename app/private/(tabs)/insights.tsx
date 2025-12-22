import { ScrollView, StyleSheet, View } from "react-native";
import { ProgressBar, Surface, Text, useTheme } from "react-native-paper";

export default function InsightsScreen() {
  const theme = useTheme();

  return (
    <ScrollView
      style={{ backgroundColor: theme.colors.background }}
      contentContainerStyle={styles.scrollContent} // Applied padding here instead
    >
      <Text
        variant="headlineSmall"
        style={[styles.title, { color: theme.colors.onBackground }]}
      >
        Spending Insights
      </Text>

      {/* Main Budget Card */}
      <Surface
        style={[
          styles.statCard,
          { backgroundColor: theme.colors.surfaceVariant },
        ]}
        elevation={0}
      >
        <Text
          variant="titleMedium"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Monthly Limit
        </Text>
        <Text
          variant="displaySmall"
          style={[styles.amountText, { color: theme.colors.onSurfaceVariant }]}
        >
          $1,240{" "}
          <Text variant="titleLarge" style={{ opacity: 0.5 }}>
            / $2,000
          </Text>
        </Text>

        <ProgressBar
          progress={0.62}
          color={theme.colors.primary}
          style={styles.progressBar}
        />

        <View style={styles.infoRow}>
          <Text variant="bodySmall" style={{ color: theme.colors.outline }}>
            You have{" "}
            <Text style={{ color: theme.colors.primary, fontWeight: "bold" }}>
              38%
            </Text>{" "}
            left for 12 days.
          </Text>
        </View>
      </Surface>

      <Text
        variant="titleLarge"
        style={[styles.sectionTitle, { color: theme.colors.onBackground }]}
      >
        Top Categories
      </Text>

      {/* Category Row with Theme Colors */}
      <View style={styles.categoryRow}>
        <CategoryCircle
          label="Food"
          percent={40}
          color={theme.colors.primary}
        />
        <CategoryCircle
          label="Transport"
          percent={25}
          color={theme.colors.secondary}
        />
        <CategoryCircle
          label="Entertain."
          percent={15}
          color={theme.colors.tertiary}
        />
      </View>

      {/* Added a simple summary list for extra detail */}
      <Surface
        style={[
          styles.summaryCard,
          { borderColor: theme.colors.outlineVariant },
        ]}
        elevation={0}
      >
        <Text variant="labelLarge" style={{ color: theme.colors.primary }}>
          Insight of the week
        </Text>
        <Text variant="bodyMedium">
          You spent 12% less on Food compared to last week. Great job!
        </Text>
      </Surface>
    </ScrollView>
  );
}

const CategoryCircle = ({ label, percent, color }: any) => {
  const theme = useTheme();
  return (
    <View style={{ alignItems: "center" }}>
      <View
        style={[
          styles.circleBase,
          {
            borderColor: color,
            backgroundColor: theme.colors.elevation.level1,
          },
        ]}
      >
        <Text
          variant="labelLarge"
          style={{ fontWeight: "bold", color: theme.colors.onSurface }}
        >
          {percent}%
        </Text>
      </View>
      <Text
        variant="labelSmall"
        style={{ marginTop: 8, fontWeight: "600", color: theme.colors.outline }}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100, // Space for the floating tab bar
  },
  title: { fontWeight: "900", marginBottom: 20, letterSpacing: -0.5 },
  statCard: {
    padding: 24,
    borderRadius: 28,
  },
  amountText: {
    marginVertical: 12,
    fontWeight: "bold",
    letterSpacing: -1,
  },
  progressBar: {
    height: 12,
    borderRadius: 6,
    marginTop: 8,
  },
  infoRow: { marginTop: 16 },
  sectionTitle: {
    marginTop: 32,
    marginBottom: 20,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  circleBase: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  summaryCard: {
    marginTop: 20,
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    gap: 8,
  },
});
