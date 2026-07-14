// src/stores/authStore.ts

import { create } from "zustand";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";

interface AuthState {
  session: Session | null;
  user: User | null;
  isLoading: boolean; // true selama initial session check
  isInitialized: boolean;

  init: () => () => void; // return unsubscribe function
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  isLoading: true,
  isInitialized: false,

  init: () => {
    supabase.auth.getSession().then(({ data }) => {
      set({
        session: data.session,
        user: data.session?.user ?? null,
        isLoading: false,
        isInitialized: true,
      });
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        set({
          session,
          user: session?.user ?? null,
          isLoading: false,
          isInitialized: true,
        });
      },
    );

    return () => listener.subscription.unsubscribe();
  },

  signInWithGoogle: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/chat` },
    });
  },

  signInWithGithub: async () => {
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${window.location.origin}/chat` },
    });
  },

  signInWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  },

  signUpWithEmail: async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${window.location.origin}/chat` },
    });
    if (error) throw error;
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null });
  },
}));
