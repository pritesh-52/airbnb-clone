import Image from 'next/image';
import type { Listing } from '@airbnb-clone/types';
import { AmenityGlyph, MedalIcon } from '@/components/icons';
import { formatBathrooms, pluralise, yearsHosting } from '@/lib/format';
import { Description } from './description';

/** Host strip, capacity summary, highlights and the description block. */
export function Overview({ listing }: { listing: Listing }) {
  const { capacity, host, highlights } = listing;

  return (
    <section aria-labelledby="overview-heading">
      <h2 id="overview-heading" className="sr-only">
        About this place
      </h2>

      {/* The reference leads with the property type and place, not the host —
          the host avatar sits alongside it rather than in the heading. */}
      <div className="flex items-start justify-between gap-6 py-6">
        <div>
          <h3 className="text-xl">
            {listing.propertyType} in {listing.location.city}, {listing.location.country}
          </h3>
          <p className="mt-1 text-base text-ink-muted">
            {pluralise(capacity.guests, 'guest')} · {pluralise(capacity.bedrooms, 'bedroom')} ·{' '}
            {pluralise(capacity.beds, 'bed')} · {formatBathrooms(capacity.bathrooms)}
          </p>
        </div>

        <Image
          src={host.avatarUrl}
          alt={`${host.name}, the host`}
          width={56}
          height={56}
          className="size-14 shrink-0 rounded-full object-cover"
        />
      </div>

      <ul className="divide-y divide-hairline-soft border-y border-hairline-soft">
        {highlights.map((highlight) => (
          <li key={highlight.id} className="flex items-start gap-4 py-6">
            <AmenityGlyph name={highlight.icon} size={24} className="mt-0.5 shrink-0" />
            <div>
              <h4 className="text-base font-semibold">{highlight.title}</h4>
              <p className="mt-0.5 text-sm text-ink-muted">{highlight.description}</p>
            </div>
          </li>
        ))}

        {host.isSuperhost ? (
          <li className="flex items-start gap-4 py-6">
            <MedalIcon size={24} className="mt-0.5 shrink-0" strokeWidth={1.6} />
            <div>
              <h4 className="text-base font-semibold">{host.name} is a Superhost</h4>
              <p className="mt-0.5 text-sm text-ink-muted">
                Superhosts are experienced, highly rated hosts — {host.name} has been hosting for{' '}
                {pluralise(yearsHosting(host.joinedAt), 'year')}.
              </p>
            </div>
          </li>
        ) : null}
      </ul>

      <Description text={listing.description} />
    </section>
  );
}
