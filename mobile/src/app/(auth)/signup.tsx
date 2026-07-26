import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { Spacing } from "@/constants/theme";
import { useAuth } from "@/context/auth";
import { useTheme } from "@/hooks/use-theme";

export default function SignupScreen() {
  const { signUp } = useAuth();
  const router = useRouter();
  const theme = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function onSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signUp(email.trim(), password);
      router.replace("/");
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Signup failed. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior="padding"
      >
        <SafeAreaView style={styles.flex}>
          <ScrollView
            contentContainerStyle={styles.inner}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.card}>
          <View style={[styles.logo, { backgroundColor: theme.primarySoft }]}>
            <Ionicons name="person-add" size={28} color={theme.primary} />
          </View>
          <ThemedText type="subtitle" style={styles.title}>
            Create account
          </ThemedText>
          <ThemedText themeColor="textSecondary" style={styles.subtitle}>
            Join the conversation
          </ThemedText>

          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="Email"
            placeholderTextColor={theme.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            value={email}
            onChangeText={setEmail}
          />
          <View
            style={[
              styles.passwordRow,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <TextInput
              style={[styles.passwordInput, { color: theme.text }]}
              placeholder="Password"
              placeholderTextColor={theme.textSecondary}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword((prev) => !prev)}
              hitSlop={8}
            >
              <Ionicons
                name={showPassword ? "eye-off" : "eye"}
                size={22}
                color={theme.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {error && (
            <ThemedText themeColor="danger" style={styles.error}>
              {error}
            </ThemedText>
          )}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.primary }]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Create account</ThemedText>
            )}
          </TouchableOpacity>

          <Link href="/(auth)/login" style={styles.link}>
            <ThemedText themeColor="textSecondary">
              Have an account? <ThemedText themeColor="primary">Login</ThemedText>
            </ThemedText>
            </Link>
            </View>
          </ScrollView>
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  flex: { flex: 1 },
  inner: {
    flexGrow: 1,
    justifyContent: "center",
    padding: Spacing.four,
  },
  card: {
    width: "100%",
    maxWidth: 420,
    alignSelf: "center",
    gap: Spacing.three,
  },
  logo: {
    width: 60,
    height: 60,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: Spacing.one,
  },
  title: { textAlign: "center", fontSize: 26, lineHeight: 32 },
  subtitle: { textAlign: "center", marginTop: -Spacing.two, marginBottom: Spacing.two },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    fontSize: 16,
  },
  passwordRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    paddingRight: Spacing.three,
  },
  passwordInput: { flex: 1, padding: Spacing.three, fontSize: 16 },
  eyeButton: { padding: Spacing.one },
  button: {
    borderRadius: 12,
    padding: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.one,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  error: { textAlign: "center" },
  link: { textAlign: "center", marginTop: Spacing.two },
});
