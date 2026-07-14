import { useState } from "react";
import { Check, Copy, RotateCcw, ThumbsDown, ThumbsUp } from "lucide-react";
import clsx from "clsx";
import { useFeedbackStore } from "../../stores/feedbackStore";
import { Spinner } from "../ui/Spinner";

interface MessageActionsProps {
  messageId: string;
  getCopyText: () => string;
  onRegenerate: () => void;
  isRegenerating: boolean;
  isLatest: boolean;
}

export function MessageActions({
  messageId,
  getCopyText,
  onRegenerate,
  isRegenerating,
  isLatest,
}: MessageActionsProps) {
  const [copied, setCopied] = useState(false);
  const feedback = useFeedbackStore((s) => s.feedback[messageId] ?? null);
  const setFeedback = useFeedbackStore((s) => s.setFeedback);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(getCopyText());
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mt-1.5 flex items-center gap-0.5">
      <button
        type="button"
        onClick={handleCopy}
        title="Copy jawaban"
        className="flex h-7 w-7 items-center justify-center rounded-sm text-gray-700 transition-colors hover:bg-gray-alpha-100 hover:text-gray-1000">
        {copied ? <Check size={15} /> : <Copy size={15} />}
      </button>

      {isLatest && (
        <button
          type="button"
          onClick={onRegenerate}
          disabled={isRegenerating}
          title="Generate ulang"
          className="flex h-7 w-7 items-center justify-center rounded-sm text-gray-700 transition-colors hover:bg-gray-alpha-100 hover:text-gray-1000 disabled:cursor-not-allowed disabled:opacity-50">
          {isRegenerating ? <Spinner size="sm" /> : <RotateCcw size={15} />}
        </button>
      )}

      <div className="mx-1 h-4 w-px bg-gray-alpha-300" />

      <button
        type="button"
        onClick={() => setFeedback(messageId, "up")}
        title="Jawaban bagus"
        className={clsx(
          "flex h-7 w-7 items-center justify-center rounded-sm transition-colors hover:bg-gray-alpha-100",
          feedback === "up"
            ? "text-green-700"
            : "text-gray-700 hover:text-gray-1000",
        )}>
        <ThumbsUp
          size={15}
          fill={feedback === "up" ? "currentColor" : "none"}
        />
      </button>
      <button
        type="button"
        onClick={() => setFeedback(messageId, "down")}
        title="Jawaban kurang tepat"
        className={clsx(
          "flex h-7 w-7 items-center justify-center rounded-sm transition-colors hover:bg-gray-alpha-100",
          feedback === "down"
            ? "text-red-700"
            : "text-gray-700 hover:text-gray-1000",
        )}>
        <ThumbsDown
          size={15}
          fill={feedback === "down" ? "currentColor" : "none"}
        />
      </button>
    </div>
  );
}
