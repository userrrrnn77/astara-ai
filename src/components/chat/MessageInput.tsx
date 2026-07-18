import { useRef, useState, type KeyboardEvent } from "react";
import { ArrowUp } from "lucide-react";
import { useSendMessage } from "../../hooks/useSendMessage";
import { Button } from "../ui/Button";

export function MessageInput() {
  const { sendMessage, isSending, error, clearError } = useSendMessage();
  const [value, setValue] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  function autoGrow() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }

  async function handleSend() {
    const trimmed = value.trim();
    if (!trimmed || isSending) return;
    setValue("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    await sendMessage(trimmed);
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="px-3 py-3 sm:px-4 sm:py-4">
      <div className="mx-auto w-full max-w-3xl">
        {error && (
          <div className="mb-2 flex items-center justify-between rounded-[8px] bg-red-100 px-3 py-1.5 text-xs text-red-700">
            <span>{error}</span>
            <button onClick={clearError} className="ml-2 font-medium underline">
              Tutup
            </button>
          </div>
        )}

        <div className="flex items-end gap-2 rounded-3xl px-3 py-2 shadow-sm transition-colors sm:px-4">
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              autoGrow();
            }}
            onKeyDown={handleKeyDown}
            disabled={isSending}
            rows={1}
            placeholder="Tanya apa aja..."
            className="max-h-50 min-h-6 flex-1 outline-none border-none resize-none bg-transparent py-1.5 text-[15px] text-gray-1000 placeholder:text-gray-700 disabled:opacity-60"
          />
          <Button
            variant="primary"
            size="sm"
            isLoading={isSending}
            disabled={!value.trim()}
            onClick={handleSend}
            aria-label="Kirim pesan"
            className="mb-0.5 h-8! w-8! rounded-full p-0!">
            <ArrowUp size={16} />
          </Button>
        </div>

        <div className="mt-2 text-center text-[11px] text-gray-700">
          Astara AI dapat membuat kesalahan. Harap periksa kembali informasi
          penting.
        </div>
      </div>
    </div>
  );
}
