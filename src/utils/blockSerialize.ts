import type {
  GenerativeBlock,
  TableCellValue,
  TreeNode,
} from "../types/blocks";

function serializeBlock(block: GenerativeBlock): string {
  switch (block.type) {
    case "markdown":
      return block.content;

    case "code": {
      const lang = block.language || "";
      const header = block.filename ? `${block.filename}\n` : "";
      return `${header}\`\`\`${lang}\n${block.content}\n\`\`\``;
    }

    case "table":
      return serializeTableAsMarkdown(block.headers, block.rows, block.title);

    case "chart": {
      const title = block.title ? `${block.title}\n` : "";
      return `${title}${JSON.stringify(block.data, null, 2)}`;
    }

    case "tree": {
      const title = block.title ? `${block.title}\n` : "";
      return `${title}${serializeTreeAsText(block.root)}`;
    }

    default:
      return "";
  }
}

export function serializeBlocksToText(blocks: GenerativeBlock[]): string {
  return blocks.map(serializeBlock).join("\n\n").trim();
}

function formatCell(value: TableCellValue): string {
  if (value === null) return "";
  return String(value);
}

export function serializeTableAsMarkdown(
  headers: string[],
  rows: TableCellValue[][],
  title?: string,
): string {
  const lines: string[] = [];
  if (title) lines.push(`**${title}**`);
  lines.push(`| ${headers.join(" | ")} |`);
  lines.push(`| ${headers.map(() => "---").join(" | ")} |`);
  for (const row of rows) {
    lines.push(`| ${row.map(formatCell).join(" | ")} |`);
  }
  return lines.join("\n");
}

export function serializeTableAsCsv(
  headers: string[],
  rows: TableCellValue[][],
): string {
  const escape = (v: string) =>
    /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
  const lines = [headers.map(escape).join(",")];
  for (const row of rows) {
    lines.push(row.map((c) => escape(formatCell(c))).join(","));
  }
  return lines.join("\n");
}

export function serializeTreeAsText(node: TreeNode, depth = 0): string {
  const prefix = depth === 0 ? "" : `${"  ".repeat(depth - 1)}├─ `;
  const line = `${prefix}${node.name}${node.type === "folder" ? "/" : ""}`;
  if (!node.children?.length) return line;
  const childLines = node.children.map((c) =>
    serializeTreeAsText(c, depth + 1),
  );
  return [line, ...childLines].join("\n");
}
