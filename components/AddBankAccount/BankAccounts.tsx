import { BankAccountType } from "@/lib/types/types";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Surface,
  Text,
  useTheme,
} from "react-native-paper";

const { width } = Dimensions.get("window");

const BankAccounts = ({
  bankAccounts,
  isLoadingBankAccounts,
}: {
  bankAccounts: BankAccountType[];
  isLoadingBankAccounts: boolean;
}) => {
  const theme = useTheme();

  return (
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
      ) : bankAccounts && bankAccounts?.length > 0 ? (
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
  );
};

const styles = StyleSheet.create({
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
export default BankAccounts;
