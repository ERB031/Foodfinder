# Foodfinder: API Design

## Base URL
```
/api/v1
```

All endpoints are versioned. Breaking changes require a new version.

## Authentication
- **Method:** JWT (access token + refresh token)
- **Access token:** Short-lived (15 min), sent in `Authorization: Bearer <token>` header
- **Refresh token:** Long-lived (30 days), stored securely on device, used to obtain new access tokens
- **Endpoints marked 🔒 require authentication**

## Pagination
- **Cursor-based** (not offset-based) for all list endpoints
- Response includes `cursor` for next page
- Request param: `?cursor=<opaque_string>&limit=20`
- Default limit: 20, max: 50

## Rate Limiting
- Authenticated: 100 requests/minute
- Unauthenticated: 20 requests/minute
- Photo upload: 10 uploads/minute
- Headers: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

---

## Endpoints

### Auth

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/auth/register` | Create account (email, password, display_name) | - |
| POST | `/auth/login` | Login, returns access + refresh tokens | - |
| POST | `/auth/refresh` | Exchange refresh token for new access token | - |
| POST | `/auth/logout` | Invalidate refresh token | 🔒 |
| POST | `/auth/forgot-password` | Send password reset email | - |
| POST | `/auth/reset-password` | Reset password with token | - |

### Chef Profiles

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/chefs/me` | Get own profile | 🔒 |
| PUT | `/chefs/me` | Update own profile | 🔒 |
| GET | `/chefs/:id` | Get chef profile by ID | - |
| GET | `/chefs/:id/recommendations` | Get chef's recommendations (paginated) | - |
| GET | `/chefs/:id/followers` | Get chef's followers (paginated) | - |
| GET | `/chefs/:id/following` | Get who chef follows (paginated) | - |
| POST | `/chefs/:id/follow` | Follow a chef | 🔒 |
| DELETE | `/chefs/:id/follow` | Unfollow a chef | 🔒 |
| POST | `/chefs/me/verify` | Submit verification request | 🔒 |

### Restaurants

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/restaurants` | List restaurants (filter by location, cuisine, price) | - |
| GET | `/restaurants/:id` | Get restaurant details | - |
| POST | `/restaurants` | Submit new restaurant | 🔒 |
| GET | `/restaurants/:id/dishes` | Get dishes at restaurant | - |
| GET | `/restaurants/:id/recommendations` | Get recommendations for restaurant (paginated) | - |
| GET | `/restaurants/nearby` | Get restaurants near lat/lng | - |

**Query params for GET /restaurants:**
- `lat`, `lng`, `radius_km` — geographic filter
- `cuisine` — cuisine type filter
- `price_range` — 1-4 filter
- `q` — name search
- `cursor`, `limit` — pagination

### Dishes

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/dishes/:id` | Get dish details | - |
| POST | `/restaurants/:id/dishes` | Create dish at restaurant | 🔒 |
| GET | `/dishes/:id/recommendations` | Get recommendations for a specific dish (paginated) | - |

### Recommendations

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/recommendations` | Create a recommendation (positive only) | 🔒 |
| GET | `/recommendations/:id` | Get recommendation details | - |
| PUT | `/recommendations/:id` | Update own recommendation | 🔒 |
| DELETE | `/recommendations/:id` | Delete own recommendation | 🔒 |
| POST | `/recommendations/:id/flag` | Flag for moderation | 🔒 |
| POST | `/recommendations/:id/like` | Like a recommendation | 🔒 |
| DELETE | `/recommendations/:id/like` | Unlike a recommendation | 🔒 |

**POST /recommendations request body:**
```json
{
  "restaurant_id": "uuid",
  "dish_id": "uuid | null",
  "dish_name": "string | null (creates dish if dish_id is null)",
  "notes": "The tonkotsu broth is the best in the city. Ask for extra chashu and the spicy miso on the side.",
  "visit_date": "2026-03-28"
}
```

**Note:** No rating field. The recommendation itself is the endorsement. Notes provide context.

### Photos

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| POST | `/recommendations/:id/photos/presign` | Get presigned S3 upload URL(s) | 🔒 |
| POST | `/recommendations/:id/photos/confirm` | Confirm upload complete, attach to recommendation | 🔒 |
| DELETE | `/recommendations/:id/photos/:photoId` | Remove photo from recommendation | 🔒 |

**Upload flow:**
1. Client calls `POST /recommendations/:id/photos/presign` with `{ count: 3, content_types: ["image/jpeg", "image/jpeg", "image/png"] }`
2. API returns array of `{ upload_url, storage_key }` (presigned S3 PUT URLs)
3. Client uploads directly to S3 using presigned URLs
4. Client calls `POST /recommendations/:id/photos/confirm` with `{ storage_keys: [...], alt_texts: [...] }`
5. API triggers background processing (resize, compress, moderate)

### Feed

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/feed` | Get personalized feed | 🔒 |
| GET | `/feed/trending` | Get trending recommendations (no auth required) | - |
| GET | `/feed/nearby` | Get recommendations near location | - |

**Query params for GET /feed:**
- `cursor`, `limit` — pagination
- `type` — 'all', 'following', 'discover' (default: 'all')

### Search

| Method | Path | Description | Auth |
|--------|------|-------------|------|
| GET | `/search` | Unified search | - |

**Query params:**
- `q` — search query (required)
- `type` — 'restaurant', 'dish', 'chef', 'all' (default: 'all')
- `lat`, `lng` — boost nearby results
- `cursor`, `limit` — pagination

---

## Error Format

All errors return consistent JSON:
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Rating must be between 1 and 5",
    "details": [
      { "field": "rating", "message": "Must be an integer between 1 and 5" }
    ]
  }
}
```

## Standard Error Codes
| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request body/params invalid |
| 401 | UNAUTHORIZED | Missing or invalid auth token |
| 403 | FORBIDDEN | Authenticated but not authorized for this action |
| 404 | NOT_FOUND | Resource doesn't exist |
| 409 | CONFLICT | Duplicate resource (e.g., already following) |
| 429 | RATE_LIMITED | Too many requests |
| 500 | INTERNAL_ERROR | Server error |
