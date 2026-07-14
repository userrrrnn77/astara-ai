import { useState } from "react";
import { Check, ChevronRight, Copy, File, Folder } from "lucide-react";
import clsx from "clsx";
import type { TreeBlock, TreeNode } from "../../types/blocks";
import { serializeTreeAsText } from "../../utils/blockSerialize";

interface TreeBlockViewProps {
  block: TreeBlock;
}

function TreeNodeRow({ node, depth }: { node: TreeNode; depth: number }) {
  const [expanded, setExpanded] = useState(true);
  const isFolder = node.type === "folder";
  const hasChildren = isFolder && !!node.children?.length;

  return (
    <div>
      <div
        role={hasChildren ? "button" : undefined}
        tabIndex={hasChildren ? 0 : undefined}
        onClick={() => hasChildren && setExpanded((v) => !v)}
        className={clsx(
          "flex items-center gap-1.5 rounded-sm py-1 pr-2 text-sm text-gray-1000",
          hasChildren && "cursor-pointer hover:bg-gray-alpha-100",
        )}
        style={{ paddingLeft: `${depth * 16 + 4}px` }}>
        {hasChildren ? (
          <ChevronRight
            size={14}
            className={clsx(
              "shrink-0 text-gray-700 transition-transform",
              expanded && "rotate-90",
            )}
          />
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {isFolder ? (
          <Folder size={14} className="shrink-0 text-blue-700" />
        ) : (
          <File size={14} className="shrink-0 text-gray-700" />
        )}
        <span className="truncate font-mono text-[13px]">{node.name}</span>
      </div>

      {hasChildren && expanded && (
        <div>
          {node.children!.map((child, i) => (
            <TreeNodeRow
              key={`${child.name}-${i}`}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeBlockView({ block }: TreeBlockViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(serializeTreeAsText(block.root));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <div className="mb-3 overflow-hidden rounded-(--radius-md) border border-gray-alpha-400 bg-background-200">
      <div className="flex items-center justify-between gap-2 border-b border-gray-alpha-300 bg-gray-100 px-3 py-1.5">
        <span className="text-xs font-medium text-gray-800">
          {block.title ?? "File tree"}
        </span>
        <button
          type="button"
          onClick={handleCopy}
          title="Copy struktur sebagai teks"
          className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-xs text-gray-800 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000">
          {copied ? <Check size={13} /> : <Copy size={13} />}
          Copy
        </button>
      </div>
      <div className="p-2">
        <TreeNodeRow node={block.root} depth={0} />
      </div>
    </div>
  );
}
