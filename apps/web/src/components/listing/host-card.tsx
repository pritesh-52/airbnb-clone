import Image from 'next/image';
import type { Host } from '@airbnb-clone/types';
import { MedalIcon, StarIcon, VerifiedIcon } from '@/components/icons';
import { formatYear, pluralise } from '@/lib/format';

export function HostCard({ host }: { host: Host }) {
  return (
    <section
      aria-labelledby="host-heading"
      className="scroll-mt-32 border-b border-hairline-soft py-12"
    >
      <div className="flex items-center gap-4">
        <Image
          src={host.avatarUrl}
          alt=""
          width={64}
          height={64}
          className="size-16 rounded-full object-cover"
        />
        <div>
          <h2 id="host-heading" className="text-xl">
            Hosted by {host.name}
          </h2>
          <p className="mt-0.5 text-sm text-ink-muted">Joined in {formatYear(host.joinedAt)}</p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-x-16 gap-y-8 md:grid-cols-2">
        <div>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <StarIcon size={12} />
              {pluralise(host.reviewsCount, 'review')}
            </li>
            {host.isVerified ? (
              <li className="flex items-center gap-2">
                <VerifiedIcon size={16} />
                Identity verified
              </li>
            ) : null}
            {host.isSuperhost ? (
              <li className="flex items-center gap-2">
                <MedalIcon size={16} strokeWidth={1.6} />
                Superhost
              </li>
            ) : null}
          </ul>

          <p className="mt-6 text-base">{host.about}</p>
        </div>

        <div>
          <dl className="space-y-1 text-sm">
            {host.work ? (
              <div className="flex gap-2">
                <dt className="text-ink-muted">My work:</dt>
                <dd>{host.work}</dd>
              </div>
            ) : null}
            <div className="flex gap-2">
              <dt className="text-ink-muted">Languages:</dt>
              <dd>{host.languages.join(', ')}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-muted">Response rate:</dt>
              <dd>{host.responseRate}%</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-muted">Response time:</dt>
              <dd>{host.responseTime}</dd>
            </div>
          </dl>

          <button
            type="button"
            className="mt-6 rounded-lg border border-ink px-6 py-3 text-base font-semibold transition-colors duration-200 ease-airbnb hover:bg-surface-muted"
          >
            Contact host
          </button>

          <p className="mt-6 flex items-start gap-2 text-xs text-ink-muted">
            <span aria-hidden="true">🛡️</span>
            To protect your payment, never transfer money or communicate outside of the Airbnb
            website or app.
          </p>
        </div>
      </div>
    </section>
  );
}
