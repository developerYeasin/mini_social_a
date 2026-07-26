import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/context/auth";
import { api } from "@/lib/api";

export default function ProfileScreen() {
  const theme = useTheme();
  const { signOut } = useAuth();
  const [email, setEmail] = useState<string | null>(null);
  const [postCount, setPostCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/auth/checkToken");
        const me = data.user;
        setEmail(me?.email ?? null);
        const posts = await api.get("/user/post/get", {
          params: { limit: 100, search: me?.email },
        });
        setPostCount(posts.data.total ?? posts.data.posts?.length ?? 0);
      } catch (err) {
        console.log("profile load failed", err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const initial = email?.charAt(0).toUpperCase() ?? "?";

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.inner} edges={["bottom"]}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: Spacing.five }} color={theme.primary} />
        ) : (
          <View style={styles.content}>
            <View style={[styles.avatar, { backgroundColor: theme.primarySoft }]}>
              <ThemedText style={[styles.avatarText, { color: theme.primary }]}>
                {initial}
              </ThemedText>
            </View>
            <ThemedText type="smallBold" style={styles.email}>
              {email ?? "Unknown"}
            </ThemedText>

            <View style={[styles.statCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <Ionicons name="reader-outline" size={22} color={theme.primary} />
              <View>
                <ThemedText type="subtitle" style={styles.statNumber}>
                  {postCount ?? 0}
                </ThemedText>
                <ThemedText themeColor="textSecondary" style={styles.statLabel}>
                  Posts
                </ThemedText>
              </View>
            </View>

            <TouchableOpacity
              style={[styles.logout, { borderColor: theme.border }]}
              onPress={signOut}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={20} color={theme.danger} />
              <ThemedText themeColor="danger" style={styles.logoutText}>
                Log out
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}
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
    alignItems: "center",
    gap: Spacing.three,
  },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.three,
  },
  avatarText: { fontSize: 36, fontWeight: "700" },
  email: { fontSize: 16 },
  statCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.three,
    borderWidth: 1,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingHorizontal: Spacing.four,
    width: "100%",
    marginTop: Spacing.two,
  },
  statNumber: { fontSize: 24, lineHeight: 30 },
  statLabel: { fontSize: 13 },
  logout: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: Spacing.two,
    borderWidth: 1,
    borderRadius: 12,
    padding: Spacing.three,
    width: "100%",
    marginTop: Spacing.two,
  },
  logoutText: { fontWeight: "600", fontSize: 15 },
});
