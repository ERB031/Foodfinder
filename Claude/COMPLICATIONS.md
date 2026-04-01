# Foodfinder: Known Complications & Risks

This document captures the major complications of building a chef-driven restaurant review platform. Each section describes the problem, why it matters, the options, and what decisions need to be made. Consult this before starting any feature work.

---

## 1. Chef Verification & Credibility

**The problem:** The platform's value depends on reviewers having genuine culinary expertise. But "chef" is a broad term, and we've chosen to include culinary students, trained food bloggers, and expert home cooks — not just restaurant professionals.

**Why it matters:** If anyone can claim expertise, the platform becomes Yelp with extra steps. If verification is too strict, growth stalls.

**Options:**
- **Self-declaration with tiers:** Users declare their credential type on signup. Community endorsements and admin verification upgrade their tier over time. Unverified users can still post, but their reviews are ranked lower.
- **Credential upload:** Require proof (culinary school enrollment, restaurant employment, published food writing). Expensive to verify manually.
- **Community validation:** Other verified chefs can endorse newcomers (LinkedIn-style). Risk of cliques and gatekeeping.

**Decision needed:** What's the minimum bar to post a review? Can unverified users post, or only browse? Current leaning: anyone can sign up and post, but verification tier affects review visibility and weighting in the feed.

**Ongoing challenge:** Credentials change. A chef leaves the industry, a student graduates, a blogger stops writing. Need periodic re-verification or at least credential expiration.

---

## 2. Content Moderation

**The problem:** Reviews can contain defamatory statements, personal attacks on restaurant staff, fabricated experiences, spam, or promotional content.

**Why it matters:** One viral defamatory review can create legal liability and destroy trust. Too-aggressive moderation stifles honest criticism.

**Approach (tiered):**
1. **Automated screening:** Flag reviews containing personal names (not restaurant names), profanity, threats, or suspicious patterns (review posted within seconds of account creation).
2. **Community reporting:** Allow users to flag reviews. N flags → automatic hide + human review.
3. **Human moderation:** Queue of flagged reviews for manual decision. Need clear guidelines.

**Decision needed:** Pre-publish or post-publish moderation? Pre-publish slows down the experience but prevents damage. Post-publish is faster but reactive. Current leaning: post-publish for verified chefs, pre-publish for unverified users.

**Photo moderation:** Separate pipeline. Need to detect: non-food images, inappropriate content, copyrighted images. Cloud AI services (AWS Rekognition, Google Vision) can help but add cost and latency.

---

## 3. Restaurant Data Sourcing

**The problem:** The platform needs a comprehensive restaurant database. Building one from scratch is impractical. External APIs have cost and legal constraints.

**Data sources and tradeoffs:**

| Source | Pros | Cons |
|--------|------|------|
| Google Places API | Comprehensive, accurate | Expensive at scale, ToS restricts caching/storage |
| Yelp Fusion API | Good restaurant data | Similar ToS restrictions, rate limits |
| OpenStreetMap / Overpass | Free, open license | Incomplete, especially for smaller restaurants |
| User submissions | Free, fills gaps | Unreliable, needs verification |
| Manual curation | Highest quality | Doesn't scale |

**Menu data is the hardest part.** Menus change frequently, exist as PDFs or photos, and many restaurants have no digital menu. Options:
- Don't try to maintain menus — let chefs create dish entries when they review
- Partner with menu aggregators (if any exist with reasonable terms)
- OCR pipeline for menu photos (complex, error-prone)

**Decision needed:** Start with Google Places for restaurant discovery (accept the cost for MVP), supplement with user submissions, and let dishes be created organically through reviews.

---

## 4. Photo Storage & Media Pipeline

**The problem:** Food photos are central to the review experience. They need to be fast to upload, fast to load, and moderated for content.

**Pipeline:**
1. Client requests upload → API returns presigned S3 URL
2. Client uploads directly to S3 (avoids proxying through API server)
3. S3 event triggers Lambda/worker: resize (thumbnail + full), compress, strip EXIF (privacy), generate blurhash placeholder
4. Content moderation scan (async)
5. CDN serves images via CloudFront

**Cost considerations:**
- Storage: ~$0.023/GB/month on S3. At 3 photos/review, 500KB avg → manageable at small scale
- CDN: CloudFront free tier covers early growth
- Processing: Lambda or a background worker. Lambda is simpler but has cold start issues

**Decision needed:** Should the platform support video? Video changes storage costs by 10-100x. Current leaning: photos only for MVP. Video is a P3 feature.

**EXIF stripping is non-negotiable.** Photos taken at restaurants contain GPS coordinates. Publishing these is a privacy issue for both chefs and restaurant staff.

---

## 5. Rating System Design

**The problem:** A 1-5 star rating without context is noise. How do we make ratings meaningful when reviewers have different expertise levels?

**Options:**

| System | Pros | Cons |
|--------|------|------|
| 1-5 stars (flat) | Simple, familiar | No differentiation from Yelp |
| 1-5 stars (weighted by expertise) | Rewards specialization | Complex to explain to users |
| Binary "recommended" | Simple, decisive | Loses nuance |
| Multi-axis (food/service/value) | More data | Lower completion rates, more complexity |

**The original Chef's Feed used a curated "recommended" model** — chefs shared dishes they loved, not negative reviews. This is simpler and more positive but limits the review ecosystem.

**Expertise weighting logic:**
- Chef has specializations: ["pastry", "French"]
- Restaurant cuisine: "French"
- Match → weight multiplier of 1.5x on aggregate score
- No match → 1.0x (still counted, just not boosted)
- This is computed at query time, not stored

**Decision needed:** Start with 1-5 stars + optional "Chef's Pick" badge (binary recommendation overlay). This gives both quantitative and qualitative signals. Revisit if numeric ratings prove noisy.

---

## 6. Legal Considerations

**The problem:** Negative restaurant reviews can lead to legal threats. The platform hosts user-generated content with real business impact.

**Key areas:**

**Defamation:** A review saying "the kitchen was dirty" is an opinion and generally protected. A review saying "the chef committed health code violations" is a factual claim that could be actionable if false. Review guidelines should encourage opinion-framing.

**Section 230 (US):** Protects platforms from liability for user-generated content. But: doesn't protect against willful blindness to illegal content. Must have a moderation process and respond to valid takedown requests.

**GDPR/Privacy (if expanding internationally):**
- Chef profiles contain personal data — need consent flows
- Location data from photos must be stripped
- Right to deletion must be supported (delete account = delete all reviews)
- Data portability requirements

**Terms of Service must include:**
- Content ownership: chefs retain ownership but grant platform license to display
- Prohibited content definitions
- Dispute resolution process
- Platform right to remove content
- Indemnification clause

**Decision needed:** Get legal review before launch. At minimum, need ToS, privacy policy, and content guidelines. Budget for legal counsel.

---

## 7. Feed Algorithm & Scalability

**The problem:** The feed is the product. A simple reverse-chronological feed doesn't scale — active users who follow many chefs get overwhelmed, and new chefs get no visibility.

**Feed scoring factors:**
- Recency (exponential decay)
- Chef authority (verification tier + review count + follower count)
- Engagement (likes, saves, comments on the review)
- Geographic proximity (reviewer location ↔ user location)
- Cuisine preference (inferred from user's past interactions)
- Social signal (followed chef > non-followed chef)

**Fan-out strategies:**

| Strategy | How it works | Tradeoff |
|----------|-------------|----------|
| Fan-out-on-write | When chef posts review, write a FeedItem for each follower | Fast reads, expensive writes for popular chefs |
| Fan-out-on-read | When user opens feed, query and merge from followed chefs | Fast writes, expensive reads |
| Hybrid | Fan-out-on-write for most chefs, fan-out-on-read for "celebrity" chefs | Complex but scalable |

**Current plan:** Fan-out-on-write (simple, good enough for early scale). When a chef has >10K followers, revisit.

**Filter bubble risk:** Algorithmic feeds create echo chambers. Mitigate with "discovery" slots — e.g., every 5th feed item is from a non-followed chef in the user's area.

---

## 8. Data Freshness

**The problem:** Restaurants close at ~60% rate in year 1. Menus change seasonally. Prices change. A review platform with stale data is actively harmful.

**Staleness vectors:**
- Restaurant closes or relocates
- Menu items removed or changed
- Prices change
- Hours change
- Ownership changes (is it even the same restaurant?)

**Mitigation strategies:**
- **Automated checks:** Periodic Google Places API status checks (cost-limited)
- **User reports:** "Is this restaurant still open?" prompt. Easy crowd-sourcing.
- **Review recency signals:** Show "Last reviewed 2 years ago" prominently
- **Staleness score:** Restaurants not reviewed in 6+ months get flagged for verification
- **Soft close:** Mark as "possibly closed" rather than deleting — preserves review history

**Decision needed:** How aggressive should staleness warnings be? Current leaning: show "Unverified — last confirmed [date]" on any restaurant not reviewed or verified in 6 months.

---

## 9. Mobile-Specific Challenges

**The problem:** The app is mobile-native (React Native). This introduces platform-specific complications beyond web development.

**Key challenges:**

**App store approval:** Both Apple and Google have review guidelines. User-generated content apps need reporting mechanisms, content moderation, and age-appropriate content handling. Rejection can delay launch by weeks.

**Camera integration:** Photo reviews depend on good camera access. Expo's ImagePicker handles this but: need to handle permissions gracefully, support both camera and gallery, handle orientation/rotation issues.

**Offline behavior:** Users may want to draft reviews in areas with poor connectivity (inside restaurants). Need offline draft storage with sync-on-reconnect.

**Push notifications:** Critical for engagement (new review from followed chef, reply to your review). Platform-specific setup (APNs for iOS, FCM for Android). Expo Push handles abstraction but adds a dependency.

**Deep linking:** Sharing a review should open the app (or web fallback). Universal Links (iOS) and App Links (Android) need web domain verification.

**Performance:** React Native performance on lower-end Android devices. Image-heavy feeds need virtualized lists, lazy loading, and placeholder images (blurhash).

**Updates:** Expo EAS Update for OTA updates (skip app store for non-native changes). But native dependency changes still require full app store releases.

---

## 10. Monetization Without Compromising Integrity

**The problem:** The platform needs revenue, but the moment restaurants can pay for better placement or reviews, credibility collapses. This killed trust in many review platforms.

**Revenue options that preserve integrity:**

| Model | Description | Risk to integrity |
|-------|-------------|-------------------|
| Premium chef profiles | Portfolio features, analytics, verified badge | Low — chefs pay, not restaurants |
| Restaurant analytics | Aggregated sentiment dashboard (read-only, no influence on reviews) | Low if clearly read-only |
| Sponsored discovery | "Sponsored" tag on promoted restaurants in search (NOT in feed) | Medium — must be clearly labeled and never in the main feed |
| Affiliate reservations | Link to OpenTable/Resy, earn commission | Low — doesn't affect review content |
| Subscription tier | Ad-free, early access to trending reviews | Low |

**Hard rules (architectural, not just policy):**
1. No restaurant can pay to influence their review ranking
2. No restaurant can pay to suppress negative reviews
3. Sponsored content must be in a separate rendering path from organic content
4. Revenue team has no access to moderation tools or feed algorithm weights

**Decision needed:** Defer monetization until post-MVP. But architect the system so that review ranking and monetization are in separate services/modules from day one. Mixing them later is much harder than separating them from the start.
