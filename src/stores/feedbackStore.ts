import { create } from "zustand";
import type { MessageFeedback } from "../types/chat";

const STORAGE_KEY = "astara:message-feedback";

function loadFromStorage(): Record<string, MessageFeedback> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveToStorage(data: Record<string, MessageFeedback>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {}
}

interface FeedbackState {
  feedback: Record<string, MessageFeedback>;
  setFeedback: (messageId: string, value: MessageFeedback) => void;
}

export const useFeedbackStore = create<FeedbackState>((set, get) => ({
  feedback: loadFromStorage(),
  setFeedback: (messageId, value) => {
    const current = get().feedback[messageId] ?? null;
    const next = current === value ? null : value;

    const updated = { ...get().feedback, [messageId]: next };
    set({ feedback: updated });
    saveToStorage(updated);
  },
}));
