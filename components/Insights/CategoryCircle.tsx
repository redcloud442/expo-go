import { StyleSheet, View } from "react-native";
import { Text, useTheme } from "react-native-paper";

export const CategoryCircle = ({
  label,
  percent,
  color,
}: {
  label: string;
  percent: number;
  color: string;
}) => {
  const theme = useTheme();

  // Ensure percent is between 0-100 for safety
  const safePercent = Math.min(Math.max(percent, 0), 100);

  return (
    <View style={styles.circleContainer}>
      <View
        style={[
          styles.circleBase,
          { borderColor: theme.colors.surfaceVariant },
        ]}
      >
        {/* The Progress Arc */}
        <View
          style={[
            styles.progressArc,
            {
              borderTopColor: color,
              borderRightColor: safePercent > 25 ? color : "transparent",
              borderBottomColor: safePercent > 50 ? color : "transparent",
              borderLeftColor: safePercent > 75 ? color : "transparent",
            },
          ]}
        />
        <Text variant="labelLarge" style={styles.percentText}>
          {safePercent}%
        </Text>
      </View>
      <Text variant="labelSmall" numberOfLines={1} style={styles.categoryLabel}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  categoryRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Even spacing
    alignItems: "center",
    marginVertical: 16,
    paddingHorizontal: 10,
  },
  circleContainer: {
    alignItems: "center",
    width: 80, // Fixed width for alignment
  },
  circleBase: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  progressArc: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 4,
    borderColor: "transparent",
    transform: [{ rotate: "-45deg" }], // Standard start position
  },
  percentText: {
    fontWeight: "800",
    fontSize: 14,
  },
  categoryLabel: {
    marginTop: 8,
    fontWeight: "600",
    opacity: 0.8,
    textAlign: "center",
  },
});
