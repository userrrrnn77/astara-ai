import { useEffect, useRef } from "react";
import { useMessages } from "../../hooks/useMessages";
import { useSendMessage } from "../../hooks/useSendMessage";
import { MessageBubble } from "./MessageBubble";
import { PipelineIndicator } from "./PipelineIndicator";
import { MessageInput } from "./MessageInput";
import { EmptyState } from "./EmptyState";
import { Spinner } from "../ui/Spinner";

export function ChatWindow() {
  const { messages, isLoading, hasActiveConversation } = useMessages();
  const { isSending } = useSendMessage();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isSending]);

  const lastAssistantId = [...messages]
    .reverse()
    .find((m) => m.role === "assistant")?._id;

  return (
    <div className="flex h-full flex-col">
      <div className="min-h-0 flex-1 overflow-y-auto">
        {!hasActiveConversation && messages.length === 0 ? (
          <EmptyState />
        ) : isLoading ? (
          <div className="flex h-full items-center justify-center">
            <Spinner size="md" className="text-gray-700" />
          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-3xl flex-col gap-4 px-3 py-6 sm:gap-6 sm:px-4 sm:py-8 md:px-0">
            {messages.map((message) => (
              <MessageBubble
                key={message._id}
                message={message}
                isLatest={message._id === lastAssistantId}
              />
            ))}
            {isSending && <PipelineIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      <MessageInput />
    </div>
  );
}
