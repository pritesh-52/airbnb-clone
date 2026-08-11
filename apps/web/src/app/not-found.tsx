import Link from 'next/link';

export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-2xl px-6 py-24 text-center">
      <h1 className="text-2xl">We can&rsquo;t find that page</h1>
      <p className="mt-4 text-base text-ink-muted">
        The link may be out of date, or the listing may no longer be available.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-lg border border-ink px-6 py-3 text-base font-semibold transition-colors duration-200 hover:bg-surface-muted"
      >
        Back to the listing
      </Link>
    </main>
  );
}
