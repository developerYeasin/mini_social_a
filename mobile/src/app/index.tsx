import { ActivityIndicator, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { FlatList, TextInput } from "react-native-gesture-handler";
import PostCard from "@/components/post-card";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const theme = useTheme();
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const router = useRouter();

  async function loadPosts(pageNum = 1) {
    try {
      const res = await api.get("/user/post/get", {
        params: { page: pageNum, limit: 10, search: query || undefined },
      });
      const newPosts = res.data.posts ?? [];
      setPosts((prev) => (pageNum === 1 ? newPosts : [...prev, ...newPosts]));
      setHasMore(pageNum * 10 < (res.data.total ?? 0));
      setPage(pageNum);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => loadPosts(1), 300);
    return () => clearTimeout(t);
  }, [query]);

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea} edges={["top"]}>
        <View style={styles.content}>
          <View style={styles.header}>
            <ThemedText type="subtitle" style={styles.brand}>
              Feed
            </ThemedText>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => router.push("/profile")}
            >
              <Ionicons
                name="person-circle-outline"
                size={28}
                color={theme.text}
              />
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.search,
              { backgroundColor: theme.backgroundElement, borderColor: theme.border },
            ]}
          >
            <Ionicons name="search" size={18} color={theme.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.text }]}
              placeholder="Search by email"
              placeholderTextColor={theme.textSecondary}
              autoCapitalize="none"
              value={query}
              onChangeText={setQuery}
            />
          </View>

          {loading ? (
            <ActivityIndicator
              style={{ marginTop: Spacing.five }}
              color={theme.primary}
            />
          ) : (
            <FlatList
              data={posts}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <PostCard post={item} />}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                loadPosts(1);
              }}
              onEndReached={() => {
                if (hasMore && !loadingMore) {
                  setLoadingMore(true);
                  loadPosts(page + 1);
                }
              }}
              onEndReachedThreshold={0.5}
              ListFooterComponent={
                loadingMore ? (
                  <ActivityIndicator
                    style={{ marginVertical: Spacing.three }}
                    color={theme.primary}
                  />
                ) : null
              }
              ListEmptyComponent={
                <ThemedText themeColor="textSecondary" style={styles.empty}>
                  No posts yet
                </ThemedText>
              }
            />
          )}
        </View>

        <TouchableOpacity
          style={[styles.fab, { backgroundColor: theme.primary }]}
          activeOpacity={0.9}
          onPress={() => router.push("/create")}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  content: {
    flex: 1,
    width: "100%",
    maxWidth: MaxContentWidth,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  brand: { fontSize: 28, lineHeight: 34 },
  iconBtn: { padding: Spacing.one },
  search: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.two,
    marginHorizontal: Spacing.three,
    marginBottom: Spacing.two,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  searchInput: { flex: 1, fontSize: 15, paddingVertical: Spacing.half },
  list: {
    paddingHorizontal: Spacing.three,
    paddingBottom: Spacing.six,
    gap: Spacing.three,
  },
  empty: { textAlign: "center", marginTop: Spacing.five },
  fab: {
    position: "absolute",
    right: Spacing.four,
    bottom: Spacing.four,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
});
