import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Button, Surface, Text, useTheme } from "react-native-paper";

const { height } = Dimensions.get("window");

export default function WelcomeScreen() {
  const theme = useTheme();
  const router = useRouter();

  const [showLoginOptions, setShowLoginOptions] = useState(false);

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <View style={styles.heroSection}>
        <Surface style={styles.logoCircle} elevation={4}>
          <Text variant="displayMedium" style={{ color: theme.colors.primary }}>
            $
          </Text>
        </Surface>
        <Text variant="headlineLarge" style={styles.appName}>
          PennyWise
        </Text>
        <Text variant="bodyLarge" style={styles.tagline}>
          Smart budgeting for a better future.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {!showLoginOptions ? (
          <View>
            <Button
              mode="contained"
              onPress={() => router.push("/(auth)/signup")}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Get Started
            </Button>

            <Button
              mode="outlined"
              onPress={() => setShowLoginOptions(true)} // Show options
              style={[styles.button, { borderColor: theme.colors.primary }]}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>
          </View>
        ) : (
          <View>
            <Text variant="labelLarge" style={styles.optionTitle}>
              Choose Login Method
            </Text>

            <Button
              mode="contained-tonal"
              icon="google"
              onPress={() => console.log("Google Login Logic")}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Continue with Google
            </Button>

            <Button
              mode="contained-tonal"
              icon="email"
              onPress={() => router.push("/(auth)/login")}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Continue with Email
            </Button>

            <Button
              mode="text"
              icon="arrow-left"
              onPress={() => setShowLoginOptions(false)}
              style={styles.backButton}
              contentStyle={styles.buttonContent}
            >
              Go Back
            </Button>
          </View>
        )}

        <Text variant="bodySmall" style={styles.terms}>
          By continuing, you agree to our Terms.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "space-between",
  },
  heroSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.05,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  appName: {
    fontWeight: "900",
  },
  tagline: {
    textAlign: "center",
    opacity: 0.7,
    marginTop: 8,
  },
  buttonContainer: {
    width: "100%",
    paddingBottom: 40,
  },
  button: {
    marginBottom: 12,
    borderRadius: 12,
  },
  buttonContent: {
    height: 56,
  },
  optionTitle: {
    textAlign: "center",
    marginBottom: 20,
    opacity: 0.6,
    textTransform: "uppercase",
    letterSpacing: 1.5,
  },
  backButton: {
    marginTop: 8,
  },
  terms: {
    textAlign: "center",
    opacity: 0.4,
    marginTop: 16,
  },
});
