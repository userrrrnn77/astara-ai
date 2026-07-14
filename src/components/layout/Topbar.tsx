import { Moon, Sun, LogOut, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useThemeStore } from "../../stores/themeStore";
import { useUIStore } from "../../stores/uiStore";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

export function Topbar() {
  const { user, signOut } = useAuth();
  const { theme, toggleTheme } = useThemeStore();
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const navigate = useNavigate();

  const displayName =
    (user?.user_metadata?.full_name as string | undefined) ??
    (user?.user_metadata?.name as string | undefined) ??
    user?.email ??
    null;
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  async function handleSignOut() {
    await signOut();

    navigate("/", { replace: true });
  }

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-gray-alpha-400 bg-background-100 px-3 sm:px-4">
      <div className="flex items-center gap-2">
        <button
          onClick={toggleSidebar}
          aria-label="Buka sidebar"
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) text-gray-800 hover:bg-gray-alpha-100 hover:text-gray-1000 md:hidden">
          <Menu size={18} />
        </button>
        <span className="text-sm font-semibold text-gray-1000">Astara AI</span>
      </div>

      <div className="flex items-center gap-1 sm:gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={toggleTheme}
          aria-label="Toggle theme">
          {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
        </Button>

        <Avatar src={avatarUrl} name={displayName} size="sm" />

        <Button
          variant="ghost"
          size="sm"
          onClick={handleSignOut}
          aria-label="Sign out">
          <LogOut size={16} />
        </Button>
      </div>
    </header>
  );
}
