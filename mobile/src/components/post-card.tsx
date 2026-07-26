import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "./themed-text";
import { Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/auth";
import { CommentsModal } from "@/components/comments-modal";

type Like = {
  user_id?: number | string | null;
};

type Post = {
  id: number;
  content: string;
  User: {
    id: number;
    email: string;
  };
  Likes?: Like[];
  Comments?: { id: number }[];
};

export default function PostCard({ post }: { post: Post }) {
  const theme = useTheme();
  const auth = useAuth() as any;
  const userId = auth.user?.id ?? auth.userId;
  const [liked, setLiked] = useState(
    post.Likes?.some((l) => l.user_id === userId) ?? false,
  );
  const [count, setCount] = useState(post.Likes?.length ?? 0);
  const [commentCount] = useState(post.Comments?.length ?? 0);
  const [showComments, setShowComments] = useState(false);

  const email = post.User?.email ?? "Unknown";
  const initial = email.charAt(0).toUpperCase();

  async function toggleLike() {
    try {
      if (liked) {
        await api.delete(`/user/like/delete/${post.id}`);
        setCount((c) => c - 1);
      } else {
        await api.post(`/user/like/like/${post.id}`);
        setCount((c) => c + 1);
      }
      setLiked((v) => !v);
    } catch (err) {
      console.log("like failed", err);
    }
  }

  return (
    <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
      <View style={styles.head}>
        <View style={[styles.avatar, { backgroundColor: theme.primarySoft }]}>
          <ThemedText style={[styles.avatarText, { color: theme.primary }]}>
            {initial}
          </ThemedText>
        </View>
        <ThemedText type="smallBold" numberOfLines={1} style={styles.author}>
          {email}
        </ThemedText>
      </View>

      <ThemedText style={styles.content}>{post.content}</ThemedText>

      <View style={styles.actions}>
        <TouchableOpacity
          style={[styles.action, { backgroundColor: theme.backgroundSelected }]}
          onPress={toggleLike}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? theme.like : theme.textSecondary}
          />
          <ThemedText themeColor="textSecondary" style={styles.actionText}>
            {count}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.action, { backgroundColor: theme.backgroundSelected }]}
          onPress={() => setShowComments(true)}
        >
          <Ionicons name="chatbubble-outline" size={17} color={theme.textSecondary} />
          <ThemedText themeColor="textSecondary" style={styles.actionText}>
            {commentCount > 0 ? commentCount : "Comment"}
          </ThemedText>
        </TouchableOpacity>
      </View>

      <CommentsModal
        postId={post.id}
        visible={showComments}
        onClose={() => setShowComments(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.two,
  },
  head: { flexDirection: "row", alignItems: "center", gap: Spacing.two },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontWeight: "700" },
  author: { flex: 1 },
  content: { fontSize: 16, lineHeight: 23 },
  actions: { flexDirection: "row", gap: Spacing.two, marginTop: Spacing.one },
  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: Spacing.one + 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.one + 2,
    borderRadius: 20,
  },
  actionText: { fontSize: 13, fontWeight: "600" },
});
