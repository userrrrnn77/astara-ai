import { useEffect } from "react";
import { useChatStore } from "../stores/chatStore";
import { createNewConversationAndSelect } from "../stores/chatStore";

export function useConversations() {
  const conversations = useChatStore((s) => s.conversations);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const isLoading = useChatStore((s) => s.isLoadingConversations);
  const error = useChatStore((s) => s.error);
  const loadConversations = useChatStore((s) => s.loadConversations);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const startNewConversation = useChatStore((s) => s.startNewConversation);
  const removeConversation = useChatStore((s) => s.removeConversation);

  useEffect(() => {
    loadConversations();
  }, []);

  return {
    conversations,
    activeConversationId,
    isLoading,
    error,
    refresh: loadConversations,
    selectConversation,
    createNewConversation: createNewConversationAndSelect,
    resetToNewChat: startNewConversation,
    removeConversation,
  };
}
