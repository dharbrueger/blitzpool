import React, { useEffect, useState } from "react";
import type { Session, User } from "next-auth";
import { getSession } from "next-auth/react";

const redirectKey = "sign_in_redirect";

export const AuthContext = React.createContext<
  | {
      initializing: boolean;
      session: Session | null;
      user: User | null;
      error: { message: string } | null;
      setRedirect: (redirect: string) => void;
      getRedirect: () => string | null;
      clearRedirect: () => void;
    }
  | undefined
>(undefined);

AuthContext.displayName = "AuthContext";

function setRedirect(redirect: string) {
  window.sessionStorage.setItem(redirectKey, redirect);
}

function getRedirect(): string | null {
  return window.sessionStorage.getItem(redirectKey);
}

function clearRedirect() {
  return window.sessionStorage.removeItem(redirectKey);
}

export function useAuth() {
  const auth = React.useContext(AuthContext);

  if (!auth) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return auth;
}

export function AuthProvider({ children }: { children: JSX.Element }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<{ message: string } | null>(null);
  const [initializing, setInitializing] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const session = await getSession();

        if (session && session?.user) {
          setSession(session);
          setUser(session.user);
          setError(null);
        } else {
          setUser(null);
          if (error) {
            setError(error);
          }
        }

        setInitializing(false);
      } catch (error: any) {
        setInitializing(false);
      }
    };

    void fetchSession();
  }, [error]);

  const value = {
    user,
    session,
    error,
    initializing,
    setRedirect,
    getRedirect,
    clearRedirect,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
