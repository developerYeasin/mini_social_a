import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack, useRouter, useSegments } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { useColorScheme } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AuthProvider, useAuth } from "@/context/auth";
import "@/global.css";
import { usePushNotifications } from "@/hooks/use-push-notifications";

function RootNavigator() {
  const { token, isLoading } = useAuth();
  usePushNotifications(token);
  const segments = useSegments();
  const router = useRouter();
  useEffect(() => {
    if (isLoading) return;
    const inAuthGroup = segments?.[0] === "(auth)";
    if (!token && !inAuthGroup) {
      router.replace("/(auth)/login" as any);
    } else if (token && inAuthGroup) {
      router.replace("/" as any);
    }
  }, [token, segments, isLoading, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="index" />
      <Stack.Screen
        name="create"
        options={{
          presentation: "modal",
          headerShown: true,
          title: "New Post",
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerShown: true,
          title: "Profile",
        }}
      />
    </Stack>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AuthProvider>
            <RootNavigator />
          </AuthProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
