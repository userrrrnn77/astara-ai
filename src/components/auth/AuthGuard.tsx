import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import { LoginPage } from "./LoginPage";
import { Spinner } from "../ui/Spinner";

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, isInitialized } = useAuth();

  if (!isInitialized) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background-100">
        <Spinner size="lg" className="text-gray-700" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return <>{children}</>;
}
