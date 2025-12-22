import { authClient } from "@/lib/auth/auth-client";
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip, IconButton, Surface, Text, useTheme } from "react-native-paper";

export default function HomeScreen() {
  const theme = useTheme();
  const { data: session } = authClient.useSession();

  const RECENT_TRANSACTIONS = [
    {
      id: 1,
      title: "Transaction 1",
      amount: 100,
      category: "Category 1",
      icon: "arrow-up-outline",
    },
  ];

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Modern Glassmorphic Header */}
        <View style={styles.topHeader}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.secondary, opacity: 0.7 }}
            >
              Good Morning,
            </Text>
            <Text variant="headlineSmall" style={styles.userName}>
              {session?.user?.name?.split(" ")[0] || "User"}
            </Text>
          </View>
          <IconButton
            icon="bell-badge-outline"
            mode="contained-tonal"
            iconColor={theme.colors.primary}
          />
        </View>

        {/* Gradient Balance Card */}
        <Text style={styles.cardLabel}>Total Balance</Text>
        <Text style={styles.cardBalance}>$12,450.80</Text>
        <View style={styles.cardFooter}>
          <View style={styles.cardFooterItem}>
            <Text style={styles.cardFooterLabel}>Income</Text>
            <Text style={styles.cardFooterValue}>+$4,200</Text>
          </View>
          <View style={styles.cardFooterItem}>
            <Text style={styles.cardFooterLabel}>Expense</Text>
            <Text style={styles.cardFooterValue}>-$1,850</Text>
          </View>
        </View>

        {/* Categories / Quick Actions */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.chipScroll}
        >
          {["Send", "Receive", "Bills", "Savings", "Stocks"].map((item) => (
            <Chip
              key={item}
              style={styles.actionChip}
              icon="flash-outline"
              onPress={() => {}}
            >
              {item}
            </Chip>
          ))}
        </ScrollView>

        {/* Transaction Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Transactions
          </Text>
          <Text style={{ color: theme.colors.primary }}>View All</Text>
        </View>

        {/* Transaction Item (Improved) */}
        <Surface style={styles.transactionList} elevation={0}>
          {RECENT_TRANSACTIONS.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: theme.colors.surfaceVariant },
                ]}
              >
                <IconButton icon={item.icon} size={24} />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text variant="bodyLarge" style={{ fontWeight: "600" }}>
                  {item.title}
                </Text>
                <Text variant="bodySmall" style={{ opacity: 0.6 }}>
                  {item.category}
                </Text>
              </View>
              <Text
                style={[
                  styles.amount,
                  { color: item.amount > 0 ? "#4CAF50" : "#FF5252" },
                ]}
              >
                {item.amount > 0
                  ? `+$${item.amount}`
                  : `-$${Math.abs(item.amount)}`}
              </Text>
            </View>
          ))}
        </Surface>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingTop: 60 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  userName: { fontWeight: "900", letterSpacing: -0.5 },
  mainCard: {
    width: "100%",
    height: 180,
    borderRadius: 30,
    padding: 25,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  cardLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
  },
  cardBalance: { color: "#fff", fontSize: 36, fontWeight: "bold" },
  cardFooter: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.2)",
    paddingTop: 15,
  },
  cardFooterItem: { marginRight: 40 },
  cardFooterLabel: { color: "rgba(255,255,255,0.6)", fontSize: 11 },
  cardFooterValue: { color: "#fff", fontSize: 16, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 15,
  },
  sectionTitle: { fontWeight: "800" },
  chipScroll: { marginBottom: 10 },
  actionChip: { marginRight: 10, borderRadius: 12 },
  transactionList: { backgroundColor: "transparent" },
  itemRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  amount: { fontSize: 16, fontWeight: "700" },
});
