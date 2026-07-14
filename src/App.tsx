import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthGuard } from "./components/auth/AuthGuard";
import { AppLayout } from "./components/layout/AppLayout";
import { LandingPage } from "./components/landing/Landingpage";
import { ChatPage } from "./pages/ChatPage";
import { useAuthInit } from "./hooks/useAuth";

function RootRoute() {
  const hasAuthHash =
    window.location.hash.includes("access_token") ||
    window.location.hash.includes("refresh_token");

  if (hasAuthHash) {
    return <Navigate to={`/chat${window.location.hash}`} replace />;
  }

  return <LandingPage />;
}

const App = () => {
  useAuthInit();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootRoute />} />
        <Route
          path="/chat"
          element={
            <AuthGuard>
              <AppLayout>
                <ChatPage />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route
          path="/chat/:roomId"
          element={
            <AuthGuard>
              <AppLayout>
                <ChatPage />
              </AppLayout>
            </AuthGuard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
