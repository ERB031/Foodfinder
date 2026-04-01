# Foodfinder: Feature Specifications

Features are organized by priority tier. Each tier builds on the previous one.

---

## P0 — MVP (Must Have for Launch)

### Chef Signup & Profile
- Email/password registration
- Profile creation: display name, bio, specializations, credential type
- Self-declared verification (no admin review yet)
- Profile photo upload
- View own profile and review history

### Restaurant Browsing
- Browse restaurants by location (nearby) and cuisine type
- Restaurant detail page: name, address, cuisine, price range, hours
- View all reviews for a restaurant
- Basic restaurant search by name

### Create & View Recommendations
- Recommend a restaurant or specific dish (positive only — no negative reviews)
- Add notes: free-text commentary explaining why you love it, tips, what to order
- Recommend specific dishes by name (creates dish entries organically)
- Attach up to 5 photos per recommendation
- View recommendation detail page
- Edit and delete own recommendations
- Visit date (optional)

### Basic Feed
- Reverse-chronological feed of all recommendations (global, no personalization)
- Pull-to-refresh
- Infinite scroll with cursor-based pagination

### Basic Moderation
- Community flag button on recommendations
- Admin dashboard to view flagged content and approve/reject

---

## P1 — Core Experience

### Dish-Level Recommendations
- Recommend specific dishes at restaurants (dishes created organically)
- View all recommendations for a specific dish
- "Most Recommended Dishes" section on restaurant page
- Dish cards show: name, photo, number of chef recommendations, top notes

### Follow Chefs
- Follow/unfollow other chefs
- Follower/following counts on profiles
- Feed becomes personalized: followed chefs' recommendations appear first

### Photo Experience
- Photo gallery in reviews (swipeable)
- Thumbnail grid on restaurant pages
- Image compression and EXIF stripping
- Blurhash placeholders while loading

### Search
- Full-text search across restaurants, dishes, and chefs
- Filter by cuisine, price range, location radius
- Recent searches

### Chef Verification (Admin)
- Admin panel to review verification requests
- Credential upload for chefs seeking higher verification tier
- Verification badge on profile and reviews

---

## P2 — Growth & Engagement

### Smart Feed Algorithm
- Relevance-scored feed (recency × authority × proximity × engagement)
- Discovery slots for non-followed chefs
- "Trending in [city]" section
- Feed type selector: Following / Discover / Nearby

### Notifications
- Push notifications: new review from followed chef, someone followed you, review flagged/approved
- In-app notification center
- Notification preferences

### Trending & Stats
- Trending restaurants (most recommended in past 7 days)
- Trending dishes (most recommended in past 7 days)
- Chef leaderboard (most recommendations, most followed, by city)
- Restaurant stats: total recommendations, unique chefs, most recommended dishes

### Social Features
- Like/save recommendations
- Share recommendation via deep link
- Comments on recommendations (limited — this isn't social media)

---

## P3 — Scale & Monetization

### Restaurant Owner Portal
- Claim restaurant ownership (verification required)
- View analytics: recommendation trends, top dishes, visiting chefs
- Thank chefs for recommendations (public, labeled as restaurant response)
- Update restaurant info (hours, menu, photos)

### Monetization
- Premium chef profiles (portfolio features, analytics, priority placement in discovery)
- Restaurant analytics dashboard (paid tier — read-only, no influence on recommendations)
- Affiliate reservation links (OpenTable/Resy integration)
- Featured chef partnerships (sponsored content, clearly labeled)

### Chef Adoption & Incentives
- Chef onboarding rewards (profile completeness milestones)
- "Chef of the Month" spotlights by city
- Professional portfolio export (PDF/link for job applications)
- API access for chefs to embed recommendations on personal sites
- Early access to new features for most active contributors

### Advanced Features
- Video reviews (short-form, 30-60 seconds)
- Menu scanning (OCR from menu photos)
- Offline draft mode with sync
- Multi-language support
- Accessibility audit and improvements

### Platform Expansion
- Web app (read-only initially, then full-featured)
- API for third-party integrations
- Widget for restaurants to embed reviews on their site
