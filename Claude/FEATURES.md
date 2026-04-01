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

### Create & View Reviews
- Write a review for a restaurant (rating 1-5, title, body)
- Attach up to 5 photos per review
- View review detail page
- Edit and delete own reviews
- Visit date (optional)

### Basic Feed
- Reverse-chronological feed of all reviews (global, no personalization)
- Pull-to-refresh
- Infinite scroll with cursor-based pagination

### Basic Moderation
- Community flag button on reviews
- Admin dashboard to view flagged reviews and approve/reject

---

## P1 — Core Experience

### Dish-Level Reviews
- Create dishes tied to restaurants (when writing a review)
- Review a specific dish (not just the restaurant)
- View all reviews for a specific dish
- "Popular dishes" section on restaurant page

### Follow Chefs
- Follow/unfollow other chefs
- Follower/following counts on profiles
- Feed becomes personalized: followed chefs' reviews appear first

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

### Chef's Pick
- Binary "Chef's Pick" badge on reviews (in addition to 1-5 rating)
- "Chef's Picks" collection on profile page
- "Chef's Picks" filter on restaurant page

### Trending & Stats
- Trending restaurants (most reviewed in past 7 days)
- Chef leaderboard (most reviews, most followed, by city)
- Restaurant aggregate stats: average rating, expertise-weighted rating, review count

### Social Features
- Like/save reviews
- Share review via deep link
- Comments on reviews (limited — this isn't social media)

---

## P3 — Scale & Monetization

### Restaurant Owner Portal
- Claim restaurant ownership (verification required)
- View analytics: review sentiment, visit trends, popular dishes
- Respond to reviews (clearly labeled as restaurant response)
- Update restaurant info (hours, menu, photos)

### Monetization
- Premium chef profiles (portfolio features, analytics)
- Restaurant analytics dashboard (paid tier)
- Affiliate reservation links

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
