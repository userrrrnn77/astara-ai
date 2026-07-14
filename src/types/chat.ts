import type { GenerativeBlock } from "./blocks";

export type MessageRole = "user" | "assistant" | "system";

// --- Pipeline meta (single-model flow) ---
export interface PipelineMeta {
  model?: string; // model id yang dipakai
  skippedStages?: string[]; // misal: ["retry"] kalau retry corruption gagal
}

// --- Conversation ---
export interface Conversation {
  _id: string;
  userId: string;
  title: string;
  modelId: string; // default "astara-consensus"
  createdAt: string;
  updatedAt: string;
}

// --- Message ---
export interface Message {
  _id: string;
  conversationId: string;
  role: MessageRole;
  content: string; // final text/markdown content
  blocks?: GenerativeBlock[];
  tokens?: number;
  pipelineMeta?: PipelineMeta;
  createdAt: string;
}

// ============================================================
// API request/response shapes
// ============================================================

// GET /api/conversations
export interface GetConversationsResponse {
  conversations: Conversation[];
}

// POST /api/conversations
export interface CreateConversationRequest {
  title?: string;
}
export interface CreateConversationResponse {
  conversation: Conversation;
}

// GET /api/conversations/:id
export interface GetConversationResponse {
  conversation: Conversation;
}

// DELETE /api/conversations/:id -> 204 No Content (no body)

// GET /api/messages?conversationId=
export interface GetMessagesResponse {
  messages: Message[];
}

// POST /api/chat
export interface SendMessageRequest {
  conversationId?: string; // kalo gak ada, backend bikin conversation baru
  content: string;
}
export interface SendMessageResponse {
  conversationId: string;
  isNewConversation: boolean;
  userMessage: Message;
  assistantMessage: Message;
}

// POST /api/chat/regenerate
export interface RegenerateMessageRequest {
  conversationId: string;
  messageId: string; // pesan assistant lama yang mau digenerate ulang
}
export interface RegenerateMessageResponse {
  assistantMessage: Message;
}

// Feedback lokal (like/dislike) per pesan — belum ada endpoint backend,
// disimpen di localStorage lewat messageFeedbackStore biar persist tanpa
// perlu migrasi skema Message di backend dulu.
export type MessageFeedback = "up" | "down" | null;

// Generic error shape (dari error.middleware.ts)
export interface ApiErrorResponse {
  error: string;
  details?: unknown; // ZodError.flatten() kalo validation error (status 400)
}
