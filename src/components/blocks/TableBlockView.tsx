import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import type { TableBlock, TableCellValue } from "../../types/blocks";
import {
  serializeTableAsCsv,
  serializeTableAsMarkdown,
} from "../../utils/blockSerialize";

interface TableBlockViewProps {
  block: TableBlock;
}

function formatCell(value: TableCellValue): string {
  if (value === null) return "—";
  return String(value);
}

export function TableBlockView({ block }: TableBlockViewProps) {
  const [copiedFormat, setCopiedFormat] = useState<"md" | "csv" | null>(null);

  async function handleCopy(format: "md" | "csv") {
    const text =
      format === "md"
        ? serializeTableAsMarkdown(block.headers, block.rows, block.title)
        : serializeTableAsCsv(block.headers, block.rows);
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFormat(format);
      setTimeout(() => setCopiedFormat(null), 1500);
    } catch {}
  }

  return (
    <div className="mb-3 overflow-hidden rounded-(--radius-md) border border-gray-alpha-300">
      <div className="flex items-center justify-between gap-2 border-b border-gray-alpha-300 bg-gray-100 px-3 py-1.5">
        <span className="text-sm font-medium text-gray-1000">
          {block.title ?? "Table"}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => handleCopy("md")}
            title="Copy sebagai Markdown"
            className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-xs text-gray-800 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000">
            {copiedFormat === "md" ? <Check size={13} /> : <Copy size={13} />}
            Markdown
          </button>
          <button
            type="button"
            onClick={() => handleCopy("csv")}
            title="Copy sebagai CSV"
            className="flex items-center gap-1 rounded-[4px] px-1.5 py-1 text-xs text-gray-800 transition-colors hover:bg-gray-alpha-200 hover:text-gray-1000">
            {copiedFormat === "csv" ? (
              <Check size={13} />
            ) : (
              <Download size={13} />
            )}
            CSV
          </button>
        </div>
      </div>
      <div className="scrollbar-thin overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr>
              {block.headers.map((header, i) => (
                <th
                  key={i}
                  className="whitespace-nowrap border-b border-gray-alpha-300 bg-gray-100 px-3 py-2 text-left font-medium text-gray-900">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className="border-b border-gray-alpha-200 last:border-b-0 hover:bg-gray-alpha-100">
                {row.map((cell, cellIdx) => (
                  <td
                    key={cellIdx}
                    className="whitespace-nowrap px-3 py-2 text-gray-1000">
                    {formatCell(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
