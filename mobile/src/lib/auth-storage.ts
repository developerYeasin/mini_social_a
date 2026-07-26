import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

const TOKEN_KEY = "token";
const isWeb = Platform.OS === "web";

export async function saveToken(token: string) {
  if (isWeb) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    await SecureStore.setItemAsync(TOKEN_KEY, token);
  }
}

export async function getToken(): Promise<string | null> {
  if (isWeb) {
    return localStorage.getItem(TOKEN_KEY);
  } else {
    return SecureStore.getItemAsync(TOKEN_KEY);
  }
}

export async function deleteToken(): Promise<void> {
  if (isWeb) {
    localStorage.removeItem(TOKEN_KEY);
  } else {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  }
}
