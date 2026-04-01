# Foodfinder Data Model

## Entity Relationship Overview

```
Chef ─────< Review >───── Restaurant
  │            │               │
  │            │               │
  │            ▼               │
  │       ReviewPhoto          │
  │                            │
  │                            ▼
  └────< Follow >────── Chef  Dish
```

## Core Entities

### Chef
The central user of the platform. Broadly defined: working chefs, culinary students, food bloggers with professional training, expert home cooks.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| email | VARCHAR(255) | Unique, used for auth |
| password_hash | VARCHAR(255) | bcrypt hashed |
| display_name | VARCHAR(100) | Public-facing name |
| bio | TEXT | Free-form biography |
| specializations | TEXT[] | Array of cuisine/skill tags (e.g., "pastry", "Japanese", "BBQ") |
| credential_type | ENUM | 'professional', 'culinary_student', 'trained_blogger', 'home_expert' |
| credential_details | TEXT | Description of qualifications |
| verification_status | ENUM | 'unverified', 'self_declared', 'community_endorsed', 'admin_verified' |
| profile_photo_url | VARCHAR(500) | S3/CDN URL |
| location_city | VARCHAR(100) | Primary city for geographic relevance |
| location_lat | DECIMAL(10,7) | Optional precise location |
| location_lng | DECIMAL(10,7) | Optional precise location |
| created_at | TIMESTAMP | Account creation |
| updated_at | TIMESTAMP | Last profile update |

### Restaurant
A dining establishment. Can be sourced from external APIs, user submissions, or manual curation.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| name | VARCHAR(255) | Restaurant name |
| address | TEXT | Full street address |
| city | VARCHAR(100) | City for search/filter |
| state | VARCHAR(50) | State/province |
| country | VARCHAR(50) | Country code |
| location | GEOGRAPHY(POINT) | PostGIS point for geo queries |
| cuisine_types | TEXT[] | Array of cuisine tags |
| price_range | INTEGER | 1-4 scale ($ to $$$$) |
| phone | VARCHAR(20) | Contact phone |
| website | VARCHAR(500) | Restaurant website |
| hours | JSONB | Operating hours by day |
| status | ENUM | 'active', 'closed', 'unverified' |
| source | ENUM | 'api_import', 'user_submitted', 'manual_curated' |
| source_id | VARCHAR(255) | External API ID for dedup |
| last_verified_at | TIMESTAMP | When data was last confirmed accurate |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Dish
A specific menu item at a restaurant. Optional — reviews can target just the restaurant.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| restaurant_id | UUID | FK → Restaurant |
| name | VARCHAR(255) | Dish name |
| description | TEXT | Optional description |
| price | DECIMAL(8,2) | Current price (nullable, changes frequently) |
| category | VARCHAR(100) | e.g., "appetizer", "entree", "dessert" |
| available | BOOLEAN | Currently on menu (best-effort) |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### Review
The core content unit. A chef's assessment of a restaurant or specific dish.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| chef_id | UUID | FK → Chef |
| restaurant_id | UUID | FK → Restaurant |
| dish_id | UUID | FK → Dish (nullable — restaurant-level review if null) |
| rating | INTEGER | 1-5 scale |
| title | VARCHAR(200) | Optional headline |
| body | TEXT | Full review text |
| visit_date | DATE | When the chef visited (nullable) |
| moderation_status | ENUM | 'pending', 'approved', 'flagged', 'rejected' |
| moderation_notes | TEXT | Internal notes from moderation |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Index notes:**
- Composite index on (restaurant_id, created_at DESC) for restaurant review pages
- Composite index on (chef_id, created_at DESC) for chef profile pages
- Index on moderation_status for moderation queue

### ReviewPhoto
Photos attached to a review.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| review_id | UUID | FK → Review |
| storage_key | VARCHAR(500) | S3 object key |
| url | VARCHAR(500) | CDN URL |
| thumbnail_url | VARCHAR(500) | Resized thumbnail CDN URL |
| alt_text | VARCHAR(255) | Accessibility description |
| display_order | INTEGER | Ordering within the review |
| created_at | TIMESTAMP | |

### Follow
Chef-to-chef follow relationship.

| Field | Type | Notes |
|-------|------|-------|
| follower_id | UUID | FK → Chef |
| followed_id | UUID | FK → Chef |
| created_at | TIMESTAMP | |

**Constraints:** Composite primary key (follower_id, followed_id). No self-follows.

### FeedItem
Materialized feed entries for read performance. Generated when reviews are created.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| recipient_chef_id | UUID | FK → Chef (who sees this in their feed) |
| review_id | UUID | FK → Review |
| author_chef_id | UUID | FK → Chef (who wrote the review) |
| relevance_score | DECIMAL(5,2) | Computed score for ordering |
| feed_type | ENUM | 'following', 'trending', 'nearby', 'recommended' |
| created_at | TIMESTAMP | |

**Index notes:**
- Composite index on (recipient_chef_id, relevance_score DESC, created_at DESC) for feed queries

## Rating System Notes

The rating is a simple 1-5 integer, but display and aggregation should account for chef expertise:
- A pastry chef's dessert review carries more weight than their steak review
- This weighting is computed at query time using chef.specializations vs restaurant/dish cuisine
- The weight multiplier is NOT stored on the review — it's derived
- Aggregate restaurant ratings should show both raw average and expertise-weighted average
- Consider: the original Chef's Feed used binary "recommended" instead of numeric. If numeric ratings prove noisy, pivot to a simpler system.
