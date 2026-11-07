import Link from "next/link";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Not Found",
  description: "This page does not exist. Browse Blog Posts, Dashboard, Projects, Newsletter Issues, or About.",
  ogDescription: "This page does not exist on Placeholder Portfolio.",
  path: "/404",
  robots: { index: false, follow: false },
});

export default function NotFound() {
  return (
    <div className="py-16 text-center">
      <p className="text-sm font-medium tracking-wide text-accent">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">This page drifted off the map</h1>
      <p className="mx-auto mt-3 max-w-prose text-neutral-600 dark:text-neutral-400">
        The URL you followed doesn&apos;t exist here. Try the homepage, Blog
        Posts, Dashboard, Projects, Newsletter Issues, or About.
      </p>
      <div className="mt-6 flex justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-dark"
        >
          Home
        </Link>
        <Link
          href="/about"
          className="rounded-full border border-neutral-300 px-4 py-2 text-sm dark:border-neutral-700"
        >
          About
        </Link>
      </div>
    </div>
  );
}
