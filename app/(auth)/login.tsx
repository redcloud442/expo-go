import { authClient } from "@/lib/auth/auth-client";
import { LoginFormValues, loginSchema } from "@/lib/schema/user/userschema";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import {
  Button,
  HelperText,
  Surface,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import Toast from "react-native-toast-message";

export default function LoginForm() {
  const theme = useTheme();
  const [secureText, setSecureText] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await authClient.signIn.email(
        {
          email: data.email,
          password: data.password,
        },
        {
          onSuccess: () => {
            Toast.show({
              type: "success",
              text1: "Success",
              text2: "Logged in successfully",
            });
            router.replace("/private/home");
          },
          onError: (error) => {
            Toast.show({
              type: "error",
              text1: "Error",
              text2: error.error.message,
            });
          },
        }
      );
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error instanceof Error ? error.message : "Something went wrong",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.flex}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text variant="headlineMedium" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.outline }}>
            Securely access your budget dashboard
          </Text>
        </View>

        <Surface style={styles.surface} elevation={1}>
          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Email"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.email}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  left={<TextInput.Icon icon="email-outline" />}
                />
              )}
            />
            <HelperText type="error" visible={!!errors.email}>
              {errors.email?.message}
            </HelperText>
          </View>

          <View style={styles.inputWrapper}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  label="Password"
                  mode="outlined"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={!!errors.password}
                  secureTextEntry={secureText}
                  left={<TextInput.Icon icon="lock-outline" />}
                  right={
                    <TextInput.Icon
                      icon={secureText ? "eye-off" : "eye"}
                      onPress={() => setSecureText(!secureText)}
                    />
                  }
                />
              )}
            />
            <HelperText type="error" visible={!!errors.password}>
              {errors.password?.message}
            </HelperText>
          </View>

          <Button
            mode="contained"
            onPress={handleSubmit(onSubmit)}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={styles.button}
            contentStyle={styles.buttonContent}
          >
            Sign In
          </Button>
        </Surface>
        <Button
          mode="text"
          onPress={() => router.push("/(auth)/signup")}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Don't have an account? Sign up
        </Button>
        <Button
          mode="text"
          onPress={() => router.push("/")}
          style={styles.button}
          contentStyle={styles.buttonContent}
        >
          Back
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { flex: 1, padding: 24, justifyContent: "center" },
  header: { marginBottom: 32 },
  title: { fontWeight: "bold" },
  surface: { padding: 20, borderRadius: 16 },
  inputWrapper: { marginBottom: 4 },
  button: { marginTop: 12, borderRadius: 8 },
  buttonContent: { height: 48 },
});
