// src/components/chat/PipelineTrace.tsx

import { useState } from "react";
import { ChevronDown, Sparkles } from "lucide-react";
import clsx from "clsx";
import type { PipelineMeta } from "../../types/chat";

interface PipelineTraceProps {
  meta: PipelineMeta;
}

export function PipelineTrace({ meta }: PipelineTraceProps) {
  const [isOpen, setIsOpen] = useState(false);

  const skipped = meta.skippedStages ?? [];

  if (!meta.model && skipped.length === 0) return null;

  return (
    <div className="mb-3 overflow-hidden rounded-(--radius-md) border border-gray-alpha-300">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 bg-gray-100 px-3 py-2 text-left transition-colors hover:bg-gray-200">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-800">
          <Sparkles size={13} className="text-gray-700" />
          <span>Pipeline: Model</span>
          {skipped.length > 0 && (
            <span className="rounded-[4px] bg-amber-200 px-1.5 py-0.5 text-[11px] font-medium text-amber-900">
              {skipped.join(", ")} di-skip
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={clsx(
            "shrink-0 text-gray-700 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {isOpen && (
        <div className="border-t border-gray-alpha-300 bg-gray-100 p-3">
          <div className="font-mono text-[11px] text-gray-700">
            {meta.model ?? "unknown model"}
          </div>
        </div>
      )}
    </div>
  );
}
