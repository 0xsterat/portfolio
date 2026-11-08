import { describe, it, expect } from "vitest";
import { buildMetadata, buildItemListJsonLd } from "@/lib/metadata";

/**
 * Shared SEO metadata + ItemList JSON-LD helpers (finding 2):
 * single source of truth so every page emits canonical/OG/Twitter consistently.
 */
describe("buildMetadata", () => {
  it("builds canonical + Open Graph + Twitter from title/description/path", () => {
    const meta = buildMetadata({
      title: "Blog",
      description: "Blog description",
      path: "/blog",
    });
    expect(meta.title).toBe("Blog");
    expect(meta.description).toBe("Blog description");
    expect(meta.alternates?.canonical).toBe("/blog");
    expect(meta.openGraph).toMatchObject({
      title: expect.stringContaining("Blog"),
      description: "Blog description",
      type: "website",
    });
    const ogUrl = (meta.openGraph as { url?: string }).url ?? "";
    expect(ogUrl).toContain("/blog");
    expect(meta.twitter).toMatchObject({
      card: "summary",
      title: expect.stringContaining("Blog"),
      description: "Blog description",
    });
  });

  it("supports article posts with publishedTime, authors, and tags", () => {
    const meta = buildMetadata({
      title: "A Post",
      description: "Post summary",
      path: "/blog/a-post",
      type: "article",
      publishedTime: "2026-10-24",
      authors: ["Placeholder Persona"],
      tags: ["web"],
    });
    expect(meta.openGraph).toMatchObject({
      type: "article",
      publishedTime: "2026-10-24",
      authors: ["Placeholder Persona"],
      tags: ["web"],
    });
  });
});

describe("buildItemListJsonLd", () => {
  it("builds an ItemList with 1-indexed ListItem positions", () => {
    const ld = buildItemListJsonLd({
      name: "Blog Posts",
      url: "http://localhost:3000/blog",
      items: [
        {
          type: "BlogPosting",
          headline: "First",
          url: "http://localhost:3000/blog/first",
        },
        {
          type: "BlogPosting",
          headline: "Second",
          url: "http://localhost:3000/blog/second",
        },
      ],
    });
    expect(ld["@type"]).toBe("ItemList");
    expect(ld.name).toBe("Blog Posts");
    expect(ld.itemListElement).toHaveLength(2);
    expect(ld.itemListElement[0]).toMatchObject({
      "@type": "ListItem",
      position: 1,
    });
    expect(ld.itemListElement[1]).toMatchObject({
      "@type": "ListItem",
      position: 2,
    });
  });
});
