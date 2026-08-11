# API reference

Base URL: `http://localhost:4000/api/v1`

All routes are versioned under `/api/v1`. Request and response shapes are defined
once in [`packages/types`](../packages/types/src) as zod schemas; the API
validates against them and the web app infers its types from the same source, so
a contract change fails the type-check on both sides.

## Response envelope

Success — HTTP 2xx:

```jsonc
{
  "data": {/* endpoint payload */},
  "meta": {/* optional, pagination etc. */},
}
```

Failure — HTTP 4xx/5xx:

```jsonc
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request failed validation.",
    "details": [{ "path": "body.guests", "message": "Too big: expected number to be <=16" }],
    "requestId": "0f0f4c1e-…",
  },
}
```

Clients branch on the presence of `error` rather than on the status code.
`details` is present only for validation failures. `requestId` echoes the
`X-Request-Id` request header when supplied, otherwise a generated UUID, and is
also returned as a response header.

### Error codes

| Code               | Status | Meaning                                            |
| ------------------ | ------ | -------------------------------------------------- |
| `BAD_REQUEST`      | 400    | Malformed JSON, or a semantically invalid range    |
| `VALIDATION_ERROR` | 422    | Input failed schema or business-rule validation    |
| `NOT_FOUND`        | 404    | Unknown listing slug, or unmatched route           |
| `INTERNAL_ERROR`   | 500    | Unexpected fault; details suppressed in production |

---

## `GET /health`

Liveness probe. Dependency-free so it stays green under load.

```bash
curl http://localhost:4000/api/v1/health
```

```json
{
  "data": {
    "status": "ok",
    "uptimeSeconds": 42,
    "timestamp": "2026-08-09T11:39:46.731Z",
    "version": "1.0.0"
  }
}
```

---

## `GET /listings/:slug`

The full listing: location, capacity, images, highlights, description,
amenities, host, pricing, availability, rating breakdown and "things to know".

**Params**

| Name   | Type   | Rules                       |
| ------ | ------ | --------------------------- |
| `slug` | string | 1–120 chars, `^[a-z0-9-]+$` |

```bash
curl http://localhost:4000/api/v1/listings/romantic-jacuzzi-1bhk-candolim
```

```jsonc
{
  "data": {
    "id": "lst_8f2c1a",
    "slug": "romantic-jacuzzi-1bhk-candolim",
    "title": "Cliffside villa with infinity pool and ocean views",
    "propertyType": "Entire villa",
    "location": {
      "city": "Uluwatu",
      "region": "Bali",
      "country": "Indonesia",
      "latitude": -8.8295,
      "longitude": 115.0849,
      "neighbourhood": "…",
    },
    "rating": 4.94,
    "reviewsCount": 218,
    "isGuestFavorite": true,
    "images": [{ "id": "img_01", "url": "https://…", "alt": "…", "width": 1600, "height": 1067 }],
    "capacity": { "guests": 8, "bedrooms": 4, "beds": 5, "bathrooms": 3.5 },
    "highlights": [
      {
        "id": "hl_self_check_in",
        "title": "Self check-in",
        "description": "…",
        "icon": "self-check-in",
      },
    ],
    "description": "…",
    "amenities": [
      {
        "id": "am_wifi",
        "label": "Fast wifi – 240 Mbps",
        "icon": "wifi",
        "category": "popular",
        "available": true,
      },
    ],
    "host": { "id": "hst_2b91", "name": "Ayu", "isSuperhost": true, "responseRate": 100, "…": "…" },
    "pricing": {
      "currency": "USD",
      "nightlyRate": 412,
      "cleaningFee": 85,
      "serviceFeeRate": 0.142,
      "taxRate": 0.11,
      "weeklyDiscountRate": 0.12,
    },
    "availability": {
      "minimumNights": 3,
      "maximumNights": 28,
      "blockedDates": ["2026-08-14"],
      "checkInTime": "After 3:00 PM",
      "checkOutTime": "11:00 AM",
    },
    "ratingBreakdown": {
      "cleanliness": 4.9,
      "accuracy": 4.9,
      "checkIn": 5,
      "communication": 5,
      "location": 4.8,
      "value": 4.7,
    },
    "thingsToKnow": { "houseRules": [], "safetyAndProperty": [], "cancellationPolicy": [] },
  },
}
```

`404` if the slug is unknown.

---

## `GET /listings/:slug/reviews`

Paginated reviews plus the aggregate rating breakdown.

**Query**

| Name     | Type   | Default  | Rules                                     |
| -------- | ------ | -------- | ----------------------------------------- |
| `limit`  | number | `6`      | 1–50                                      |
| `offset` | number | `0`      | ≥ 0                                       |
| `sort`   | enum   | `recent` | `recent` \| `rating-desc` \| `rating-asc` |

```bash
curl "http://localhost:4000/api/v1/listings/romantic-jacuzzi-1bhk-candolim/reviews?limit=2&sort=rating-asc"
```

```jsonc
{
  "data": {
    "reviews": [
      {
        "id": "rev_04",
        "author": { "name": "Hannah", "avatarUrl": "https://…", "location": "Berlin, Germany" },
        "rating": 4,
        "createdAt": "2026-06-09",
        "body": "Beautiful villa and an unbeatable view. …",
      },
    ],
    "total": 12,
    "averageRating": 4.83,
    "breakdown": { "cleanliness": 4.9, "…": "…" },
  },
  "meta": { "limit": 2, "offset": 0, "hasMore": true },
}
```

---

## `GET /listings/:slug/availability`

Blocked dates within a window, plus stay-length bounds and check-in/out times.

**Query**

| Name   | Type          | Rules                         |
| ------ | ------------- | ----------------------------- |
| `from` | ISO-8601 date | required, inclusive           |
| `to`   | ISO-8601 date | required, exclusive, `> from` |

```bash
curl "http://localhost:4000/api/v1/listings/romantic-jacuzzi-1bhk-candolim/availability?from=2026-08-01&to=2026-09-01"
```

```json
{
  "data": {
    "from": "2026-08-01",
    "to": "2026-09-01",
    "minimumNights": 3,
    "maximumNights": 28,
    "checkInTime": "After 3:00 PM",
    "checkOutTime": "11:00 AM",
    "unavailableDates": ["2026-08-14", "2026-08-15", "2026-08-16", "2026-08-29", "2026-08-30"]
  }
}
```

`400` (`BAD_REQUEST`) if `to` is not after `from`.

---

## `POST /listings/:slug/quote`

Prices a stay. This is the only endpoint with real business rules, so it is
where most of the validation lives.

**Body**

| Field      | Type          | Rules                 |
| ---------- | ------------- | --------------------- |
| `checkIn`  | ISO-8601 date | required              |
| `checkOut` | ISO-8601 date | required, `> checkIn` |
| `guests`   | number        | integer, 1–16         |

Beyond schema validation the service enforces:

- `guests` ≤ the listing's capacity
- stay length within `minimumNights`…`maximumNights`
- no night in the range appears in `blockedDates`

**Fee ladder** — applied in order, each rounded to cents:

1. `nightlyRate × nights`
2. weekly discount (`weeklyDiscountRate`) on the accommodation subtotal, for stays ≥ 7 nights
3. flat `cleaningFee`
4. `serviceFeeRate` on the running total
5. `taxRate` on the running total

```bash
curl -X POST http://localhost:4000/api/v1/listings/romantic-jacuzzi-1bhk-candolim/quote \
  -H 'Content-Type: application/json' \
  -d '{"checkIn":"2026-09-10","checkOut":"2026-09-18","guests":4}'
```

`201 Created`:

```json
{
  "data": {
    "currency": "USD",
    "checkIn": "2026-09-10",
    "checkOut": "2026-09-18",
    "guests": 4,
    "nights": 8,
    "nightlyRate": 412,
    "lines": [
      { "id": "accommodation", "label": "$412 x 8 nights", "amount": 3296, "isDiscount": false },
      {
        "id": "weekly-discount",
        "label": "Weekly stay discount",
        "amount": -395.52,
        "isDiscount": true
      },
      { "id": "cleaning-fee", "label": "Cleaning fee", "amount": 85, "isDiscount": false },
      { "id": "service-fee", "label": "Airbnb service fee", "amount": 423.94, "isDiscount": false },
      { "id": "taxes", "label": "Taxes", "amount": 375.04, "isDiscount": false }
    ],
    "total": 3784.46
  }
}
```

`422` when a rule fails:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Those dates are not available.",
    "details": [
      { "path": "body.checkIn", "message": "Unavailable: 2026-12-24, 2026-12-25, 2026-12-26." }
    ],
    "requestId": "…"
  }
}
```

---

## Middleware chain

Order matters; it is set in [`apps/api/src/app.ts`](../apps/api/src/app.ts).

1. `requestId` — assigns/echoes `X-Request-Id` so every log line correlates
2. `helmet` — security headers
3. `cors` — restricted to `CORS_ORIGINS`
4. `compression`
5. `express.json({ limit: '100kb' })`
6. `requestLogger` — one structured JSON line per completed request
7. routes
8. `notFound` — unmatched routes become a structured 404
9. `errorHandler` — terminal; maps `HttpError`/`ZodError`/unknown onto the wire format

Express 5 forwards rejected promises from async handlers to the error middleware
automatically, so handlers carry no try/catch boilerplate.
