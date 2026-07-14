import { useChatStore } from "../stores/chatStore";

export function useMessages() {
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoadingMessages);
  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const error = useChatStore((s) => s.error);

  return {
    messages,
    isLoading,
    activeConversationId,
    error,
    hasActiveConversation: activeConversationId !== null,
  };
}
