import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { MaxContentWidth, Spacing } from "@/constants/theme";
import { useTheme } from "@/hooks/use-theme";
import { api } from "@/lib/api";

type Props = {
  postId: number;
  visible: boolean;
  onClose: () => void;
};

export function CommentsModal({ postId, visible, onClose }: Props) {
  const theme = useTheme();
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  async function loadComments() {
    setLoading(true);
    try {
      const res = await api.get(`/user/comment/get/${postId}`);
      setComments(res.data.comments);
    } catch (err) {
      console.log("load comments failed", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (visible) loadComments();
  }, [visible]);

  async function addComment() {
    if (!text.trim() || sending) return;
    setSending(true);
    try {
      await api.post(`/user/comment/create/${postId}`, { text: text.trim() });
      setText("");
      loadComments();
    } catch (err) {
      console.log("add comment failed", err);
    } finally {
      setSending(false);
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.root}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.sheetWrap}
        >
          <ThemedView type="card" style={styles.sheet}>
          <View style={[styles.handle, { backgroundColor: theme.border }]} />
          <ThemedText type="smallBold" style={styles.heading}>
            Comments
          </ThemedText>

          {loading ? (
            <ActivityIndicator
              style={{ marginVertical: Spacing.four }}
              color={theme.primary}
            />
          ) : (
            <FlatList
              data={comments}
              keyExtractor={(item) => String(item.id)}
              style={styles.list}
              renderItem={({ item }) => (
                <View style={[styles.comment, { borderBottomColor: theme.border }]}>
                  <ThemedText>{item.text}</ThemedText>
                </View>
              )}
              ListEmptyComponent={
                <ThemedText themeColor="textSecondary" style={styles.emptyText}>
                  No comments yet
                </ThemedText>
              }
            />
          )}

          <View style={styles.inputRow}>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: theme.background, borderColor: theme.border, color: theme.text },
              ]}
              placeholder="Write a comment..."
              placeholderTextColor={theme.textSecondary}
              value={text}
              onChangeText={setText}
              onSubmitEditing={addComment}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[styles.send, { backgroundColor: theme.primary }]}
              onPress={addComment}
              disabled={sending}
            >
              <Ionicons name="send" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
          </ThemedView>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  sheetWrap: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    width: "100%",
    maxWidth: MaxContentWidth,
    marginHorizontal: "auto",
  },
  sheet: {
    padding: Spacing.three,
    paddingBottom: Spacing.four,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: "75%",
    minHeight: 260,
    gap: Spacing.two,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: Spacing.two,
  },
  heading: { fontSize: 16 },
  list: { maxHeight: 320 },
  comment: {
    paddingVertical: Spacing.two + 2,
    borderBottomWidth: 1,
  },
  emptyText: { paddingVertical: Spacing.three },
  inputRow: {
    flexDirection: "row",
    gap: Spacing.two,
    alignItems: "center",
    marginTop: Spacing.one,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 22,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two + 2,
  },
  send: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },
});
