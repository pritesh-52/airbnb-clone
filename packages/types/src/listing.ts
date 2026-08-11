import { z } from 'zod';

/**
 * Domain schemas for the listing page.
 *
 * These zod schemas are the single source of truth: the API validates its
 * outbound payloads against them and the web app infers its props from them,
 * so a contract change breaks the type-check on both sides at once.
 */

/** Icon keys the web app knows how to render. Keep in sync with `web/src/components/icons`. */
export const amenityIconSchema = z.enum([
  'wifi',
  'kitchen',
  'parking',
  'pool',
  'air-conditioning',
  'heating',
  'tv',
  'washer',
  'dryer',
  'workspace',
  'hot-tub',
  'bbq',
  'fireplace',
  'gym',
  'beach',
  'pets',
  'smoke-alarm',
  'first-aid',
  'security-camera',
  'self-check-in',
]);
export type AmenityIcon = z.infer<typeof amenityIconSchema>;

export const amenityCategorySchema = z.enum([
  'popular',
  'bathroom',
  'bedroom',
  'entertainment',
  'family',
  'heating-cooling',
  'safety',
  'outdoor',
  'parking',
  'services',
]);
export type AmenityCategory = z.infer<typeof amenityCategorySchema>;

export const imageSchema = z.object({
  id: z.string().min(1),
  url: z.url(),
  alt: z.string().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});
export type ListingImage = z.infer<typeof imageSchema>;

/**
 * A room/area group in the photo tour, e.g. "Living room 1".
 *
 * `amenities` is the short prose list rendered under the category heading
 * ("Sofa · Air conditioning · Ceiling fan · TV") — free text rather than
 * `Amenity` records, because the tour shows what is *in that room*, which does
 * not always map onto the listing's amenity taxonomy.
 */
export const photoCategorySchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  amenities: z.array(z.string().min(1)),
  images: z.array(imageSchema).min(1),
});
export type PhotoCategory = z.infer<typeof photoCategorySchema>;

export const amenitySchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
  description: z.string().optional(),
  icon: amenityIconSchema,
  category: amenityCategorySchema,
  /** `false` renders struck-through, matching how Airbnb shows missing amenities. */
  available: z.boolean(),
});
export type Amenity = z.infer<typeof amenitySchema>;

export const hostSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  avatarUrl: z.url(),
  isSuperhost: z.boolean(),
  /** ISO-8601 date, e.g. `2015-04-01`. */
  joinedAt: z.iso.date(),
  responseRate: z.number().int().min(0).max(100),
  responseTime: z.string().min(1),
  reviewsCount: z.number().int().nonnegative(),
  rating: z.number().min(0).max(5),
  about: z.string().min(1),
  languages: z.array(z.string().min(1)).min(1),
  isVerified: z.boolean(),
  work: z.string().optional(),
});
export type Host = z.infer<typeof hostSchema>;

export const reviewAuthorSchema = z.object({
  name: z.string().min(1),
  avatarUrl: z.url(),
  location: z.string().min(1),
});
export type ReviewAuthor = z.infer<typeof reviewAuthorSchema>;

export const reviewSchema = z.object({
  id: z.string().min(1),
  author: reviewAuthorSchema,
  rating: z.number().int().min(1).max(5),
  /** ISO-8601 date the review was left. */
  createdAt: z.iso.date(),
  body: z.string().min(1),
});
export type Review = z.infer<typeof reviewSchema>;

export const ratingBreakdownSchema = z.object({
  cleanliness: z.number().min(0).max(5),
  accuracy: z.number().min(0).max(5),
  checkIn: z.number().min(0).max(5),
  communication: z.number().min(0).max(5),
  location: z.number().min(0).max(5),
  value: z.number().min(0).max(5),
});
export type RatingBreakdown = z.infer<typeof ratingBreakdownSchema>;

/** How many reviews awarded each star value, driving the distribution bars. */
export const ratingDistributionSchema = z.object({
  five: z.number().int().nonnegative(),
  four: z.number().int().nonnegative(),
  three: z.number().int().nonnegative(),
  two: z.number().int().nonnegative(),
  one: z.number().int().nonnegative(),
});
export type RatingDistribution = z.infer<typeof ratingDistributionSchema>;

/**
 * Themes surfaced from the review text, shown as chips under the rating
 * summary. `emoji` is part of the content, not decoration — it is what the
 * reference renders alongside each label.
 */
export const reviewTopicSchema = z.object({
  id: z.string().min(1),
  emoji: z.string().min(1),
  label: z.string().min(1),
  count: z.number().int().positive(),
});
export type ReviewTopic = z.infer<typeof reviewTopicSchema>;

export const capacitySchema = z.object({
  guests: z.number().int().positive(),
  bedrooms: z.number().int().nonnegative(),
  beds: z.number().int().positive(),
  bathrooms: z.number().positive(),
});
export type Capacity = z.infer<typeof capacitySchema>;

export const highlightSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
  icon: amenityIconSchema,
});
export type Highlight = z.infer<typeof highlightSchema>;

export const locationSchema = z.object({
  city: z.string().min(1),
  region: z.string().min(1),
  country: z.string().min(1),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  /** Prose blurb rendered under the map. */
  neighbourhood: z.string().min(1),
});
export type ListingLocation = z.infer<typeof locationSchema>;

export const pricingSchema = z.object({
  currency: z.string().length(3),
  nightlyRate: z.number().positive(),
  cleaningFee: z.number().nonnegative(),
  /** Fraction of the subtotal, e.g. `0.14` for 14%. */
  serviceFeeRate: z.number().min(0).max(1),
  taxRate: z.number().min(0).max(1),
  /** Fraction discounted for stays of 7+ nights. */
  weeklyDiscountRate: z.number().min(0).max(1),
});
export type Pricing = z.infer<typeof pricingSchema>;

export const availabilitySchema = z.object({
  minimumNights: z.number().int().positive(),
  maximumNights: z.number().int().positive(),
  /** ISO-8601 dates that cannot be booked. */
  blockedDates: z.array(z.iso.date()),
  checkInTime: z.string().min(1),
  checkOutTime: z.string().min(1),
});
export type Availability = z.infer<typeof availabilitySchema>;

export const houseRuleSchema = z.object({
  id: z.string().min(1),
  label: z.string().min(1),
});
export type HouseRule = z.infer<typeof houseRuleSchema>;

export const thingsToKnowSchema = z.object({
  houseRules: z.array(houseRuleSchema),
  safetyAndProperty: z.array(houseRuleSchema),
  cancellationPolicy: z.array(houseRuleSchema),
});
export type ThingsToKnow = z.infer<typeof thingsToKnowSchema>;

export const listingSchema = z.object({
  id: z.string().min(1),
  slug: z.string().min(1),
  title: z.string().min(1),
  /** e.g. "Entire villa". */
  propertyType: z.string().min(1),
  location: locationSchema,
  rating: z.number().min(0).max(5),
  reviewsCount: z.number().int().nonnegative(),
  isGuestFavorite: z.boolean(),
  /** The five photos in the hero mosaic; drawn from `photoTour`. */
  images: z.array(imageSchema).min(5),
  /** Every photo, grouped by room, in the order the photo tour presents them. */
  photoTour: z.array(photoCategorySchema).min(1),
  capacity: capacitySchema,
  highlights: z.array(highlightSchema),
  description: z.string().min(1),
  amenities: z.array(amenitySchema),
  host: hostSchema,
  pricing: pricingSchema,
  availability: availabilitySchema,
  ratingBreakdown: ratingBreakdownSchema,
  ratingDistribution: ratingDistributionSchema,
  reviewTopics: z.array(reviewTopicSchema),
  thingsToKnow: thingsToKnowSchema,
});
export type Listing = z.infer<typeof listingSchema>;

/** Listing payload without the review list, which is paginated separately. */
export const listingSummarySchema = listingSchema.pick({
  id: true,
  slug: true,
  title: true,
  propertyType: true,
  location: true,
  rating: true,
  reviewsCount: true,
  images: true,
  pricing: true,
});
export type ListingSummary = z.infer<typeof listingSummarySchema>;
