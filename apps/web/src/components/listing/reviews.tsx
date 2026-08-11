'use client';

import Image from 'next/image';
import { useEffect, useState, type ComponentType } from 'react';
import type { RatingBreakdown, RatingDistribution, Review, ReviewTopic } from '@airbnb-clone/types';
import {
  CheckCircleIcon,
  KeyIcon,
  LaurelIcon,
  MapIcon,
  MessageIcon,
  SprayBottleIcon,
  StarIcon,
  TagIcon,
} from '@/components/icons';
import { Modal } from '@/components/ui/modal';
import { fetchReviews } from '@/lib/api';
import { formatMonthYear, formatRating, formatScore } from '@/lib/format';

/** The six category scores, in the order the reference lists them. */
const CATEGORIES: {
  key: keyof RatingBreakdown;
  label: string;
  Icon: ComponentType<{ size?: number }>;
}[] = [
  { key: 'cleanliness', label: 'Cleanliness', Icon: SprayBottleIcon },
  { key: 'accuracy', label: 'Accuracy', Icon: CheckCircleIcon },
  { key: 'checkIn', label: 'Check-in', Icon: KeyIcon },
  { key: 'communication', label: 'Communication', Icon: MessageIcon },
  { key: 'location', label: 'Location', Icon: MapIcon },
  { key: 'value', label: 'Value', Icon: TagIcon },
];

/** Star buckets, highest first. */
const STARS: { key: keyof RatingDistribution; label: string }[] = [
  { key: 'five', label: '5' },
  { key: 'four', label: '4' },
  { key: 'three', label: '3' },
  { key: 'two', label: '2' },
  { key: 'one', label: '1' },
];

interface ReviewsProps {
  slug: string;
  rating: number;
  reviewsCount: number;
  isGuestFavorite: boolean;
  breakdown: RatingBreakdown;
  distribution: RatingDistribution;
  topics: ReviewTopic[];
  initialReviews: Review[];
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <article className="py-2">
      <div className="flex items-center gap-3">
        <Image
          src={review.author.avatarUrl}
          alt=""
          width={48}
          height={48}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <h4 className="text-base font-semibold">{review.author.name}</h4>
          <p className="text-sm text-ink-muted">{review.author.location}</p>
        </div>
      </div>

      <p className="mt-3 flex items-center gap-2 text-xs text-ink-muted">
        <span
          className="flex items-center gap-0.5"
          role="img"
          aria-label={`${review.rating} out of 5 stars`}
        >
          {Array.from({ length: review.rating }, (_, starIndex) => (
            <StarIcon key={starIndex} size={10} />
          ))}
        </span>
        <span aria-hidden="true">·</span>
        <span>{formatMonthYear(review.createdAt)}</span>
      </p>

      <p className="mt-2 text-base">{review.body}</p>
    </article>
  );
}

export function Reviews({
  slug,
  rating,
  reviewsCount,
  isGuestFavorite,
  breakdown,
  distribution,
  topics,
  initialReviews,
}: ReviewsProps) {
  const [open, setOpen] = useState(false);
  const [allReviews, setAllReviews] = useState<Review[]>(initialReviews);
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');

  // Fetch the full set only once the dialog is actually opened. Every state
  // update happens in an async continuation, never synchronously in the effect.
  useEffect(() => {
    if (!open) return;

    const controller = new AbortController();

    fetchReviews(slug, { limit: 50, offset: 0 }, { signal: controller.signal })
      .then(({ data }) => {
        setAllReviews(data.reviews);
        setStatus('idle');
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') return;
        setStatus('error');
      });

    return () => controller.abort();
  }, [open, slug]);

  const busiestBucket = Math.max(...STARS.map((star) => distribution[star.key]), 1);

  return (
    <section
      id="reviews"
      aria-labelledby="reviews-heading"
      className="scroll-mt-32 border-b border-hairline-soft py-12"
    >
      {/* The visual rating is decorative duplication of this sentence. */}
      <p className="sr-only">
        Rated {formatRating(rating)} out of 5 from {reviewsCount} reviews.
      </p>

      {isGuestFavorite ? (
        <div className="flex flex-col items-center text-center">
          <div className="flex items-center justify-center gap-1" aria-hidden="true">
            <LaurelIcon height={92} />
            <span className="text-[5rem] leading-none font-semibold tracking-tight tabular-nums">
              {formatRating(rating)}
            </span>
            <LaurelIcon height={92} className="-scale-x-100" />
          </div>

          <h2 id="reviews-heading" className="mt-6 text-2xl">
            Guest favourite
          </h2>
          <p className="mt-2 max-w-sm text-base text-ink-muted">
            This home is a guest favourite based on ratings, reviews and reliability
          </p>
          <button type="button" className="link-underline mt-4 text-base">
            How reviews work
          </button>
        </div>
      ) : (
        <h2 id="reviews-heading" className="flex items-center gap-2 text-xl">
          <StarIcon size={16} />
          {formatRating(rating)} · {reviewsCount} reviews
        </h2>
      )}

      {/* Distribution + the six category scores, divided into columns at lg. */}
      <div className="mt-12 grid grid-cols-2 gap-y-8 sm:grid-cols-4 lg:grid-cols-7 lg:gap-y-0">
        <div className="col-span-2 sm:col-span-4 lg:col-span-1 lg:pr-6">
          <h3 className="text-sm font-medium">Overall rating</h3>
          <ul className="mt-3 space-y-1">
            {STARS.map((star) => (
              <li key={star.key} className="flex items-center gap-2">
                <span className="w-2 text-xs text-ink-muted tabular-nums">{star.label}</span>
                <span className="h-1 flex-1 overflow-hidden rounded-full bg-hairline">
                  <span
                    className="block h-full rounded-full bg-ink"
                    style={{ width: `${(distribution[star.key] / busiestBucket) * 100}%` }}
                  />
                </span>
                <span className="sr-only">
                  {distribution[star.key]} reviews at {star.label} stars
                </span>
              </li>
            ))}
          </ul>
        </div>

        {CATEGORIES.map(({ key, label, Icon }) => (
          <div key={key} className="lg:border-l lg:border-hairline lg:px-6">
            <h3 className="text-sm font-medium">{label}</h3>
            <p className="mt-1 text-xl font-medium tabular-nums">{formatScore(breakdown[key])}</p>
            <p className="mt-3 text-ink">
              <Icon size={30} />
            </p>
          </div>
        ))}
      </div>

      {/* Themes pulled from the review text. */}
      {topics.length > 0 ? (
        <div
          role="region"
          aria-label="What guests mention most"
          tabIndex={0}
          className="mt-10 overflow-x-auto pb-2"
        >
          <ul className="flex w-max gap-3">
            {topics.map((topic) => (
              <li key={topic.id}>
                <span className="flex items-center gap-2 rounded-xl border border-hairline px-4 py-3 text-sm">
                  <span aria-hidden="true">{topic.emoji}</span>
                  <span className="font-medium">{topic.label}</span>
                  <span className="text-ink-muted tabular-nums">{topic.count}</span>
                  <span className="sr-only">reviews mention this</span>
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="mt-12 grid grid-cols-1 gap-x-24 gap-y-8 md:grid-cols-2">
        {initialReviews.slice(0, 6).map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviewsCount > initialReviews.length ? (
        <button
          type="button"
          onClick={() => {
            setStatus('loading');
            setOpen(true);
          }}
          className="mt-10 rounded-lg border border-ink px-6 py-3 text-base font-semibold transition-colors duration-200 ease-airbnb hover:bg-surface-muted"
        >
          Show all {reviewsCount} reviews
        </button>
      ) : null}

      <Modal open={open} onClose={() => setOpen(false)} title="Reviews" size="lg">
        <h3 className="mb-6 flex items-center gap-2 text-xl">
          <StarIcon size={16} />
          {formatRating(rating)} · {reviewsCount} reviews
        </h3>

        <div aria-live="polite" aria-busy={status === 'loading'}>
          {status === 'loading' ? (
            <p className="py-4 text-sm text-ink-muted">Loading reviews…</p>
          ) : null}
          {status === 'error' ? (
            <p className="py-4 text-sm text-arches" role="alert">
              We could not load the rest of the reviews. Please try again.
            </p>
          ) : null}
        </div>

        <div className="divide-y divide-hairline-soft">
          {allReviews.map((review) => (
            <div key={review.id} className="py-4">
              <ReviewCard review={review} />
            </div>
          ))}
        </div>
      </Modal>
    </section>
  );
}
