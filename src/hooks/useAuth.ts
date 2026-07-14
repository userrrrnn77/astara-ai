import { useEffect } from "react";
import { useAuthStore } from "../stores/authStore";

export function useAuth() {
  const session = useAuthStore((s) => s.session);
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const signInWithGithub = useAuthStore((s) => s.signInWithGithub);
  const signInWithEmail = useAuthStore((s) => s.signInWithEmail);
  const signUpWithEmail = useAuthStore((s) => s.signUpWithEmail);
  const signOut = useAuthStore((s) => s.signOut);

  return {
    session,
    user,
    isAuthenticated: !!session,
    isLoading,
    isInitialized,
    signInWithGoogle,
    signInWithGithub,
    signInWithEmail,
    signUpWithEmail,
    signOut,
  };
}

export function useAuthInit() {
  useEffect(() => {
    const unsubscribe = useAuthStore.getState().init();
    return unsubscribe;
  }, []);
}
