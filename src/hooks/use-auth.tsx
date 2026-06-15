/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type AppRole = "super_admin" | "admin" | "creator" | "student";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  roles: AppRole[];
  loading: boolean;
  isAuthenticated: boolean;
  hasRole: (role: AppRole) => boolean;
  isAdmin: boolean;
  isCreator: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRoles = async (userId: string) => {
    try {
      const { data } = await supabase.from("user_roles").select("role").eq("user_id", userId);
      setRoles((data ?? []).map((r) => r.role) as AppRole[]);
    } catch (error) {
      console.error("Failed to load user roles", error);
      setRoles([]);
    }
  };

  useEffect(() => {
    // Register auth listener first
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession?.access_token) {
        // Sync token to cookie for server functions (useServerFn) to read
        document.cookie = `sb-access-token=${newSession.access_token}; path=/; max-age=31536000; SameSite=Lax`;
      } else {
        document.cookie = "sb-access-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }

      if (newSession?.user) {
        fetchRoles(newSession.user.id);
      } else {
        setRoles([]);
      }
    });

    // Hydrate any existing session
    supabase.auth
      .getSession()
      .then(({ data }) => {
        setSession(data.session);
        if (data.session?.user) {
          return fetchRoles(data.session.user.id);
        }
      })
      .catch((error) => {
        console.error("Failed to restore Supabase session", error);
      })
      .finally(() => {
        setLoading(false);
      });

    return () => subscription.unsubscribe();
  }, []);

  const value: AuthContextValue = {
    user: session?.user ?? null,
    session,
    roles,
    loading,
    isAuthenticated: !!session,
    hasRole: (role) => roles.includes(role),
    isAdmin: roles.includes("super_admin") || roles.includes("admin"),
    isCreator:
      roles.includes("super_admin") || roles.includes("admin") || roles.includes("creator"),
    signOut: async () => {
      await supabase.auth.signOut();
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const emptyAuthContext: AuthContextValue = {
  user: null,
  session: null,
  roles: [],
  loading: true,
  isAuthenticated: false,
  hasRole: () => false,
  isAdmin: false,
  isCreator: false,
  signOut: async () => {},
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  return ctx ?? emptyAuthContext;
}
