import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { api } from "@/lib/api";

const MAX = 280;

export default function CreatePostScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit() {
    if (!content.trim()) {
      setError("Write something first");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.post("/user/post/create", { content: content.trim() });
      router.back();
    } catch (err: any) {
      setError(err?.response?.data?.message ?? "Failed to post");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.inner} edges={["bottom"]}>
        <View style={styles.content}>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border, color: theme.text },
            ]}
            placeholder="What's on your mind?"
            placeholderTextColor={theme.textSecondary}
            multiline
            maxLength={MAX}
            autoFocus
            value={content}
            onChangeText={setContent}
          />

          <View style={styles.meta}>
            {error ? (
              <ThemedText themeColor="danger">{error}</ThemedText>
            ) : (
              <View />
            )}
            <ThemedText themeColor="textSecondary" style={styles.counter}>
              {content.length}/{MAX}
            </ThemedText>
          </View>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.primary, opacity: content.trim() ? 1 : 0.5 },
            ]}
            onPress={onSubmit}
            disabled={loading}
            activeOpacity={0.9}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <ThemedText style={styles.buttonText}>Post</ThemedText>
            )}
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { flex: 1, padding: Spacing.four },
  content: {
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
    gap: Spacing.two,
  },
  input: {
    borderWidth: 1,
    borderRadius: 14,
    padding: Spacing.three,
    fontSize: 17,
    lineHeight: 24,
    minHeight: 140,
    textAlignVertical: "top",
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  counter: { fontSize: 13 },
  button: {
    borderRadius: 12,
    padding: Spacing.three,
    alignItems: "center",
    marginTop: Spacing.two,
  },
  buttonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});
