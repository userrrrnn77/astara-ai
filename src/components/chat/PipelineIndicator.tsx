// src/components/chat/PipelineIndicator.tsx

import { useEffect, useState } from "react";

const ESTIMATED_DURATION = 4000;

export function PipelineIndicator() {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setElapsed(Date.now() - start);
    }, 80);
    return () => clearInterval(interval);
  }, []);

  const rawProgress = Math.min(elapsed / ESTIMATED_DURATION, 1);
  const progress = 1 - (1 - rawProgress) ** 3;
  const displayProgress = Math.min(progress * 100, 92);

  return (
    <div className="px-4 py-2.5">
      <div className="mb-2 flex items-center gap-1.5">
        <div className="h-4 w-4 shrink-0 animate-pulse rounded-full bg-gray-1000" />
        <span className="text-xs font-medium text-gray-1000">Menjawab...</span>
      </div>
      <div className="h-1 w-full overflow-hidden rounded-full bg-gray-alpha-200">
        <div
          className="h-full rounded-full bg-gray-1000 transition-[width] duration-150 ease-out"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </div>
  );
}
