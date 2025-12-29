import {
  CreateGoalFormValues,
  createGoalSchema,
} from "@/lib/schema/finance/financeSchema";
import { BankAccountType } from "@/lib/types/types";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useMemo } from "react";
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
import { Select } from "../ui/select";

interface Props {
  visible: boolean;
  onDismiss: () => void;
  onSubmit: (data: CreateGoalFormValues) => void;
  accounts: BankAccountType[];
}

export default function AddGoalModal({
  visible,
  onDismiss,
  onSubmit,
  accounts,
}: Props) {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createGoalSchema),
    defaultValues: {
      name: "",
      targetAmount: 0,
      accountId: "",
    },
  });

  // Memoize options to prevent "undefined" length issues in the Select component
  const accountOptions = useMemo(
    () =>
      accounts?.map((account) => ({
        label: account.name,
        value: account.id,
      })) || [],
    [accounts]
  );

  const handleFormSubmit = async (data: CreateGoalFormValues) => {
    onSubmit(data);
    reset();
    onDismiss();
  };

  return (
    <Portal>
      <Modal
        visible={visible}
        onDismiss={onDismiss}
        contentContainerStyle={[
          styles.modalContainer,
          { backgroundColor: theme.colors.elevation.level3 },
        ]}
      >
        <Text variant="headlineSmall" style={styles.title}>
          New Saving Goal
        </Text>

        {/* Goal Name */}
        <View style={styles.fieldWrapper}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Goal Name"
                mode="outlined"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={!!errors.name}
                placeholder="e.g. New Car"
              />
            )}
          />
          <HelperText type="error" visible={!!errors.name}>
            {errors.name?.message}
          </HelperText>
        </View>

        {/* Target Amount */}
        <View style={styles.fieldWrapper}>
          <Controller
            control={control}
            name="targetAmount"
            render={({ field: { onChange, value } }) => (
              <TextInput
                label="Target Amount"
                mode="outlined"
                keyboardType="numeric"
                onChangeText={(text) =>
                  onChange(text === "" ? 0 : Number(text))
                }
                value={value === 0 ? "" : value?.toString()}
                error={!!errors.targetAmount}
                left={<TextInput.Affix text="₱" />}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.targetAmount}>
            {errors.targetAmount?.message}
          </HelperText>
        </View>

        {/* Account Selection */}
        <View style={styles.fieldWrapper}>
          <Controller
            control={control}
            name="accountId"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Associated Account"
                value={value}
                onChange={onChange}
                error={!!errors.accountId}
                options={accountOptions}
              />
            )}
          />
          <HelperText type="error" visible={!!errors.accountId}>
            {errors.accountId?.message}
          </HelperText>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Button
            onPress={onDismiss}
            style={styles.flex1}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit(handleFormSubmit)}
            style={styles.flex1}
            loading={isSubmitting}
            disabled={isSubmitting}
          >
            Create
          </Button>
        </View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    margin: 20,
    padding: 24,
    borderRadius: 28,
  },
  title: {
    fontWeight: "900",
    marginBottom: 16,
  },
  fieldWrapper: {
    marginBottom: 2, // Tightens spacing between input and its error message
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  flex1: {
    flex: 1,
  },
});
