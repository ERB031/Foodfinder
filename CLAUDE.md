# Foodfinder

## Project
Foodfinder is a mobile-first platform where culinary professionals review restaurants and dishes. "Culinary professional" is broadly defined: working chefs, culinary students, trained food bloggers, and expert home cooks. Think of it as recreating the old Chef's Feed app — curated, credible food reviews from people who know food.

## Tech Stack
- **Mobile:** React Native (Expo), TypeScript
- **Backend:** Node.js, TypeScript (Fastify or Express — see `Claude/TECH_STACK.md`)
- **Database:** PostgreSQL with PostGIS
- **Media:** AWS S3 + CloudFront
- **Auth:** Self-managed JWT

## Repo Structure
- `main/` — All application source code
  - `main/mobile/` — React Native (Expo) app
  - `main/backend/` — Node.js API server
  - `main/shared/` — Shared TypeScript types and constants
  - `main/infrastructure/` — Docker, scripts, deployment config
- `Claude/` — Planning and architecture docs (read these before starting feature work)
  - `ARCHITECTURE.md` — System overview and subsystem descriptions
  - `DATA_MODEL.md` — Database entities and relationships
  - `COMPLICATIONS.md` — Known risks and decision points
  - `FEATURES.md` — Prioritized feature specs (P0-P3)
  - `API_DESIGN.md` — RESTful API surface area
  - `TECH_STACK.md` — Technology choices and rationale

## Domain Concepts
- **Chef** — A verified culinary professional (broad definition). Has a credential type and verification tier.
- **Recommendation** — A positive-only review. Chefs share what they love — no negative reviews. Includes notes (free-text commentary) and optional photos.
- **Dish Recommendation** — Chefs recommend specific dishes, not just restaurants. Dishes are the atomic unit of content.
- **Restaurant** — A dining establishment with location, cuisine type, and price range.
- **Dish** — A specific menu item at a restaurant. Created organically through recommendations.
- **Feed** — The primary discovery surface. Shows recommendations from followed chefs, trending dishes, and nearby finds.
- **Notes** — Free-text commentary attached to a recommendation. Why the chef loves this dish, what to order, tips for visiting.

## Conventions
- **Commits:** Use conventional commits (`feat:`, `fix:`, `docs:`, `chore:`, `refactor:`, `test:`)
- **TypeScript:** Strict mode enabled. No `any` types. Shared types go in `main/shared/types/`.
- **Testing:** Test files live alongside source files (`*.test.ts` or `*.spec.ts`). Integration tests in `__tests__/` directories.
- **API:** All endpoints need input validation. Use cursor-based pagination, not offset.
- **Database:** All schema changes require a migration file. Never modify the database directly.

## Before Starting Feature Work
1. Read `Claude/FEATURES.md` to understand the priority and scope
2. Read `Claude/COMPLICATIONS.md` to understand risks related to the feature
3. Check `Claude/DATA_MODEL.md` for relevant entity definitions
4. Check `Claude/API_DESIGN.md` for endpoint specifications

## Rules
- Never commit `.env` files, API keys, or credentials
- Never store user passwords in plaintext — use bcrypt
- Strip EXIF data from all uploaded photos (privacy)
- Validate all user input at the API boundary
- Reviews must go through moderation pipeline before public display (for unverified chefs)
- Keep monetization logic completely separate from review ranking logic
