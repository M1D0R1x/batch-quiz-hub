import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSessionUser } from "@/lib/auth.functions";

type AuthState = {
  userId: string | null;
  loading: boolean;
};

type AuthContextValue = AuthState & {
  /** Call right after logging out to clear local auth state immediately,
   * instead of waiting for the next navigation to discover the cookie is gone. */
  clearSession: () => void;
};

const AuthContext = createContext<AuthContextValue>({
  userId: null,
  loading: true,
  clearSession: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ userId: null, loading: true });
  const getSessionUserFn = useServerFn(getSessionUser);

  useEffect(() => {
    let cancelled = false;
    getSessionUserFn().then((session) => {
      if (!cancelled) setState({ userId: session?.userId ?? null, loading: false });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const clearSession = () => setState({ userId: null, loading: false });

  return (
    <AuthContext.Provider value={{ ...state, clearSession }}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
