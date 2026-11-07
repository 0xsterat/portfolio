"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div data-testid="global-error" className="py-16 text-center">
      <p className="text-sm font-medium tracking-wide text-accent">Something went wrong</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">This section hit an error</h1>
      <p className="mx-auto mt-3 max-w-prose text-neutral-600 dark:text-neutral-400">
        The page you asked for failed to render. Try again or head back to the
        homepage, Blog Posts, Dashboard, Projects, Newsletter Issues, or About.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Try again
        </button>
        <Link
          href="/"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
