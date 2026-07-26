import axios from "axios";

// Set EXPO_PUBLIC_API_URL in a .env file to override (e.g. your LAN IP for a
// real device). Falls back to the local backend which runs on port 5000.
const baseURL =
  process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:5000/api/v1";

export const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach the auth token to every request once you store one after login.
export function setAuthToken(token: string | null) {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
}
