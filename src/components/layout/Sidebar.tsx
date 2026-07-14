import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { MessageSquarePlus, Trash2, X } from "lucide-react";
import clsx from "clsx";
import { useConversations } from "../../hooks/useConversations";
import { Spinner } from "../ui/Spinner";
import { Button } from "../ui/Button";
import { useUIStore } from "../../stores/uiStore";

export function Sidebar() {
  const { conversations, isLoading, removeConversation } = useConversations();
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);

  const isSidebarOpen = useUIStore((s) => s.isSidebarOpen);
  const closeSidebar = useUIStore((s) => s.closeSidebar);

  async function handleDelete(e: React.MouseEvent, conversationId: string) {
    e.stopPropagation();
    setPendingDeleteId(conversationId);
    try {
      await removeConversation(conversationId);
      if (roomId === conversationId) {
        navigate("/chat");
      }
    } finally {
      setPendingDeleteId(null);
    }
  }

  function handleNavigate(path: string) {
    navigate(path);
    closeSidebar();
  }

  return (
    <>
      {isSidebarOpen && (
        <div
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={clsx(
          "fixed inset-y-0 left-0 z-50 flex h-dvh w-64 shrink-0 -translate-x-full flex-col border-r border-gray-alpha-400 bg-background-200 transition-transform duration-200 ease-in-out",
          "md:static md:z-auto md:translate-x-0",
          isSidebarOpen && "translate-x-0",
        )}>
        <div className="flex items-center gap-2 p-3">
          <Button
            variant="secondary"
            size="md"
            fullWidth
            leftIcon={<MessageSquarePlus size={16} />}
            onClick={() => handleNavigate("/chat")}>
            Chat baru
          </Button>
          <button
            onClick={closeSidebar}
            aria-label="Tutup sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-(--radius-md) text-gray-700 hover:bg-gray-alpha-100 hover:text-gray-1000 md:hidden">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {isLoading && conversations.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <Spinner size="sm" className="text-gray-700" />
            </div>
          ) : conversations.length === 0 ? (
            <p className="px-2 py-4 text-center text-xs text-gray-700">
              Belum ada percakapan.
            </p>
          ) : (
            <ul className="flex flex-col gap-0.5">
              {conversations.map((conversation) => {
                const isActive = conversation._id === roomId;
                return (
                  <li key={conversation._id}>
                    <button
                      onClick={() =>
                        handleNavigate(`/chat/${conversation._id}`)
                      }
                      className={clsx(
                        "group flex w-full items-center gap-2 rounded-(--radius-md) px-2.5 py-2 text-left text-sm transition-colors",
                        isActive
                          ? "bg-gray-alpha-200 text-gray-1000"
                          : "text-gray-800 hover:bg-gray-alpha-100 hover:text-gray-1000",
                      )}>
                      <span className="min-w-0 flex-1 truncate">
                        {conversation.title || "Percakapan baru"}
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        onClick={(e) => handleDelete(e, conversation._id)}
                        className={clsx(
                          "shrink-0 rounded-sm p-1 opacity-0 hover:bg-gray-alpha-300 group-hover:opacity-100",
                          pendingDeleteId === conversation._id && "opacity-100",
                        )}
                        aria-label="Hapus percakapan">
                        {pendingDeleteId === conversation._id ? (
                          <Spinner size="sm" />
                        ) : (
                          <Trash2 size={14} />
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
