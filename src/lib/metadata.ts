import type { Metadata } from "next";
import { getSiteUrl, site } from "@/lib/site";

/**
 * Shared SEO metadata + JSON-LD helpers — single source of truth so every
 * page emits canonical / Open Graph / Twitter consistently (finding 2).
 */

export type BuildMetadataOptions = {
  title: string;
  description: string;
  /** Canonical path, e.g. "/blog" or "/blog/my-post". */
  path: string;
  /** Defaults to `${title} | ${site.name}` — override for pages whose OG title differs. */
  ogTitle?: string;
  /** Defaults to `description` — override when OG description differs. */
  ogDescription?: string;
  type?: "website" | "article";
  publishedTime?: string;
  authors?: string[];
  tags?: string[];
  robots?: Metadata["robots"];
  /** Include the RSS alternate link (Blog index). */
  includeRss?: boolean;
};

export function buildMetadata(options: BuildMetadataOptions): Metadata {
  const {
    title,
    description,
    path,
    ogTitle,
    ogDescription,
    type = "website",
    publishedTime,
    authors,
    tags,
    robots,
    includeRss = false,
  } = options;
  const fullOgTitle = ogTitle ?? `${title} | ${site.name}`;
  const fullOgDescription = ogDescription ?? description;
  const url = `${getSiteUrl()}${path}`;
  return {
    title,
    description,
    alternates: {
      canonical: path,
      ...(includeRss
        ? { types: { "application/rss+xml": `${getSiteUrl()}/feed.xml` } }
        : {}),
    },
    openGraph: {
      title: fullOgTitle,
      description: fullOgDescription,
      url,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      ...(authors ? { authors } : {}),
      ...(tags ? { tags } : {}),
    } as Metadata["openGraph"],
    twitter: {
      card: "summary",
      title: fullOgTitle,
      description: fullOgDescription,
    },
    ...(robots ? { robots } : {}),
  };
}

/**
 * ItemList JSON-LD for index pages (Blog, Dashboard, Projects,
 * Newsletter, Tag pages). Items are the plain fields for each entry;
 * pass `type` as the schema.org item type.
 */
export type ItemListItem = { type: string } & Record<string, unknown>;

export function buildItemListJsonLd({
  name,
  url,
  items,
}: {
  name: string;
  url: string;
  items: ItemListItem[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    url,
    itemListElement: items.map((entry, index) => {
      const { type, ...rest } = entry;
      return {
        "@type": "ListItem",
        position: index + 1,
        item: { "@type": type, ...rest },
      };
    }),
  };
}
