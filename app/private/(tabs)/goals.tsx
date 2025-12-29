import AddFundsModal from "@/components/Goal/AddFunds";
import AddGoalModal from "@/components/Goal/AddGoalModal";
import { BankAccountType, GoalType } from "@/lib/types/types";
import { financeService, getGoals } from "@/services/finance/financeService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import {
  Button,
  IconButton,
  ProgressBar,
  Surface,
  Text,
  TouchableRipple,
  useTheme,
} from "react-native-paper";

export default function GoalsSection() {
  const theme = useTheme();

  const queryClient = useQueryClient();
  const [take, setTake] = useState(10);
  const [skip, setSkip] = useState(1);

  const [fundsVisible, setFundsVisible] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalType | null>(null);
  const [visible, setVisible] = useState(false);
  const { data: goals } = getGoals({ take, skip });

  const accounts = queryClient.getQueryData<BankAccountType[]>([
    "bank-accounts",
  ]);

  const createGoalMutation = useMutation({
    mutationKey: ["goals"],
    mutationFn: financeService.createGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const addFundsMutation = useMutation({
    mutationKey: ["add-funds-to-goal"],
    mutationFn: financeService.addFundsToGoal,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] });
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const handleOpenAddFunds = (goal: GoalType) => {
    setSelectedGoal(goal);
    setFundsVisible(true);
  };

  const AddGoalCard = () => (
    <Surface
      elevation={1}
      style={[
        styles.addGoalCard,
        { backgroundColor: theme.colors.surfaceVariant, overflow: "hidden" },
      ]}
    >
      <TouchableRipple
        onPress={() => setVisible(true)}
        rippleColor="rgba(0, 0, 0, .1)"
      >
        <View
          style={[
            styles.addGoalContent,
            { padding: 12, flexDirection: "row", alignItems: "center" },
          ]}
        >
          <IconButton
            icon="plus-circle"
            size={32}
            iconColor={theme.colors.primary}
          />
          <View style={{ flex: 1, marginLeft: 4 }}>
            <Text variant="labelLarge" style={{ fontWeight: "700" }}>
              Create Goal
            </Text>
            <Text variant="bodySmall" style={{ opacity: 0.6 }}>
              Set a target and start saving
            </Text>
          </View>
          <IconButton icon="chevron-right" size={20} />
        </View>
      </TouchableRipple>
    </Surface>
  );
  /* -------------------- Goal Card -------------------- */
  const renderGoal = ({ item }: { item: GoalType }) => {
    const progress = Math.min(item.currentAmount / item.targetAmount, 1);
    const remaining = item.targetAmount - item.currentAmount;

    return (
      <Surface
        elevation={1}
        style={[styles.goalCard, { backgroundColor: theme.colors.surface }]}
      >
        {/* Header */}
        <View style={styles.goalHeader}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: theme.colors.primary + "20" },
            ]}
          >
            <IconButton
              icon="star"
              iconColor={theme.colors.primary}
              size={22}
            />
          </View>

          <View style={styles.goalText}>
            <Text variant="titleMedium" style={{ fontWeight: "700" }}>
              {item.name}
            </Text>

            <Text variant="bodySmall" style={{ opacity: 0.6 }}>
              ₱{item.currentAmount.toLocaleString()} / ₱
              {item.targetAmount.toLocaleString()}
            </Text>
          </View>

          <View
            style={[
              styles.percentPill,
              { backgroundColor: theme.colors.primary + "25" },
            ]}
          >
            <Text
              style={{
                color: theme.colors.primary,
                fontWeight: "800",
                fontSize: 12,
              }}
            >
              {Math.round(progress * 100)}%
            </Text>
          </View>
        </View>

        {/* Progress */}
        <ProgressBar
          progress={progress}
          color={theme.colors.primary}
          style={styles.progressBar}
        />

        {/* Footer */}
        <View style={styles.goalFooter}>
          <Text variant="labelSmall" style={{ opacity: 0.7 }}>
            {remaining > 0
              ? `₱${remaining.toLocaleString()} left`
              : "Goal completed 🎉"}
          </Text>

          <Button
            mode="contained-tonal"
            compact
            icon="plus"
            onPress={() => handleOpenAddFunds(item)} // OPEN MODAL HERE
          >
            Add Funds
          </Button>
        </View>
      </Surface>
    );
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <AddGoalModal
        visible={visible}
        accounts={accounts || []}
        onDismiss={() => setVisible(false)}
        onSubmit={createGoalMutation.mutate}
      />

      <AddFundsModal
        visible={fundsVisible}
        goal={selectedGoal || null}
        onDismiss={() => {
          setFundsVisible(false);
        }}
        bankAccounts={accounts || []}
        onSubmit={(data) =>
          addFundsMutation.mutate({
            goalId: selectedGoal?.id || "",
            targetAmount: data.targetAmount,
            bankAccountId: data.bankAccountId,
            currentAmount: data.currentAmount,
          })
        }
      />
      <FlatList
        data={[{ id: "add" } as any, ...(goals?.data || [])]}
        keyExtractor={(item: GoalType) => item.id}
        renderItem={({ item }: { item: GoalType }) =>
          item.id === "add" ? <AddGoalCard /> : renderGoal({ item })
        }
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.sectionHeader}>
            <Text variant="titleLarge" style={{ fontWeight: "800" }}>
              Savings Goals
            </Text>
            <IconButton
              icon="plus"
              size={22}
              mode="contained-tonal"
              onPress={() => {}}
            />
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  listContent: {
    padding: 20,
    gap: 12, // Vertical spacing between items
  },
  addGoalCard: {
    padding: 8,
    borderRadius: 22,
    marginBottom: 8,
  },
  addGoalContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  goalCard: {
    width: "100%", // Take full width
    padding: 16,
    borderRadius: 22,
  },
  goalHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    borderRadius: 14,
  },
  goalText: {
    flex: 1,
    marginLeft: 12,
  },
  percentPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  progressBar: {
    height: 8,
    borderRadius: 6,
    marginTop: 14,
  },
  goalFooter: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
