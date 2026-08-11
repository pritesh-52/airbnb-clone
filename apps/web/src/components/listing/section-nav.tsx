'use client';

import { useEffect, useRef, useState } from 'react';
import { StarIcon } from '@/components/icons';
import { formatRating } from '@/lib/format';

const SECTIONS = [
  { id: 'photos', label: 'Photos' },
  { id: 'amenities', label: 'Amenities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
] as const;

interface SectionNavProps {
  rating: number;
  reviewsCount: number;
  /** Element the nav appears after — normally the photo gallery. */
  sentinelId: string;
}

/**
 * Secondary nav that slides in once the gallery has scrolled away.
 *
 * Visibility is driven by an IntersectionObserver on a sentinel rather than a
 * scroll listener, so it costs nothing on the main thread while scrolling. The
 * active link is tracked by a second observer over the section headings.
 */
export function SectionNav({ rating, reviewsCount, sentinelId }: SectionNavProps) {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string>(SECTIONS[0].id);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = document.getElementById(sentinelId);
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setVisible(!entry?.isIntersecting && (entry?.boundingClientRect.top ?? 0) < 0),
      { rootMargin: '-80px 0px 0px 0px', threshold: 0 },
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [sentinelId]);

  useEffect(() => {
    const targets = SECTIONS.map((section) => document.getElementById(section.id)).filter(
      (element): element is HTMLElement => element !== null,
    );

    if (targets.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const onScreen = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (onScreen[0]?.target.id) setActive(onScreen[0].target.id);
      },
      // Band just below the sticky header: whichever section crosses it wins.
      { rootMargin: '-140px 0px -70% 0px', threshold: 0 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={navRef}
      className={[
        // Fixed rather than sticky: a sticky bar would reserve vertical space in
        // the flow even while it is faded out, pushing the title down the page.
        'fixed inset-x-0 top-20 z-30 hidden border-b border-hairline-soft bg-white/95 backdrop-blur-sm transition-[opacity,transform] duration-300 ease-airbnb lg:block',
        visible
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none -translate-y-2 opacity-0',
      ].join(' ')}
      // Hidden from AT while off-screen so the links are not reachable by Tab.
      aria-hidden={!visible}
      inert={!visible}
    >
      <div className="mx-auto flex max-w-shell items-center justify-between px-6 lg:px-10 xl:px-20">
        <nav aria-label="Listing sections">
          <ul className="flex gap-8">
            {SECTIONS.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  aria-current={active === section.id ? 'true' : undefined}
                  className={[
                    'inline-block border-b-2 py-5 text-sm transition-colors duration-200',
                    active === section.id
                      ? 'border-ink font-semibold text-ink'
                      : 'border-transparent text-ink-muted hover:text-ink',
                  ].join(' ')}
                >
                  {section.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <p className="flex items-center gap-1.5 text-sm">
            <StarIcon size={12} />
            <span className="font-semibold">{formatRating(rating)}</span>
            <span className="text-ink-muted">· {reviewsCount} reviews</span>
          </p>
          <a href="#booking" className="btn-reserve rounded-lg px-5 py-2.5 text-sm font-semibold">
            Reserve
          </a>
        </div>
      </div>
    </div>
  );
}
