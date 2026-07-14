import type { GenerativeBlock } from "../../types/blocks";
import { MarkdownBlockView } from "./MarkdownBlockView";
import { CodeBlockView } from "./CodeBlockView";
import { TableBlockView } from "./TableBlockView";
import { ChartBlockView } from "./ChartBlockView";
import { TreeBlockView } from "./TreeBlockView";

interface BlockRendererProps {
  blocks: GenerativeBlock[];
}

export function BlockRenderer({ blocks }: BlockRendererProps) {
  return (
    <>
      {blocks.map((block, i) => {
        switch (block.type) {
          case "markdown":
            return <MarkdownBlockView key={i} block={block} />;
          case "code":
            return <CodeBlockView key={i} block={block} />;
          case "table":
            return <TableBlockView key={i} block={block} />;
          case "chart":
            return <ChartBlockView key={i} block={block} />;
          case "tree":
            return <TreeBlockView key={i} block={block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
