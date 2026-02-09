import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type AppRole = "admin" | "employee" | "finance";

interface AuthState {
  user: User | null;
  session: Session | null;
  role: AppRole | null;
  profile: { display_name: string | null; avatar_url: string | null } | null;
  isLoading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    profile: null,
    isLoading: true,
  });

  const fetchRoleAndProfile = useCallback(async (userId: string) => {
    const [roleRes, profileRes] = await Promise.all([
      supabase.from("user_roles").select("role").eq("user_id", userId).maybeSingle(),
      supabase.from("profiles").select("display_name, avatar_url").eq("user_id", userId).maybeSingle(),
    ]);
    return {
      role: (roleRes.data?.role as AppRole) || "employee",
      profile: profileRes.data || null,
    };
  }, []);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          // Use setTimeout to avoid Supabase client deadlock
          setState(prev => ({ ...prev, user: session.user, session, isLoading: true }));
          setTimeout(async () => {
            const { role, profile } = await fetchRoleAndProfile(session.user.id);
            setState({ user: session.user, session, role, profile, isLoading: false });
          }, 0);
        } else {
          setState({ user: null, session: null, role: null, profile: null, isLoading: false });
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const { role, profile } = await fetchRoleAndProfile(session.user.id);
        setState({ user: session.user, session, role, profile, isLoading: false });
      } else {
        setState({ user: null, session: null, role: null, profile: null, isLoading: false });
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchRoleAndProfile]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { display_name: displayName },
      },
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return { ...state, signIn, signUp, signOut };
}
