import { create } from "zustand";
import {
  createConversation as apiCreateConversation,
  deleteConversation as apiDeleteConversation,
  fetchConversations as apiFetchConversations,
  fetchMessages as apiFetchMessages,
  getApiErrorMessage,
  regenerateMessage as apiRegenerateMessage,
  sendMessage as apiSendMessage,
} from "../lib/api";
import type { Conversation, Message } from "../types/chat";

interface ChatState {
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];

  isLoadingConversations: boolean;
  isLoadingMessages: boolean;
  isSendingMessage: boolean; // true selama pipeline jalan
  regeneratingMessageId: string | null; // _id pesan assistant yang lagi di-regenerate, null kalo gak ada
  error: string | null;

  loadConversations: () => Promise<void>;
  selectConversation: (conversationId: string) => Promise<void>;
  startNewConversation: () => void; // reset ke state "belum ada conversation" (belum hit API)
  sendMessage: (content: string) => Promise<void>;
  regenerateMessage: (messageId: string) => Promise<void>;
  removeConversation: (conversationId: string) => Promise<void>;
  clearError: () => void;
}

// ID sementara buat optimistic user message, sebelum backend balikin _id asli.
function tempId(): string {
  return `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],

  isLoadingConversations: false,
  isLoadingMessages: false,
  isSendingMessage: false,
  regeneratingMessageId: null,
  error: null,

  loadConversations: async () => {
    set({ isLoadingConversations: true, error: null });
    try {
      const conversations = await apiFetchConversations();
      set({ conversations, isLoadingConversations: false });
    } catch (err) {
      set({
        error: getApiErrorMessage(err),
        isLoadingConversations: false,
      });
    }
  },

  selectConversation: async (conversationId: string) => {
    set({
      activeConversationId: conversationId,
      isLoadingMessages: true,
      messages: [],
      error: null,
    });
    try {
      const messages = await apiFetchMessages(conversationId);
      set({ messages, isLoadingMessages: false });
    } catch (err) {
      set({
        error: getApiErrorMessage(err),
        isLoadingMessages: false,
      });
    }
  },

  startNewConversation: () => {
    set({ activeConversationId: null, messages: [], error: null });
  },

  sendMessage: async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed) return;

    const { activeConversationId } = get();

    const optimisticUserMessage: Message = {
      _id: tempId(),
      conversationId: activeConversationId ?? "",
      role: "user",
      content: trimmed,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, optimisticUserMessage],
      isSendingMessage: true,
      error: null,
    }));

    try {
      const result = await apiSendMessage({
        conversationId: activeConversationId ?? undefined,
        content: trimmed,
      });

      set((state) => {
        const messagesWithoutOptimistic = state.messages.filter(
          (m) => m._id !== optimisticUserMessage._id,
        );

        return {
          activeConversationId: result.conversationId,
          messages: [
            ...messagesWithoutOptimistic,
            result.userMessage,
            result.assistantMessage,
          ],
          isSendingMessage: false,
        };
      });

      await get().loadConversations();
    } catch (err) {
      set((state) => ({
        messages: state.messages.filter(
          (m) => m._id !== optimisticUserMessage._id,
        ),
        isSendingMessage: false,
        error: getApiErrorMessage(err),
      }));
    }
  },

  regenerateMessage: async (messageId: string) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    set({ regeneratingMessageId: messageId, error: null });

    try {
      const result = await apiRegenerateMessage({
        conversationId: activeConversationId,
        messageId,
      });

      set((state) => ({
        messages: state.messages.map((m) =>
          m._id === messageId ? result.assistantMessage : m,
        ),
        regeneratingMessageId: null,
      }));
    } catch (err) {
      set({
        regeneratingMessageId: null,
        error: getApiErrorMessage(err),
      });
    }
  },

  removeConversation: async (conversationId: string) => {
    const prevConversations = get().conversations;
    const wasActive = get().activeConversationId === conversationId;

    set((state) => ({
      conversations: state.conversations.filter(
        (c) => c._id !== conversationId,
      ),
      ...(wasActive && { activeConversationId: null, messages: [] }),
    }));

    try {
      await apiDeleteConversation(conversationId);
    } catch (err) {
      // Rollback kalo gagal
      set({
        conversations: prevConversations,
        error: getApiErrorMessage(err),
      });
    }
  },

  clearError: () => set({ error: null }),
}));

export async function createNewConversationAndSelect(): Promise<string> {
  const conversation = await apiCreateConversation();
  const store = useChatStore.getState();
  await store.loadConversations();
  useChatStore.setState({
    activeConversationId: conversation._id,
    messages: [],
  });
  return conversation._id;
}
