// --- Markdown / Text Block ---
export interface MarkdownBlock {
  type: "markdown";
  content: string;
}

// --- Code Block ---
export interface CodeBlock {
  type: "code";
  language: string; // default "plaintext" di backend
  filename?: string;
  content: string;
}

// --- Table Block ---
export type TableCellValue = string | number | null;

export interface TableBlock {
  type: "table";
  title?: string;
  headers: string[];
  rows: TableCellValue[][];
}

// --- Chart Block ---
export type ChartType = "line" | "bar" | "pie" | "area" | "scatter";

export type ChartDataPoint = Record<string, string | number>;

export interface ChartBlock {
  type: "chart";
  chartType: ChartType;
  title?: string;
  xKey: string;
  dataKeys: string[];
  data: ChartDataPoint[];
}

// --- Tree Block (folder/directory structure) ---
export interface TreeNode {
  name: string;
  type: "file" | "folder";
  children?: TreeNode[];
}

export interface TreeBlock {
  type: "tree";
  title?: string;
  root: TreeNode;
}

// --- Union of all blocks ---
export type GenerativeBlock =
  | MarkdownBlock
  | CodeBlock
  | TableBlock
  | ChartBlock
  | TreeBlock;

export type BlockType = GenerativeBlock["type"];
