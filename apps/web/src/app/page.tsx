import { Amenities } from '@/components/listing/amenities';
import { BookingCard } from '@/components/listing/booking-card';
import { HostCard } from '@/components/listing/host-card';
import { Location } from '@/components/listing/location';
import { Photos } from '@/components/listing/photos';
import { MobileBookingBar } from '@/components/listing/mobile-booking-bar';
import { Overview } from '@/components/listing/overview';
import { Reviews } from '@/components/listing/reviews';
import { SectionNav } from '@/components/listing/section-nav';
import { ThingsToKnow } from '@/components/listing/things-to-know';
import { fetchListing, fetchReviews } from '@/lib/api';
import { LISTING_SLUG } from '@/lib/config';

/**
 * The listing page is rendered per-request against the live API rather than
 * prerendered, so `next build` does not require a running backend and the page
 * always reflects current pricing and availability.
 */
export const dynamic = 'force-dynamic';

export default async function ListingPage() {
  const [listing, reviewsPage] = await Promise.all([
    fetchListing(LISTING_SLUG),
    fetchReviews(LISTING_SLUG, { limit: 6 }),
  ]);

  return (
    <>
      <SectionNav rating={listing.rating} reviewsCount={listing.reviewsCount} sentinelId="photos" />

      <main id="main" className="mx-auto max-w-shell px-6 lg:px-10 xl:px-20">
        {/* Title, hero mosaic, photo tour and lightbox are one interactive unit. */}
        <Photos listing={listing} />

        <div className="grid grid-cols-1 gap-x-24 lg:grid-cols-[1fr_372px]">
          <div>
            <Overview listing={listing} />
            <Amenities amenities={listing.amenities} />
          </div>

          {/* Booking column: sticky on desktop, replaced by the bottom bar below lg. */}
          <aside
            id="booking"
            className="hidden scroll-mt-32 py-8 lg:block"
            aria-label="Reserve this place"
          >
            <BookingCard listing={listing} />
          </aside>
        </div>

        <Reviews
          slug={listing.slug}
          rating={listing.rating}
          reviewsCount={listing.reviewsCount}
          isGuestFavorite={listing.isGuestFavorite}
          breakdown={listing.ratingBreakdown}
          distribution={listing.ratingDistribution}
          topics={listing.reviewTopics}
          initialReviews={reviewsPage.data.reviews}
        />

        <Location location={listing.location} />
        <HostCard host={listing.host} />
        <ThingsToKnow data={listing.thingsToKnow} />
      </main>

      <MobileBookingBar listing={listing} />
    </>
  );
}
