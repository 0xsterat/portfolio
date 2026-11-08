export default function Loading() {
  return (
    <div data-testid="global-loading" className="py-16 text-center">
      <p className="text-sm font-medium tracking-wide text-accent">Loading</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Loading this section</h1>
      <p className="mx-auto mt-3 max-w-prose text-neutral-600 dark:text-neutral-400">
        Blog Posts, Dashboard, Projects, Newsletter Issues, or About are loading.
      </p>
    </div>
  );
}
