import AddAccountModal from "@/components/AddBankAccount/AddBankAccount";
import { authClient } from "@/lib/auth/auth-client";
import {
  getBankAccounts,
  getRecentActivities,
  getTotalBalance,
} from "@/services/finance/financeService";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Button,
  Chip,
  Divider,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [params, setParams] = useState({ take: 10, skip: 1 });
  const { data: totalBalance, isLoading: isLoadingTotalBalance } =
    getTotalBalance();

  const { data: bankAccounts, isLoading: isLoadingBankAccounts } =
    getBankAccounts();

  const {
    data: recentActivities,
    fetchNextPage,
    hasNextPage,
  } = getRecentActivities(params);

  const theme = useTheme();
  const { data: session, isPending: isSessionLoading } =
    authClient.useSession();

  if (isSessionLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  console.log(recentActivities?.pages.flatMap((page) => page.data));
  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.topHeader}>
          <View>
            <Text
              variant="titleMedium"
              style={{ color: theme.colors.outline, fontWeight: "600" }}
            >
              Welcome back,
            </Text>
            <Text variant="headlineSmall" style={styles.userName}>
              {session?.user?.name?.split(" ")[0] || "User"}
            </Text>
          </View>
          <IconButton icon="bell-outline" mode="contained-tonal" />
        </View>

        {/* Total Portfolio Summary (Updated with Income/Expense) */}
        <Surface
          style={[
            styles.totalSurface,
            { backgroundColor: theme.colors.surfaceVariant },
          ]}
          elevation={0}
        >
          <Text
            variant="labelMedium"
            style={{
              color: theme.colors.outline,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            Total Net Worth
          </Text>

          {/* Main Balance Area */}
          <View style={{ height: 60, justifyContent: "center" }}>
            {isLoadingTotalBalance ? (
              <ActivityIndicator
                animating={true}
                size="small"
                color={theme.colors.primary}
                style={{ alignSelf: "flex-start" }}
              />
            ) : (
              <Text
                variant="displaySmall"
                style={{
                  fontWeight: "900",
                  color: theme.colors.onSurfaceVariant,
                  marginVertical: 8,
                }}
              >
                ₱{(totalBalance?.totalAmount ?? 0).toLocaleString()}
              </Text>
            )}
          </View>

          <Divider style={{ marginVertical: 12, opacity: 0.5 }} />

          {/* Card Footer for Income/Expense */}
          <View style={styles.cardFooter}>
            <View style={styles.cardFooterItem}>
              <Text
                style={[
                  styles.cardFooterLabel,
                  { color: theme.colors.outline },
                ]}
              >
                Income
              </Text>
              {isLoadingTotalBalance ? (
                <ActivityIndicator
                  animating={true}
                  size={14}
                  color="#4CAF50"
                  style={{ alignSelf: "flex-start" }}
                />
              ) : (
                <Text style={[styles.cardFooterValue, { color: "#4CAF50" }]}>
                  +₱{(totalBalance?.totalIncome ?? 0).toLocaleString()}
                </Text>
              )}
            </View>

            <View style={styles.cardFooterItem}>
              <Text
                style={[
                  styles.cardFooterLabel,
                  { color: theme.colors.outline },
                ]}
              >
                Expense
              </Text>
              {isLoadingTotalBalance ? (
                <ActivityIndicator
                  animating={true}
                  size={14}
                  color={theme.colors.error}
                  style={{ alignSelf: "flex-start" }}
                />
              ) : (
                <Text
                  style={[
                    styles.cardFooterValue,
                    { color: theme.colors.error },
                  ]}
                >
                  -₱{(totalBalance?.totalExpense ?? 0).toLocaleString() ?? "0"}
                </Text>
              )}
            </View>
          </View>
        </Surface>

        {/* Horizontal Bank Accounts Carousel */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            My Accounts
          </Text>
          <AddAccountModal />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.accountListPadding}
          snapToInterval={width * 0.7 + 15}
          decelerationRate="fast"
        >
          {isLoadingBankAccounts ? (
            <View style={styles.accountCardLoading}>
              <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
          ) : bankAccounts && bankAccounts.length > 0 ? (
            bankAccounts?.map((item) => (
              <Surface
                key={item.id}
                style={styles.accountCardWrapper}
                elevation={0}
              >
                <LinearGradient
                  colors={["#6C63FF", "#3F3D56"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.accountCard}
                >
                  <View style={styles.accountCardTop}>
                    <View style={styles.accountIconBg}>
                      <IconButton
                        icon={item.type === "CASH" ? "cash" : "bank"}
                        iconColor="white"
                        size={20}
                      />
                    </View>
                    <Text variant="labelLarge" style={styles.accountTypeTag}>
                      {item.type}
                    </Text>
                  </View>
                  <View>
                    <Text style={styles.accountName}>{item.name}</Text>
                    <Text style={styles.accountBalance}>
                      ₱{item.currentBalance?.toLocaleString() ?? "0"}
                    </Text>
                  </View>
                </LinearGradient>
              </Surface>
            ))
          ) : (
            <View style={styles.accountCardWrapper}>
              <Text>No bank accounts found</Text>
            </View>
          )}
        </ScrollView>

        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Quick Actions
          </Text>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipGap}
        >
          <Chip
            icon="swap-horizontal"
            mode="outlined"
            style={styles.actionChip}
            onPress={() => {}}
          >
            Transfer
          </Chip>
          <Chip
            icon="arrow-up"
            mode="outlined"
            style={styles.actionChip}
            onPress={() => {}}
          >
            Income
          </Chip>
          <Chip
            icon="arrow-down"
            mode="outlined"
            style={styles.actionChip}
            onPress={() => {}}
          >
            Expense
          </Chip>
        </ScrollView>

        {/* Recent Activity Section */}
        <View style={styles.sectionHeader}>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Recent Activity
          </Text>

          {hasNextPage && (
            <Text
              variant="labelLarge"
              style={{ color: theme.colors.primary, fontWeight: "bold" }}
            >
              See All
            </Text>
          )}
        </View>

        <View style={styles.transactionContainer}>
          {recentActivities?.pages
            .flatMap((page) => page.data)
            .map((item) => (
              <Surface
                key={item.id}
                style={styles.transactionItem}
                elevation={0}
              >
                <View
                  style={[
                    styles.iconBox,
                    { backgroundColor: theme.colors.surfaceVariant },
                  ]}
                >
                  <IconButton
                    icon={item.action}
                    size={24}
                    iconColor={theme.colors.primary}
                  />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text variant="bodyLarge" style={{ fontWeight: "700" }}>
                    {item.action}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.outline }}
                  >
                    {item.entityType} •{" "}
                    {new Date(item.createdAt).toLocaleDateString("en-US")}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.amount,
                    {
                      color:
                        item.action === "CREDIT"
                          ? "#4CAF50"
                          : theme.colors.error,
                    },
                  ]}
                >
                  {item.action === "CREDIT"
                    ? `+₱${(item?.metadata?.amount ?? 0).toLocaleString()}`
                    : `-₱${Math.abs(
                        item?.metadata?.amount ?? 0
                      ).toLocaleString()}`}
                </Text>
              </Surface>
            ))}
          {hasNextPage && (
            <Button onPress={() => fetchNextPage()}>Load More</Button>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { paddingBottom: 120 },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    paddingTop: 60,
  },
  userName: { fontWeight: "900", letterSpacing: -0.5 },

  // Total Net Worth Card
  totalSurface: { margin: 20, padding: 24, borderRadius: 28, marginTop: 0 },
  cardFooter: { flexDirection: "row", justifyContent: "space-between" },
  cardFooterItem: { flex: 1 },
  cardFooterLabel: { fontSize: 11, fontWeight: "600", marginBottom: 4 },
  cardFooterValue: { fontSize: 18, fontWeight: "800" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 25,
    marginBottom: 15,
  },
  sectionTitle: { fontWeight: "900", fontSize: 18 },

  // Carousel
  accountListPadding: { paddingLeft: 20, paddingRight: 20, paddingBottom: 10 },
  accountCardWrapper: { marginRight: 15, borderRadius: 28, overflow: "hidden" },
  accountCard: {
    width: width * 0.7,
    height: 160,
    padding: 20,
    justifyContent: "space-between",
  },
  accountCardLoading: {
    width: Dimensions.get("window").width,
    justifyContent: "center",
    alignItems: "center",
  },
  accountCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  accountIconBg: { backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 12 },
  accountTypeTag: {
    color: "white",
    opacity: 0.8,
    fontWeight: "bold",
    marginTop: 8,
  },
  accountName: {
    color: "white",
    opacity: 0.9,
    fontSize: 14,
    fontWeight: "600",
  },
  accountBalance: { color: "white", fontSize: 28, fontWeight: "900" },

  // Actions
  chipGap: { paddingHorizontal: 20, gap: 10 },
  actionChip: { borderRadius: 12, height: 45, justifyContent: "center" },

  // Transactions
  transactionContainer: { paddingHorizontal: 20 },
  transactionItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "transparent",
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  amount: { fontSize: 16, fontWeight: "800" },
});
