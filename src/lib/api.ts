import axios, { AxiosError } from "axios";
import { getAccessToken } from "./supabase";
import type {
  ApiErrorResponse,
  Conversation,
  CreateConversationRequest,
  CreateConversationResponse,
  GetConversationResponse,
  GetConversationsResponse,
  GetMessagesResponse,
  Message,
  RegenerateMessageRequest,
  RegenerateMessageResponse,
  SendMessageRequest,
  SendMessageResponse,
} from "../types/chat";

const baseURL = import.meta.env.VITE_API_BASE_URL;

if (!baseURL) {
  throw new Error("Missing VITE_API_BASE_URL. Cek file .env.local kamu.");
}

export const apiClient = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function getApiErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const axiosErr = err as AxiosError<ApiErrorResponse>;
    const serverMessage = axiosErr.response?.data?.error;
    if (serverMessage) return serverMessage;
    if (axiosErr.code === "ECONNABORTED") return "Request timeout. Coba lagi.";
    if (!axiosErr.response) return "Gak bisa connect ke server.";
  }
  if (err instanceof Error) return err.message;
  return "Terjadi kesalahan yang gak diketahui.";
}

// ============================================================
// Conversations
// ============================================================

export async function fetchConversations(): Promise<Conversation[]> {
  const { data } =
    await apiClient.get<GetConversationsResponse>("/conversations");
  return data.conversations;
}

export async function createConversation(
  title?: string,
): Promise<Conversation> {
  const payload: CreateConversationRequest = { title };
  const { data } = await apiClient.post<CreateConversationResponse>(
    "/conversations",
    payload,
  );
  return data.conversation;
}

export async function fetchConversationById(id: string): Promise<Conversation> {
  const { data } = await apiClient.get<GetConversationResponse>(
    `/conversations/${id}`,
  );
  return data.conversation;
}

export async function deleteConversation(id: string): Promise<void> {
  await apiClient.delete(`/conversations/${id}`);
}

// ============================================================
// Messages
// ============================================================

export async function fetchMessages(
  conversationId: string,
): Promise<Message[]> {
  const { data } = await apiClient.get<GetMessagesResponse>("/messages", {
    params: { conversationId },
  });
  return data.messages;
}

// ============================================================
// Chat (kirim pesan -> jalanin pipeline Draft A + Draft B paralel -> Finalize)
// ============================================================

export async function sendMessage(
  input: SendMessageRequest,
): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>("/chat", input);
  return data;
}

export async function regenerateMessage(
  input: RegenerateMessageRequest,
): Promise<RegenerateMessageResponse> {
  const { data } = await apiClient.post<RegenerateMessageResponse>(
    "/chat/regenerate",
    input,
  );
  return data;
}
