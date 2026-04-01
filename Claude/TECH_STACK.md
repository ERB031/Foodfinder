# Foodfinder: Tech Stack

## Locked Decisions

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| **Mobile** | React Native (Expo) | Single codebase for iOS + Android. TypeScript support. Expo managed workflow for fast iteration, EAS Build for production. Large ecosystem and hiring pool. |
| **Backend** | Node.js + TypeScript | Same language as frontend (shared types). Strong async I/O for API workloads. Large package ecosystem. |
| **Database** | PostgreSQL | Relational model fits the domain (chefs, restaurants, reviews, follows). PostGIS extension for geospatial queries. JSONB for semi-structured data (hours, metadata). Proven at scale. |
| **Language** | TypeScript (strict mode) | End-to-end type safety. Shared type definitions between mobile and backend via `main/shared/`. |

## Backend Framework (To Decide)

| Option | Pros | Cons | Leaning |
|--------|------|------|---------|
| **Express** | Most popular, largest ecosystem, easy to hire for | Minimal built-in features, needs many middleware packages | - |
| **Fastify** | Fast, built-in validation (Ajv), good TypeScript support, plugin system | Smaller ecosystem than Express, some packages Express-only | ✅ |
| **NestJS** | Full framework (DI, modules, guards), great for large teams | Heavy abstraction, steeper learning curve, opinionated | - |

**Current leaning: Fastify.** Good balance of performance, built-in validation, and simplicity. Less boilerplate than NestJS, more batteries-included than Express.

## ORM / Database Layer (To Decide)

| Option | Pros | Cons | Leaning |
|--------|------|------|---------|
| **Prisma** | Great DX, auto-generated types, migrations, visual studio | Query limitations for complex SQL, larger bundle | - |
| **Drizzle** | Lightweight, SQL-like syntax, excellent TypeScript types, fast | Newer, smaller community | ✅ |
| **Knex + raw SQL** | Full SQL control, lightweight | No type generation, more manual work | - |

**Current leaning: Drizzle.** SQL-like API means less abstraction leakage. Excellent TypeScript integration. Lightweight.

## Media Storage

| Component | Choice | Notes |
|-----------|--------|-------|
| Object storage | AWS S3 | Industry standard. Presigned URLs for direct client upload. |
| CDN | CloudFront | Integrated with S3. Free tier covers early growth. |
| Image processing | Sharp (Node.js) | Fast image resize/compress. Run in background worker or Lambda. |
| EXIF stripping | Sharp | Built-in EXIF removal during resize. |

## Auth

| Option | Pros | Cons | Leaning |
|--------|------|------|---------|
| **Self-managed JWT** | Full control, no external dependency, no per-user cost | Must handle token security, rotation, blacklisting | ✅ |
| **Clerk** | Managed auth, React Native SDK, social login built-in | Per-MAU cost, external dependency | - |
| **Supabase Auth** | Free tier, integrates with PostgreSQL | Ties you to Supabase ecosystem | - |

**Current leaning: Self-managed JWT.** For a platform where chef identity and verification are core features, we need full control over the auth and identity layer.

## Search

| Phase | Approach |
|-------|----------|
| MVP | PostgreSQL full-text search (`tsvector`, `tsquery`). Good enough for restaurant/chef name search. |
| Scale | Meilisearch (self-hosted, lightweight, typo-tolerant). Add when PostgreSQL FTS becomes a bottleneck. |

## Push Notifications

| Component | Choice | Notes |
|-----------|--------|-------|
| Service | Expo Push Notifications | Abstracts APNs + FCM. Free. Works with Expo managed workflow. |
| Fallback | Direct APNs/FCM | Only if Expo Push limitations are hit. |

## Deployment (To Decide Later)

| Option | Pros | Cons |
|--------|------|------|
| **Railway** | Simple, good DX, PostgreSQL included, auto-deploy | Less control, smaller scale ceiling |
| **Render** | Similar to Railway, free tier | Cold starts on free tier |
| **AWS (ECS/RDS)** | Full control, scalable, mature | Complex setup, higher ops burden |
| **Fly.io** | Edge deployment, good for geo-distributed users | Newer, some rough edges |

**Defer this decision.** Focus on building the app first. Any of these work for MVP. Choose based on scale needs when approaching launch.

## Mobile Build & Deploy

| Component | Choice | Notes |
|-----------|--------|-------|
| Build service | EAS Build | Expo's cloud build service. Handles iOS and Android builds without local Xcode/Android Studio. |
| OTA updates | EAS Update | Push JS bundle updates without app store review. |
| App store submission | EAS Submit | Streamlined submission to App Store and Google Play. |

## Development Tools

| Tool | Purpose |
|------|---------|
| ESLint | Linting (TypeScript + React Native rules) |
| Prettier | Code formatting |
| Vitest | Backend unit/integration tests |
| Jest + React Native Testing Library | Mobile component tests |
| Detox or Maestro | Mobile E2E tests (P2 — not needed for MVP) |
| Docker Compose | Local development (PostgreSQL, S3-compatible MinIO) |
| GitHub Actions | CI/CD (lint, test, build) |
