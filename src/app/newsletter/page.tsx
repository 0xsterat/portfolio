import { loadNewsletterIssues } from "@/lib/newsletter";
import { formatDateShort } from "@/lib/date";
import { buildMetadata, buildItemListJsonLd } from "@/lib/metadata";
import { getSiteUrl } from "@/lib/site";

const description =
  "Placeholder Newsletter Issues from the Placeholder Persona, linking out to Substack.";

export const metadata = buildMetadata({
  title: "Newsletter",
  description,
  path: "/newsletter",
});

export default function NewsletterPage() {
  const issues = loadNewsletterIssues();
  const jsonLd = buildItemListJsonLd({
    name: "Newsletter Issues",
    url: `${getSiteUrl()}/newsletter`,
    items: issues.map((issue) => ({
      type: "Article",
      headline: issue.title,
      description: issue.description,
      url: issue.url,
      datePublished: String(issue.date),
    })),
  });

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <h1 className="text-3xl font-bold tracking-tight">Newsletter</h1>
      <p className="mt-4 max-w-prose text-neutral-600 dark:text-neutral-300">
        Placeholder Newsletter Issues — read the full edition on Substack
        (external link).
      </p>

      <ul className="mt-8 flex flex-col gap-4">
        {issues.map((issue) => (
          <li key={issue.title}>
            <article
              data-testid="newsletter-issue"
              className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <h2 className="font-medium">{issue.title}</h2>
              <time
                dateTime={issue.date}
                className="mt-1 block text-sm text-neutral-500 dark:text-neutral-400"
              >
                {formatDateShort(issue.date)}
              </time>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {issue.description}
              </p>
              <a
                href={issue.url}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="newsletter-external-link"
                aria-label={`Read ${issue.title} (opens in a new tab)`}
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-accent hover:underline"
              >
                Read
                <span aria-hidden="true">↗</span>
                <span className="sr-only">external</span>
              </a>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
