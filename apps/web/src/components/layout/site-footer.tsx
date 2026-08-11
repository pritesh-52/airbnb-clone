import { GlobeIcon } from '@/components/icons';

const FOOTER_COLUMNS = [
  {
    heading: 'Support',
    links: [
      'Help Center',
      'AirCover',
      'Anti-discrimination',
      'Disability support',
      'Cancellation options',
      'Report neighbourhood concern',
    ],
  },
  {
    heading: 'Hosting',
    links: [
      'Airbnb your home',
      'AirCover for Hosts',
      'Hosting resources',
      'Community forum',
      'Hosting responsibly',
      'Airbnb-friendly apartments',
    ],
  },
  {
    heading: 'Airbnb',
    links: [
      'Newsroom',
      'New features',
      'Careers',
      'Investors',
      'Gift cards',
      'Airbnb.org emergency stays',
    ],
  },
] as const;

const LEGAL_LINKS = ['Privacy', 'Terms', 'Sitemap', 'Company details'] as const;

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline-soft bg-surface-muted">
      <div className="mx-auto max-w-shell px-6 py-12 lg:px-10 xl:px-20">
        <div className="grid grid-cols-1 gap-8 border-b border-hairline pb-12 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.heading} aria-labelledby={`footer-${column.heading}`}>
              <h2 id={`footer-${column.heading}`} className="mb-4 text-sm font-semibold">
                {column.heading}
              </h2>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link}>
                    {/*
                      These are placeholders with no destination in the clone.
                      A button is the honest element: an `href="#"` anchor would
                      announce itself as a link that goes nowhere.
                    */}
                    <button
                      type="button"
                      className="text-sm text-ink-muted transition-colors duration-200 hover:text-ink hover:underline"
                    >
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-ink-muted">
            © {new Date().getUTCFullYear()} Airbnb clone ·{' '}
            {LEGAL_LINKS.map((link, index) => (
              <span key={link}>
                {index > 0 ? <span aria-hidden="true"> · </span> : null}
                <button
                  type="button"
                  className="transition-colors duration-200 hover:text-ink hover:underline"
                >
                  {link}
                </button>
              </span>
            ))}
          </p>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <button
              type="button"
              className="flex items-center gap-2 transition-colors duration-200 hover:underline"
            >
              <GlobeIcon size={16} />
              English (US)
            </button>
            <button type="button" className="transition-colors duration-200 hover:underline">
              $ USD
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
