import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { api, setAuthToken } from "@/lib/api";

import { saveToken, getToken, deleteToken } from "@/lib/auth-storage";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  user: any;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(true);

  useEffect(() => {
    (async () => {
      const saved = await getToken();
      if (saved) {
        setAuthToken(saved);
        setToken(saved);
        try {
          const data = await api.get("/auth/checkToken");
          setUser(data.data.user);
        } catch {
          // Token is invalid/expired → clear it instead of crashing the app.
          await deleteToken();
          setAuthToken(null);
          setToken(null);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  async function handleAuth(path: string, email: string, password: string) {
    const res = await api.post(path, { email, password });
    const newToken = res.data.token as string;
    await saveToken(newToken);
    setToken(newToken);
    setAuthToken(newToken);
  }
  const signIn = async (email: string, password: string) =>
    handleAuth("/auth/login", email, password);
  const signUp = async (email: string, password: string) =>
    handleAuth("/auth/register", email, password);
  async function signOut() {
    await deleteToken();
    setToken(null);
    setAuthToken(null);
  }
  return (
    <AuthContext.Provider
      value={{ token, isLoading, signIn, signUp, signOut, user }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return ctx;
}
