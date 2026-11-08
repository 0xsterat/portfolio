import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";
import type { Content, Parent, Root, Text } from "hast";

/**
 * Markdown rendering for Blog Post bodies (ticket #3). Turns Placeholder
 * MDX content (Markdown subset: headings, paragraphs, fenced code) into
 * highlighted HTML. Raw HTML in content is escaped to text so a Blog Post
 * can never inject markup — content is trusted Placeholder files, but
 * defense-in-depth keeps the reader safe even if a post contains `<script>`.
 */

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(rehypeHighlight)
  .use(escapeRawHtml)
  .use(rehypeStringify, { allowDangerousHtml: true });

/** Convert hast `raw` nodes (embedded HTML) into escaped text nodes. */
function escapeRawHtml() {
  return (tree: Root) => {
    const visit = (node: Parent | Root) => {
      for (const child of node.children ?? []) {
        if (child.type === "raw") {
          const value = (child as { value?: string }).value ?? "";
          const text: Text = { type: "text", value };
          const index = (node.children as Content[]).indexOf(child);
          (node.children as Content[]).splice(index, 1, text);
          continue;
        }
        if (child.type === "element") {
          visit(child);
        }
      }
    };
    visit(tree);
  };
}

export async function renderMarkdownToHtml(markdown: string): Promise<string> {
  const file = await processor.process(markdown);
  return String(file);
}
