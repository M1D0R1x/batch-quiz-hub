import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getSessionUser } from "@/lib/auth.functions";

type AuthState = {
  userId: string | null;
  loading: boolean;
};

const AuthContext = createContext<AuthState>({ userId: null, loading: true });

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

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
