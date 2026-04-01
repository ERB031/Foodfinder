# Foodfinder Data Model

## Entity Relationship Overview

```
Chef ──────< Recommendation >───── Restaurant
  │               │                     │
  │               │                     │
  │               ▼                     │
  │        RecommendationPhoto          │
  │                                     ▼
  └─────< Follow >──────── Chef       Dish
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

### Recommendation
The core content unit. A positive endorsement — chefs share what they love. No negative reviews. Every recommendation is tied to a restaurant and optionally a specific dish.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| chef_id | UUID | FK → Chef |
| restaurant_id | UUID | FK → Restaurant |
| dish_id | UUID | FK → Dish (nullable — restaurant-level rec if null) |
| notes | TEXT | Free-text commentary: why they love it, tips, what to order |
| visit_date | DATE | When the chef visited (nullable) |
| moderation_status | ENUM | 'pending', 'approved', 'flagged', 'rejected' |
| moderation_notes | TEXT | Internal notes from moderation |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

**Key design choice:** No numeric rating. A recommendation IS the endorsement. If a chef doesn't recommend something, they simply don't post about it. This mirrors the original Chef's Feed model and eliminates rating noise.

**Index notes:**
- Composite index on (restaurant_id, created_at DESC) for restaurant recommendation pages
- Composite index on (chef_id, created_at DESC) for chef profile pages
- Composite index on (dish_id, created_at DESC) for dish recommendation pages
- Index on moderation_status for moderation queue

### RecommendationPhoto
Photos attached to a recommendation.

| Field | Type | Notes |
|-------|------|-------|
| id | UUID | Primary key |
| recommendation_id | UUID | FK → Recommendation |
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
| recommendation_id | UUID | FK → Recommendation |
| author_chef_id | UUID | FK → Chef (who wrote the recommendation) |
| relevance_score | DECIMAL(5,2) | Computed score for ordering |
| feed_type | ENUM | 'following', 'trending', 'nearby', 'recommended' |
| created_at | TIMESTAMP | |

**Index notes:**
- Composite index on (recipient_chef_id, relevance_score DESC, created_at DESC) for feed queries

## Recommendation Model Notes

There is no numeric rating. The act of recommending IS the endorsement. This mirrors the original Chef's Feed:

- If a chef loves a dish, they post a recommendation with notes and photos
- If they don't love it, they don't post — no negative reviews exist on the platform
- A restaurant/dish's "score" is simply how many chefs recommended it
- Chef expertise still matters for discovery: a pastry chef recommending a dessert is surfaced higher than a generalist recommending the same dessert
- This expertise weighting uses chef.specializations vs restaurant/dish cuisine at query time
- Notes are the primary content — they explain WHY the chef recommends this (e.g., "the tonkotsu broth is the best in the city, ask for extra chashu")
