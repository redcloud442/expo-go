import { AccountType } from "@/lib/constant/enum";
import {
  BankAccountFormValues,
  bankAccountSchema,
} from "@/lib/schema/finance/financeSchema";
import { financeService } from "@/services/finance/financeService";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { ScrollView, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Modal,
  Portal,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

export default function AddAccountModal() {
  const theme = useTheme();
  const [visible, setVisible] = React.useState(false);

  const openModal = () => setVisible(true);
  const closeModal = () => setVisible(false);

  const queryClient = useQueryClient();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BankAccountFormValues>({
    resolver: zodResolver(bankAccountSchema),
    defaultValues: {
      name: "",
      type: AccountType.SAVINGS,
      currency: "PHP",
      openingBalance: 0,
      currentBalance: 0,
      isActive: true,
      isArchived: false,
    },
  });

  const createBankAccountMutation = useMutation({
    mutationKey: ["bank-accounts"],
    mutationFn: financeService.createBankAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bank-accounts"] });
      closeModal();
      Toast.show({
        type: "success",
        text1: "Account created successfully",
      });
    },
    onError: (error) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.message,
      });
    },
  });

  const onFormSubmit = (data: BankAccountFormValues) => {
    createBankAccountMutation.mutate(data);
    reset();
  };

  return (
    <>
      <Button icon="plus" mode="contained" onPress={openModal}>
        Add Account
      </Button>
      <Portal>
        <Modal
          visible={visible}
          onDismiss={closeModal}
          contentContainerStyle={[
            styles.container,
            { backgroundColor: theme.colors.elevation.level3 },
          ]}
        >
          {/* Scrollable content */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            <Text variant="headlineSmall" style={styles.title}>
              New Account
            </Text>

            {/* Account Name */}
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Account Name"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.name}
                  placeholder="e.g. BPI Payroll"
                />
              )}
            />
            <HelperText type="error" visible={!!errors.name}>
              {errors.name?.message}
            </HelperText>

            {/* Account Type */}
            <Text variant="labelLarge" style={styles.label}>
              Account Type
            </Text>
            <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <View style={styles.segmentedContainer}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    <SegmentedButtons
                      value={value}
                      onValueChange={onChange}
                      buttons={[
                        { value: AccountType.SAVINGS, label: "Savings" },
                        { value: AccountType.CASH, label: "Cash" },
                        { value: AccountType.CHECKING, label: "Checking" },
                        { value: AccountType.INVESTMENT, label: "Invest" },
                      ]}
                    />
                  </ScrollView>
                </View>
              )}
            />

            {/* Balances */}
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Controller
                  control={control}
                  name="openingBalance"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Opening"
                      mode="outlined"
                      keyboardType="numeric"
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      value={value.toString()}
                      left={<TextInput.Affix text="₱" />}
                    />
                  )}
                />
              </View>

              <View style={styles.spacer} />

              <View style={styles.flex1}>
                <Controller
                  control={control}
                  name="currentBalance"
                  render={({ field: { onChange, value } }) => (
                    <TextInput
                      label="Current"
                      mode="outlined"
                      keyboardType="numeric"
                      onChangeText={(text) => onChange(parseFloat(text) || 0)}
                      value={value.toString()}
                      left={<TextInput.Affix text="₱" />}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>

          {/* Fixed action buttons */}
          <View style={styles.buttonContainer}>
            <Button
              mode="contained"
              onPress={handleSubmit(onFormSubmit)}
              loading={isSubmitting}
              style={styles.btn}
            >
              Add Account
            </Button>
            <Button mode="outlined" onPress={closeModal} style={styles.btn}>
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 24,
    borderRadius: 28,
  },
  title: { fontWeight: "900", marginBottom: 20 },
  label: { marginTop: 10, marginBottom: 8, fontWeight: "600" },
  segmentedContainer: { marginBottom: 15 },
  row: { flexDirection: "row", marginTop: 10 },
  flex1: { flex: 1 },
  spacer: { width: 12 },
  buttonContainer: { marginTop: 24 },
  btn: { marginVertical: 4 },
});
