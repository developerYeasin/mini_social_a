import { useEffect, useRef } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { api } from "@/lib/api";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function usePushNotifications(token: string | null) {
  const receivedRef = useRef<Notifications.EventSubscription | null>(null);
  const responseRef = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    if (!token) return;

    (async () => {
      if (!Device.isDevice) {
        console.log("push: real device দরকার");
        return;
      }

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
        });
      }

      const { status: existing } = await Notifications.getPermissionsAsync();
      let status = existing;
      if (existing !== "granted") {
        const req = await Notifications.requestPermissionsAsync();
        status = req.status;
      }
      if (status !== "granted") {
        console.log("push: permission denied");
        return;
      }

      try {
        const { data: fcmToken } =
          await Notifications.getDevicePushTokenAsync();
        console.log("fcm token >>", fcmToken);
        await api.post("/auth/fcm-token", { fcm_token: fcmToken });
      } catch (err) {
        console.log("push: token save failed", err);
      }
    })();

    receivedRef.current = Notifications.addNotificationReceivedListener((n) => {
      console.log("notification received >>", n.request.content);
    });

    responseRef.current = Notifications.addNotificationResponseReceivedListener(
      (r) => {
        console.log("notification tapped >>", r.notification.request.content);
      },
    );

    return () => {
      receivedRef.current?.remove();
      responseRef.current?.remove();
    };
  }, [token]);
}
