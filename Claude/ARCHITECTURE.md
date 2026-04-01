# Foodfinder Architecture

## System Overview

Foodfinder is a mobile-first platform where culinary professionals review restaurants and dishes. The system follows a standard client-server architecture with a React Native mobile app communicating with a Node.js API backed by PostgreSQL.

```
┌─────────────────────┐
│   React Native App   │
│   (Expo / TypeScript)│
└──────────┬──────────┘
           │ HTTPS (REST)
           ▼
┌─────────────────────┐      ┌──────────────┐
│   Node.js API        │─────▶│  PostgreSQL   │
│   (TypeScript)       │      │  (Primary DB) │
└──────────┬──────────┘      └──────────────┘
           │
           ▼
┌─────────────────────┐
│   Object Storage     │
│   (S3 / CloudFront)  │
│   Photos & Media     │
└─────────────────────┘
```

## Core Subsystems

### 1. Authentication & Identity
- JWT-based auth with refresh tokens
- Chef profile creation and verification workflow
- Tiered verification: unverified → self-declared → community-endorsed → admin-verified
- OAuth social login (Google, Apple) for convenience; credentials for identity

### 2. Chef Profiles
- Bio, credentials, specializations, profile photo
- Verification status and history
- Recommendation portfolio and statistics
- Follow/follower relationships

### 3. Restaurant Data Layer
- Restaurant records with location (PostGIS for geospatial queries)
- Dish records tied to restaurants (created organically through recommendations)
- Data sourcing pipeline (API imports + user submissions + manual curation)
- Staleness detection and refresh jobs

### 4. Recommendation Pipeline
- Positive-only: chefs recommend what they love (no negative reviews, no numeric ratings)
- Create/edit/delete recommendations (notes + photos)
- Recommendations link to a restaurant and optionally a specific dish
- Dish recommendation is the primary content unit — chefs recommend specific dishes
- Notes provide context: why they love it, what to order, tips for visiting
- Moderation queue: automated screening → human review for flagged content

### 5. Media Pipeline
- Photo upload via presigned S3 URLs (client uploads directly to S3)
- Server-side processing: resize, compress, strip EXIF, generate thumbnails
- Content moderation on uploaded images
- CDN delivery via CloudFront

### 6. Feed Engine
- Primary discovery surface for the app
- Combines: followed chefs' recommendations, trending recommendations, geographically relevant recommendations
- Scoring: recency × chef authority × engagement × geographic proximity
- Materialized feed items for read performance (fan-out-on-write at small scale)
- Pagination: cursor-based, not offset-based

### 7. Search
- PostgreSQL full-text search initially (sufficient for MVP)
- Search targets: restaurants (by name, cuisine, location), chefs (by name, specialization), dishes
- Migrate to dedicated search engine (Meilisearch/Elasticsearch) if performance demands it

## Request Flow (Example: Create Recommendation)

1. Mobile app sends `POST /api/recommendations` with JWT in Authorization header
2. Auth middleware validates JWT, attaches chef profile to request
3. Validator middleware checks request body schema (notes required, positive content)
4. Controller calls RecommendationService
5. RecommendationService validates restaurant exists, creates/finds dish if specified, creates recommendation record
6. If photos attached: returns presigned S3 URLs for upload
7. Triggers async jobs: update feed items, run content moderation, update restaurant stats
8. Returns created recommendation to client

## Key Architectural Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mobile framework | React Native (Expo) | Single codebase, TypeScript, fast iteration with Expo |
| API style | REST | Simpler than GraphQL for this domain; well-understood |
| Database | PostgreSQL + PostGIS | Relational data fits domain; PostGIS for location queries |
| Media storage | S3 + CloudFront | Industry standard, cost-effective, presigned URLs avoid proxying through API |
| Feed strategy | Fan-out-on-write | Simpler at small scale; revisit if chef follower counts grow large |
| Search | PostgreSQL full-text | No additional infrastructure for MVP; migrate later if needed |
