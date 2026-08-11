import type { ListingLocation } from '@airbnb-clone/types';

/**
 * "Where you'll be".
 *
 * The reference embeds an interactive map behind an API key. This renders a
 * static, self-contained placeholder with the same footprint and exposes the
 * coordinates as text so the information is not lost — see the README.
 */
export function Location({ location }: { location: ListingLocation }) {
  const place = `${location.city}, ${location.region}, ${location.country}`;

  return (
    <section id="location" className="scroll-mt-32 border-b border-hairline-soft py-12">
      <h2 className="text-xl">Where you&rsquo;ll be</h2>
      <p className="mt-2 text-base text-ink-muted">{place}</p>

      <div
        className="relative mt-6 aspect-16/9 w-full overflow-hidden rounded-card bg-surface-muted md:aspect-21/9"
        role="img"
        aria-label={`Map showing the approximate location of the listing in ${place}`}
      >
        {/* Decorative grid standing in for map tiles. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
        <div aria-hidden="true" className="absolute inset-0 grid place-items-center">
          <span className="relative flex size-24 items-center justify-center">
            <span className="absolute inset-0 rounded-full bg-rausch/15" />
            <span className="absolute inset-6 rounded-full bg-rausch/25" />
            <span className="relative size-4 rounded-full bg-rausch ring-4 ring-white" />
          </span>
        </div>
        <p className="absolute right-3 bottom-3 rounded bg-white/85 px-2 py-1 text-2xs text-ink-muted">
          {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
        </p>
      </div>

      <p className="mt-6 max-w-2xl text-base">{location.neighbourhood}</p>
    </section>
  );
}
