// src/pages/ChatPage.tsx

import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useChatStore } from "../stores/chatStore";
import { ChatWindow } from "../components/chat/ChatWindow";

export function ChatPage() {
  const { roomId } = useParams<{ roomId?: string }>();
  const navigate = useNavigate();

  const activeConversationId = useChatStore((s) => s.activeConversationId);
  const selectConversation = useChatStore((s) => s.selectConversation);
  const startNewConversation = useChatStore((s) => s.startNewConversation);

  const lastHandledRoomId = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (roomId === lastHandledRoomId.current) return;
    lastHandledRoomId.current = roomId;

    if (roomId) {
      if (roomId !== activeConversationId) {
        selectConversation(roomId);
      }
    } else {
      startNewConversation();
    }
  }, [roomId]);

  useEffect(() => {
    if (
      activeConversationId &&
      activeConversationId !== roomId &&
      lastHandledRoomId.current !== activeConversationId
    ) {
      lastHandledRoomId.current = activeConversationId;
      navigate(`/chat/${activeConversationId}`, { replace: true });
    }
  }, [activeConversationId]);

  return <ChatWindow />;
}
