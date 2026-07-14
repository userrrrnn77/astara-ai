import { useChatStore } from "../stores/chatStore";

export function useSendMessage() {
  const sendMessage = useChatStore((s) => s.sendMessage);
  const isSending = useChatStore((s) => s.isSendingMessage);
  const regenerateMessage = useChatStore((s) => s.regenerateMessage);
  const regeneratingMessageId = useChatStore((s) => s.regeneratingMessageId);
  const error = useChatStore((s) => s.error);
  const clearError = useChatStore((s) => s.clearError);

  return {
    sendMessage,
    isSending,
    regenerateMessage,
    regeneratingMessageId,
    error,
    clearError,
  };
}
