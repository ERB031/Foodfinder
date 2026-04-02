// Core domain types for Foodfinder
// These mirror the backend data model (see Claude/DATA_MODEL.md)

export type CredentialType =
  | 'professional'
  | 'culinary_student'
  | 'trained_blogger'
  | 'home_expert';

export type VerificationStatus =
  | 'unverified'
  | 'self_declared'
  | 'community_endorsed'
  | 'admin_verified';

export type ModerationStatus =
  | 'pending'
  | 'approved'
  | 'flagged'
  | 'rejected';

export type RestaurantStatus = 'active' | 'closed' | 'unverified';

export type PriceRange = 1 | 2 | 3 | 4;

export interface Chef {
  id: string;
  email: string;
  displayName: string;
  bio: string;
  specializations: string[];
  credentialType: CredentialType;
  credentialDetails: string;
  verificationStatus: VerificationStatus;
  profilePhotoUrl: string | null;
  locationCity: string | null;
  followerCount: number;
  followingCount: number;
  recommendationCount: number;
  createdAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  cuisineTypes: string[];
  priceRange: PriceRange;
  phone: string | null;
  website: string | null;
  hours: Record<string, string> | null;
  status: RestaurantStatus;
  recommendationCount: number;
}

export interface Dish {
  id: string;
  restaurantId: string;
  name: string;
  description: string | null;
  price: number | null;
  category: string | null;
  recommendationCount: number;
}

export interface Recommendation {
  id: string;
  chefId: string;
  restaurantId: string;
  dishId: string | null;
  notes: string;
  visitDate: string | null;
  moderationStatus: ModerationStatus;
  photos: RecommendationPhoto[];
  createdAt: string;
  updatedAt: string;
  // Populated in feed/detail views
  chef?: Chef;
  restaurant?: Restaurant;
  dish?: Dish | null;
  likeCount?: number;
  isLiked?: boolean;
}

export interface RecommendationPhoto {
  id: string;
  url: string;
  thumbnailUrl: string;
  altText: string | null;
  displayOrder: number;
}

export interface FeedItem {
  id: string;
  recommendation: Recommendation;
  feedType: 'following' | 'trending' | 'nearby' | 'recommended';
  createdAt: string;
}

// API response types

export interface PaginatedResponse<T> {
  data: T[];
  cursor: string | null;
  hasMore: boolean;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
}
