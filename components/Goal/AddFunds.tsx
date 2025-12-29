import { BankAccountType, GoalType } from "@/lib/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import * as z from "zod";
import { Select } from "../ui/select";

const addFundsSchema = z.object({
  targetAmount: z.number().min(1, "Target amount must be at least 1"),
  currentAmount: z.number().min(0, "Current amount must be at least 0"),
  bankAccountId: z.string().min(1, "Bank account is required"),
});

type AddFundsFormValues = z.infer<typeof addFundsSchema>;

interface Props {
  visible: boolean;
  goal: GoalType | null;
  bankAccounts: BankAccountType[];
  onDismiss: () => void;
  onSubmit: (data: AddFundsFormValues) => void;
}

export default function AddFundsModal({
  visible,
  goal,
  bankAccounts,
  onDismiss,
  onSubmit,
}: Props) {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AddFundsFormValues>({
    resolver: zodResolver(addFundsSchema),
    defaultValues: {
      targetAmount: goal?.targetAmount ?? 0,
      currentAmount: goal?.currentAmount ?? 0,
      bankAccountId: goal?.accountId ?? "",
    },
  });

  const onFormSubmit = (data: AddFundsFormValues) => {
    onSubmit(data);
    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={() => {
          reset();
          onDismiss();
        }}
        contentContainerStyle={[
          styles.container,
          { backgroundColor: theme.colors.elevation.level3 },
        ]}
      >
        <Text variant="headlineSmall" style={styles.title}>
          Add Funds
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Contributing to:{" "}
          <Text style={{ fontWeight: "bold" }}>{goal?.name}</Text>
        </Text>

        <View style={styles.field}>
          <Controller
            control={control}
            name="targetAmount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Target Amount"
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Affix text="₱" />}
                onChangeText={(text) =>
                  onChange(Number(text.replace(/[^0-9]/g, "")))
                }
                value={value === 0 ? "" : value.toString()}
                error={!!errors.targetAmount}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.targetAmount}>
            {errors.targetAmount?.message}
          </HelperText>
        </View>

        <View style={styles.field}>
          <Controller
            control={control}
            name="currentAmount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Current Amount"
                mode="outlined"
                keyboardType="numeric"
                left={<TextInput.Affix text="₱" />}
                onChangeText={(text) =>
                  onChange(Number(text.replace(/[^0-9]/g, "")))
                }
                value={value === 0 ? "" : value.toString()}
                error={!!errors.currentAmount}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.currentAmount}>
            {errors.currentAmount?.message}
          </HelperText>
        </View>

        <View style={styles.field}>
          <Controller
            control={control}
            name="bankAccountId"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Bank Account"
                options={bankAccounts.map((account) => ({
                  label: account.name,
                  value: account.id,
                }))}
                onChange={onChange}
                value={value as unknown as string}
                error={!!errors.bankAccountId}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.currentAmount}>
            {errors.currentAmount?.message}
          </HelperText>
        </View>

        <View style={styles.actions}>
          <Button onPress={onDismiss} style={{ flex: 1 }}>
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(onFormSubmit)}
            loading={isSubmitting}
            style={{ flex: 1 }}
          >
            Confirm
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  container: { margin: 20, padding: 24, borderRadius: 28 },
  title: { fontWeight: "900" },
  subtitle: { marginBottom: 20, opacity: 0.7 },
  field: { marginBottom: 4 },
  actions: { flexDirection: "row", gap: 12, marginTop: 16 },
});
