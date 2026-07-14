import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-alpha-100 text-gray-800">
        <Sparkles size={22} />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-gray-1000">Astara AI</h2>
        <p className="mt-1 text-sm text-gray-700">
          Mulai percakapan baru di bawah, dengan Generative UI.
        </p>
      </div>
    </div>
  );
}
