import { useState, useMemo } from "react";
import { Check, Copy } from "lucide-react";
import hljs from "highlight.js";
import type { CodeBlock } from "../../types/blocks";

interface CodeBlockViewProps {
  block: CodeBlock;
}

export function CodeBlockView({ block }: CodeBlockViewProps) {
  const [copied, setCopied] = useState(false);

  const highlighted = useMemo(() => {
    try {
      if (block.language && hljs.getLanguage(block.language)) {
        return hljs.highlight(block.content, { language: block.language })
          .value;
      }
      return hljs.highlightAuto(block.content).value;
    } catch {
      return block.content;
    }
  }, [block.content, block.language]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(block.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mb-3 overflow-hidden rounded-(--radius-md) border border-gray-alpha-300">
      <div className="flex items-center justify-between bg-gray-200 px-3 py-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-800">
          {block.filename && (
            <span className="font-medium text-gray-1000">{block.filename}</span>
          )}
          <span className="rounded-[4px] bg-gray-alpha-200 px-1.5 py-0.5 font-mono lowercase">
            {block.language || "plaintext"}
          </span>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-xs text-gray-800 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000">
          {copied ? (
            <>
              <Check size={13} /> Copied
            </>
          ) : (
            <>
              <Copy size={13} /> Copy
            </>
          )}
        </button>
      </div>
      <div className="code-block-highlight overflow-x-auto bg-gray-100 p-3">
        <pre>
          <code
            className="hljs"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
}
