import { useState, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Check, Copy } from "lucide-react";
import type { MarkdownBlock } from "../../types/blocks";

interface MarkdownBlockViewProps {
  block: MarkdownBlock;
}

function MarkdownPre({ children, ...rest }: ComponentPropsWithoutRef<"pre">) {
  const [copied, setCopied] = useState(false);

  function extractText(node: unknown): string {
    if (node == null || typeof node === "boolean") return "";
    if (typeof node === "string" || typeof node === "number")
      return String(node);
    if (Array.isArray(node)) return node.map(extractText).join("");
    if (typeof node === "object" && "props" in node) {
      return extractText(
        (node as { props?: { children?: unknown } }).props?.children,
      );
    }
    return "";
  }

  const codeEl = Array.isArray(children) ? children[0] : children;
  const codeProps = (
    codeEl as { props?: { children?: unknown; className?: string } }
  )?.props;
  const rawText = extractText(codeProps?.children);
  const langMatch = /language-(\w+)/.exec(codeProps?.className ?? "");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(rawText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mb-3 overflow-hidden rounded-(--radius-md) border border-gray-alpha-300">
      <div className="flex items-center justify-between bg-gray-200 px-3 py-1.5">
        <span className="rounded-[4px] bg-gray-alpha-200 px-1.5 py-0.5 font-mono text-xs lowercase text-gray-800">
          {langMatch?.[1] || "plaintext"}
        </span>
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
      <pre
        {...rest}
        className="m-0! overflow-x-auto bg-gray-100 p-3! text-[13px]">
        {children}
      </pre>
    </div>
  );
}

const markdownComponents: Components = {
  pre: MarkdownPre,
};

export function MarkdownBlockView({ block }: MarkdownBlockViewProps) {
  return (
    <div
      className="
        code-block-highlight
        text-[15px] leading-relaxed text-gray-1000
        [&_p]:mb-3 [&_p:last-child]:mb-0
        [&_h1]:mb-3 [&_h1]:mt-5 [&_h1]:text-xl [&_h1]:font-semibold [&_h1:first-child]:mt-0
        [&_h2]:mb-3 [&_h2]:mt-5 [&_h2]:text-lg [&_h2]:font-semibold [&_h2:first-child]:mt-0
        [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-base [&_h3]:font-semibold [&_h3:first-child]:mt-0
        [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5
        [&_ol]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5
        [&_li]:mb-1
        [&_a]:text-blue-700 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-blue-800
        [&_strong]:font-semibold
        [&_blockquote]:mb-3 [&_blockquote]:border-l-2 [&_blockquote]:border-gray-alpha-400 [&_blockquote]:pl-3 [&_blockquote]:text-gray-800
        [&_hr]:my-4 [&_hr]:border-gray-alpha-300
        [&_table]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_table]:text-sm
        [&_th]:border [&_th]:border-gray-alpha-300 [&_th]:bg-gray-100 [&_th]:px-2 [&_th]:py-1 [&_th]:text-left [&_th]:font-medium
        [&_td]:border [&_td]:border-gray-alpha-300 [&_td]:px-2 [&_td]:py-1
        [&_code:not(pre_code)]:rounded-[4px] [&_code:not(pre_code)]:bg-gray-alpha-200 [&_code:not(pre_code)]:px-1.5 [&_code:not(pre_code)]:py-0.5 [&_code:not(pre_code)]:font-mono [&_code:not(pre_code)]:text-[13px]
      ">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={markdownComponents}>
        {block.content}
      </ReactMarkdown>
    </div>
  );
}
