// src/components/chat/MessageBubble.tsx

import { useState } from "react";
import { Check, Copy, ChevronDown, ChevronUp } from "lucide-react";
import { BlockRenderer } from "../blocks/BlockRenderer";
import { MarkdownBlockView } from "../blocks/MarkdownBlockView";
import { MessageActions } from "./MessageActions";
import { useSendMessage } from "../../hooks/useSendMessage";
import { serializeBlocksToText } from "../../utils/blockSerialize";
import type { Message } from "../../types/chat";
import { useThemeStore } from "../../stores/themeStore";
import astaraDark from "../../assets/astara-putih.png";
import astaraLight from "../../assets/astara.png";

interface MessageBubbleProps {
  message: Message;
  isLatest?: boolean;
}

export function MessageBubble({
  message,
  isLatest = false,
}: MessageBubbleProps) {
  const { regenerateMessage, regeneratingMessageId } = useSendMessage();
  const { theme } = useThemeStore();

  const [isExpanded, setIsExpanded] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);

  const isUser = message.role === "user";
  const MAX_LINES = 6;

  async function handleCopyUser() {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedUser(true);
      setTimeout(() => setCopiedUser(false), 1500);
    } catch {}
  }

  if (isUser) {
    const lines = message.content.split("\n");
    const needsCollapse = lines.length > MAX_LINES;

    return (
      <div className="group flex w-full justify-end">
        <div className="flex max-w-[90%] flex-col items-end gap-1 sm:max-w-[85%]">
          <div
            className={`rounded-3xl bg-gray-100 px-5 py-3 text-[15px] leading-relaxed whitespace-pre-wrap text-gray-1000 transition-all ${
              !isExpanded && needsCollapse ? "line-clamp-6" : ""
            }`}>
            {message.content}
          </div>

          <div className="flex items-center gap-3">
            {needsCollapse && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1 text-[11px] font-medium text-gray-500 hover:text-gray-900">
                {isExpanded ? (
                  <>
                    <ChevronUp size={12} /> Ciutkan
                  </>
                ) : (
                  <>
                    <ChevronDown size={12} /> Lihat selengkapnya
                  </>
                )}
              </button>
            )}

            <button
              type="button"
              onClick={handleCopyUser}
              title="Copy pesan"
              className="flex items-center gap-1.5 px-2 text-[11px] font-medium text-gray-600 opacity-0 transition-opacity hover:text-gray-1000 group-hover:opacity-100">
              {copiedUser ? <Check size={12} /> : <Copy size={12} />}
              {copiedUser ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRegenerating = regeneratingMessageId === message._id;

  return (
    <div className="flex w-full items-start gap-4">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-gray-1000 text-xs font-bold text-background-100">
        <img
          className="w-4 h-4"
          src={theme === "dark" ? astaraLight : astaraDark}
          alt=""
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="space-y-3">
          {message.blocks && message.blocks.length > 0 ? (
            <BlockRenderer blocks={message.blocks} />
          ) : (
            <MarkdownBlockView
              block={{ type: "markdown", content: message.content }}
            />
          )}
        </div>

        <div className="mt-2">
          <MessageActions
            messageId={message._id}
            isRegenerating={isRegenerating}
            isLatest={isLatest}
            onRegenerate={() => regenerateMessage(message._id)}
            getCopyText={() =>
              message.blocks && message.blocks.length > 0
                ? serializeBlocksToText(message.blocks)
                : message.content
            }
          />
        </div>
      </div>
    </div>
  );
}
