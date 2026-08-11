import type { Listing, PhotoCategory, Review } from '@airbnb-clone/types';

/**
 * Seed dataset. In a production build this module would be replaced by a
 * repository backed by a database — the service layer only depends on the
 * shapes below, so swapping the source does not ripple outward.
 *
 * Content follows the reference listing: a 1BHK serviced apartment in
 * Candolim, Goa. Photography is licensed Unsplash standing in for the real
 * listing photos (see "Known deviations" in the README).
 */

const photo = (id: string, width = 1200, height = 800) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&h=${height}&q=80`;

const portrait = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=160&h=160&q=80`;

/**
 * The photo tour is the source of truth for imagery. The hero mosaic on the
 * listing page is selected from it below, so the two can never drift apart.
 */
const photoTour: PhotoCategory[] = [
  {
    id: 'cat_living_1',
    name: 'Living room 1',
    amenities: ['Sofa', 'Air conditioning', 'Ceiling fan', 'TV'],
    images: [
      {
        id: 'p_lr1_1',
        url: photo('photo-1600607687939-ce8a6c25118c'),
        alt: 'Living room with a tan sofa, patterned rug and dining area beyond',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_lr1_2',
        url: photo('photo-1618221195710-dd6b41faaea6'),
        alt: 'Living room looking towards the kitchen and wooden cabinetry',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_lr1_3',
        url: photo('photo-1567767292278-a4f21aa2d36e'),
        alt: 'Wall-mounted TV above a wooden sideboard in the living room',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_living_2',
    name: 'Living room 2',
    amenities: ['Ceiling fan', 'Hot tub'],
    images: [
      {
        id: 'p_lr2_1',
        url: photo('photo-1512917774080-9991f1c4c750'),
        alt: 'Second lounge with wicker armchairs and a glass coffee table',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_lr2_2',
        url: photo('photo-1584622650111-993a426fbf0a'),
        alt: 'Sunken jacuzzi set into a wooden deck surround',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_lr2_3',
        url: photo('photo-1493809842364-78817add7ffb'),
        alt: 'Lounge seating beneath the ceiling fan with the jacuzzi behind',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_kitchen',
    name: 'Full kitchen',
    amenities: ['Refrigerator', 'Microwave', 'Cooking basics', 'Dishes and silverware'],
    images: [
      {
        id: 'p_k_1',
        url: photo('photo-1600585154340-be6161a56a0c'),
        alt: 'Kitchen with dark wood cabinetry and a pendant light',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_k_2',
        url: photo('photo-1556909212-d5b604d0c90d'),
        alt: 'Kitchen counter with a hob and overhead storage',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_k_3',
        url: photo('photo-1556911220-bff31c812dba'),
        alt: 'Kitchen sink and worktop with the window above',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_bedroom',
    name: 'Bedroom',
    amenities: ['1 queen bed', 'Air conditioning', 'Ceiling fan', 'TV'],
    images: [
      {
        id: 'p_b_1',
        url: photo('photo-1600566753086-00f18fb6b3ea'),
        alt: 'Bedroom with a queen bed, linen bedding and a bedside lamp',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_b_2',
        url: photo('photo-1522708323590-d24dbb6b0267'),
        alt: 'Bedroom looking towards the balcony doors',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_b_3',
        url: photo('photo-1505693416388-ac5ce068fe85'),
        alt: 'Bed with a wardrobe and mirror alongside',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_bathroom',
    name: 'Full bathroom',
    amenities: ['Hot water', 'Shampoo', 'Hair dryer', 'Towels'],
    images: [
      {
        id: 'p_ba_1',
        url: photo('photo-1600210492486-724fe5c67fb0'),
        alt: 'Bathroom with a marble vanity and round mirror',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_ba_2',
        url: photo('photo-1552321554-5fefe8c9ef14'),
        alt: 'Walk-in shower with a glass screen',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_gym',
    name: 'Gym',
    amenities: ['Exercise equipment'],
    images: [
      {
        id: 'p_g_1',
        url: photo('photo-1534438327276-14e5300c3a48'),
        alt: 'Shared gym with free weights and a bench',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_g_2',
        url: photo('photo-1571902943202-507ec2618e8f'),
        alt: 'Cardio machines along the gym window',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_exterior',
    name: 'Exterior',
    amenities: ['Free parking on premises'],
    images: [
      {
        id: 'p_e_1',
        url: photo('photo-1600596542815-ffad4c1539a9'),
        alt: 'Apartment building exterior seen from the garden',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_e_2',
        url: photo('photo-1580587771525-78b9dba3b914'),
        alt: 'Building frontage and the driveway approach',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_pool',
    name: 'Pool',
    amenities: ['Shared outdoor pool', 'Open all year'],
    images: [
      {
        id: 'p_p_1',
        url: photo('photo-1613490493576-7fde63acd811'),
        alt: 'Shared swimming pool in the central courtyard',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_p_2',
        url: photo('photo-1571003123894-1f0594d2b5d9'),
        alt: 'Sun loungers along the poolside',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_p_3',
        url: photo('photo-1544551763-46a013bb70d5'),
        alt: 'Pool at dusk with the building lit behind',
        width: 1200,
        height: 800,
      },
    ],
  },
  {
    id: 'cat_additional',
    name: 'Additional photos',
    amenities: [],
    images: [
      {
        id: 'p_a_1',
        url: photo('photo-1524758631624-e2822e304c36'),
        alt: 'Seating area detail with cushions and side table',
        width: 1200,
        height: 800,
      },
      {
        id: 'p_a_2',
        url: photo('photo-1507652313519-d4e9174996dd'),
        alt: 'Balcony seating looking out over the greenery',
        width: 1200,
        height: 800,
      },
    ],
  },
];

/** Flattened tour order — the sequence the lightbox steps through. */
export const allPhotos = photoTour.flatMap((category) => category.images);

const findPhoto = (id: string) => {
  const match = allPhotos.find((image) => image.id === id);
  if (!match) throw new Error(`Hero mosaic references unknown photo "${id}".`);
  return match;
};

/** The five-photo hero mosaic, selected from the tour so the two cannot drift. */
const heroImages = ['p_lr2_1', 'p_b_1', 'p_lr2_2', 'p_lr1_3', 'p_e_1'].map(findPhoto);

export const listing: Listing = {
  id: 'lst_ug10',
  slug: 'romantic-jacuzzi-1bhk-candolim',
  title: 'Romantic Jacuzzi 1BHK Candolim | Mirashya UG10',
  propertyType: 'Entire serviced apartment',
  location: {
    city: 'Candolim',
    region: 'Goa',
    country: 'India',
    latitude: 15.518,
    longitude: 73.762,
    neighbourhood:
      'Candolim sits between Calangute and Sinquerim on north Goa’s coast. The beach is a ten-minute walk down a quiet lane, and the Fort Aguada road nearby has a run of cafés, bakeries and scooter rentals. Evenings are calm — the busier stretch of Calangute is a short drive north.',
  },
  rating: 4.95,
  reviewsCount: 143,
  isGuestFavorite: true,
  images: heroImages,
  photoTour,
  capacity: {
    guests: 3,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
  },
  highlights: [
    {
      id: 'hl_self_check_in',
      title: 'Self check-in',
      description: 'Check yourself in with the keypad at the apartment door.',
      icon: 'self-check-in',
    },
    {
      id: 'hl_hot_tub',
      title: 'Soak in the jacuzzi',
      description: 'The private jacuzzi in the second living room is yours alone.',
      icon: 'hot-tub',
    },
    {
      id: 'hl_location',
      title: 'Great location',
      description: '95% of recent guests gave the location a 5-star rating.',
      icon: 'beach',
    },
  ],
  description:
    'A one-bedroom serviced apartment a short walk from Candolim beach, with a private jacuzzi set into the second living room and a shared pool and gym downstairs.\n\nThe main living room has a sofa, dining table and a full kitchen along one wall — enough to cook properly rather than just reheat. The second living room is the reason most people book: wicker seating, a ceiling fan, and the jacuzzi under soft wall lighting.\n\nThe bedroom is air-conditioned with a queen bed and its own TV. Housekeeping comes through daily, and the building has covered parking, a shared pool in the courtyard and a small gym.',
  amenities: [
    {
      id: 'am_hot_tub',
      label: 'Private jacuzzi',
      icon: 'hot-tub',
      category: 'popular',
      available: true,
    },
    {
      id: 'am_pool',
      label: 'Shared outdoor pool',
      description: 'Open all year',
      icon: 'pool',
      category: 'outdoor',
      available: true,
    },
    {
      id: 'am_wifi',
      label: 'Fast wifi – 110 Mbps',
      icon: 'wifi',
      category: 'popular',
      available: true,
    },
    { id: 'am_kitchen', label: 'Kitchen', icon: 'kitchen', category: 'popular', available: true },
    {
      id: 'am_ac',
      label: 'Air conditioning',
      icon: 'air-conditioning',
      category: 'heating-cooling',
      available: true,
    },
    {
      id: 'am_tv',
      label: 'TV in every room',
      icon: 'tv',
      category: 'entertainment',
      available: true,
    },
    { id: 'am_gym', label: 'Shared gym', icon: 'gym', category: 'popular', available: true },
    {
      id: 'am_parking',
      label: 'Free parking on premises',
      icon: 'parking',
      category: 'parking',
      available: true,
    },
    {
      id: 'am_washer',
      label: 'Washing machine',
      icon: 'washer',
      category: 'popular',
      available: true,
    },
    {
      id: 'am_workspace',
      label: 'Dedicated workspace',
      icon: 'workspace',
      category: 'popular',
      available: true,
    },
    {
      id: 'am_beach',
      label: 'Beach access – 10 min walk',
      icon: 'beach',
      category: 'outdoor',
      available: true,
    },
    {
      id: 'am_self_checkin',
      label: 'Self check-in with keypad',
      icon: 'self-check-in',
      category: 'services',
      available: true,
    },
    {
      id: 'am_smoke_alarm',
      label: 'Smoke alarm',
      icon: 'smoke-alarm',
      category: 'safety',
      available: true,
    },
    {
      id: 'am_first_aid',
      label: 'First aid kit',
      icon: 'first-aid',
      category: 'safety',
      available: true,
    },
    {
      id: 'am_camera',
      label: 'Security camera in the lobby',
      description: 'Common areas only',
      icon: 'security-camera',
      category: 'safety',
      available: true,
    },
    { id: 'am_dryer', label: 'Dryer', icon: 'dryer', category: 'popular', available: false },
    { id: 'am_bbq', label: 'BBQ grill', icon: 'bbq', category: 'outdoor', available: false },
    { id: 'am_pets', label: 'Pets allowed', icon: 'pets', category: 'family', available: false },
    {
      id: 'am_heating',
      label: 'Heating',
      icon: 'heating',
      category: 'heating-cooling',
      available: false,
    },
    {
      id: 'am_fireplace',
      label: 'Indoor fireplace',
      icon: 'fireplace',
      category: 'popular',
      available: false,
    },
  ],
  host: {
    id: 'hst_mirashya',
    name: 'Pooja',
    avatarUrl: portrait('photo-1494790108377-be9c29b29330'),
    isSuperhost: true,
    joinedAt: '2019-06-01',
    responseRate: 100,
    responseTime: 'within an hour',
    reviewsCount: 412,
    rating: 4.89,
    about:
      'I look after a handful of serviced apartments in north Goa under the Mirashya name. I live nearby in Saligao, so if something needs sorting I can usually be there the same day. Happy to help with scooter hire, airport pickups or a table at the places locals actually eat.',
    languages: ['English', 'Hindi', 'Konkani', 'Marathi'],
    isVerified: true,
    work: 'Serviced apartment host',
  },
  pricing: {
    currency: 'INR',
    nightlyRate: 4250,
    cleaningFee: 800,
    serviceFeeRate: 0.142,
    taxRate: 0.12,
    weeklyDiscountRate: 0.1,
  },
  availability: {
    minimumNights: 2,
    maximumNights: 30,
    blockedDates: [
      '2026-08-14',
      '2026-08-15',
      '2026-08-16',
      '2026-08-29',
      '2026-08-30',
      '2026-09-05',
      '2026-09-06',
      '2026-09-07',
      '2026-09-19',
      '2026-09-20',
      '2026-10-02',
      '2026-10-03',
      '2026-10-04',
      '2026-12-24',
      '2026-12-25',
      '2026-12-26',
      '2026-12-31',
    ],
    checkInTime: 'After 2:00 PM',
    checkOutTime: '11:00 AM',
  },
  ratingBreakdown: {
    cleanliness: 5.0,
    accuracy: 5.0,
    checkIn: 5.0,
    communication: 5.0,
    location: 4.8,
    value: 4.8,
  },
  // Weighted mean of these counts is 4.95, matching `rating` above.
  ratingDistribution: {
    five: 137,
    four: 5,
    three: 1,
    two: 0,
    one: 0,
  },
  reviewTopics: [
    { id: 'topic_hospitality', emoji: '🎁', label: 'Hospitality', count: 8 },
    { id: 'topic_comfort', emoji: '🛋️', label: 'Comfort', count: 6 },
    { id: 'topic_accuracy', emoji: '✅', label: 'Accuracy', count: 5 },
    { id: 'topic_hot_tub', emoji: '🛁', label: 'Hot tub', count: 5 },
    { id: 'topic_condition', emoji: '✨', label: 'Condition', count: 4 },
    { id: 'topic_cleanliness', emoji: '🧼', label: 'Cleanliness', count: 4 },
    { id: 'topic_location', emoji: '📍', label: 'Location', count: 3 },
    { id: 'topic_amenities', emoji: '🧺', label: 'Amenities', count: 2 },
  ],
  thingsToKnow: {
    houseRules: [
      { id: 'hr_checkin', label: 'Check-in after 2:00 PM' },
      { id: 'hr_checkout', label: 'Checkout before 11:00 AM' },
      { id: 'hr_guests', label: '3 guests maximum' },
      { id: 'hr_pets', label: 'No pets' },
      { id: 'hr_parties', label: 'No parties or events' },
      { id: 'hr_smoking', label: 'No smoking indoors' },
    ],
    safetyAndProperty: [
      { id: 'sp_camera', label: 'Security camera in the building lobby' },
      { id: 'sp_pool', label: 'Shared pool has no gate or fence' },
      { id: 'sp_tub', label: 'Jacuzzi has no separate lock or cover' },
      { id: 'sp_alarm', label: 'Smoke alarm installed' },
      { id: 'sp_co', label: 'Carbon monoxide alarm not reported' },
    ],
    cancellationPolicy: [
      { id: 'cp_free', label: 'Free cancellation for 48 hours after booking' },
      { id: 'cp_partial', label: 'Cancel before 2:00 PM on 5 Sep for a partial refund' },
      { id: 'cp_review', label: 'Review the full policy before booking' },
    ],
  },
};

export const reviews: Review[] = [
  {
    id: 'rev_01',
    author: {
      name: 'Marcus',
      avatarUrl: portrait('photo-1500648767791-00dcc994a43e'),
      location: 'Melbourne, Australia',
    },
    rating: 5,
    createdAt: '2026-07-18',
    body: 'The jacuzzi is exactly as pictured and the water was hot within twenty minutes. Pooja answered every message within minutes and arranged an airport taxi without being asked.',
  },
  {
    id: 'rev_02',
    author: {
      name: 'Priya',
      avatarUrl: portrait('photo-1438761681033-6461ffad8d80'),
      location: 'Bengaluru, India',
    },
    rating: 5,
    createdAt: '2026-07-02',
    body: 'Spotless, well kept and genuinely a ten-minute walk to the beach. The kitchen has everything you need if you want to cook a couple of nights.',
  },
  {
    id: 'rev_03',
    author: {
      name: 'Tomás',
      avatarUrl: portrait('photo-1507003211169-0a1dd7228f2d'),
      location: 'Lisbon, Portugal',
    },
    rating: 5,
    createdAt: '2026-06-21',
    body: 'Great value for what you get. The second living room with the tub is a lovely surprise — we used it every evening.',
  },
  {
    id: 'rev_04',
    author: {
      name: 'Hannah',
      avatarUrl: portrait('photo-1472099645785-5658abf4ff4e'),
      location: 'Berlin, Germany',
    },
    rating: 4,
    createdAt: '2026-06-09',
    body: 'Lovely apartment and a very responsive host. Marked down slightly because the shared pool was busy in the afternoons, though it emptied out by six.',
  },
  {
    id: 'rev_05',
    author: {
      name: 'Daniel',
      avatarUrl: portrait('photo-1544005313-94ddf0286df2'),
      location: 'Toronto, Canada',
    },
    rating: 5,
    createdAt: '2026-05-30',
    body: 'Aircon in the bedroom is silent and the bed is genuinely comfortable. Self check-in meant we could arrive late without troubling anyone.',
  },
  {
    id: 'rev_06',
    author: {
      name: 'Sofia',
      avatarUrl: portrait('photo-1534528741775-53994a69daeb'),
      location: 'Barcelona, Spain',
    },
    rating: 5,
    createdAt: '2026-05-14',
    body: 'Clean, quiet and close to everything. Bring mosquito repellent for the balcony in the evenings — that is the only thing I would add.',
  },
  {
    id: 'rev_07',
    author: {
      name: 'Ken',
      avatarUrl: portrait('photo-1552374196-c4e7ffc6e126'),
      location: 'Osaka, Japan',
    },
    rating: 5,
    createdAt: '2026-04-28',
    body: 'Exactly as described. The gym downstairs is small but has everything I needed for a morning session.',
  },
  {
    id: 'rev_08',
    author: {
      name: 'Amara',
      avatarUrl: portrait('photo-1494790108377-be9c29b29330'),
      location: 'London, United Kingdom',
    },
    rating: 5,
    createdAt: '2026-04-11',
    body: 'We booked for an anniversary and Pooja left flowers and a note on the dining table. Small thing, but it set the tone for the whole trip.',
  },
  {
    id: 'rev_09',
    author: {
      name: 'Luca',
      avatarUrl: portrait('photo-1500648767791-00dcc994a43e'),
      location: 'Milan, Italy',
    },
    rating: 4,
    createdAt: '2026-03-27',
    body: 'Good stay overall. The lane outside is unlit at night, so bring a torch or use your phone walking back from dinner.',
  },
  {
    id: 'rev_10',
    author: {
      name: 'Grace',
      avatarUrl: portrait('photo-1438761681033-6461ffad8d80'),
      location: 'Auckland, New Zealand',
    },
    rating: 5,
    createdAt: '2026-03-08',
    body: 'One of the best-kept apartments we have stayed in anywhere in Goa. Housekeeping came daily and was never intrusive.',
  },
  {
    id: 'rev_11',
    author: {
      name: 'Yusuf',
      avatarUrl: portrait('photo-1507003211169-0a1dd7228f2d'),
      location: 'Istanbul, Türkiye',
    },
    rating: 5,
    createdAt: '2026-02-19',
    body: 'Candolim beach is a short walk and never got crowded before nine. Pooja marked up a map for us with the good places to eat.',
  },
  {
    id: 'rev_12',
    author: {
      name: 'Isabelle',
      avatarUrl: portrait('photo-1472099645785-5658abf4ff4e'),
      location: 'Paris, France',
    },
    rating: 5,
    createdAt: '2026-01-30',
    body: 'Rained for two of our five days and it did not matter — the apartment is bright and the second living room is a lovely place to sit it out.',
  },
];
