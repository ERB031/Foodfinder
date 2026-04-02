import type { NavigatorScreenParams } from '@react-navigation/native';

// Auth stack (unauthenticated users)
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Main tab navigator
export type MainTabParamList = {
  FeedTab: undefined;
  SearchTab: undefined;
  RecommendTab: undefined;
  ProfileTab: undefined;
};

// Feed stack (inside Feed tab)
export type FeedStackParamList = {
  Feed: undefined;
  RecommendationDetail: { recommendationId: string };
  RestaurantDetail: { restaurantId: string };
  DishDetail: { dishId: string };
  ChefProfile: { chefId: string };
};

// Search stack
export type SearchStackParamList = {
  Search: undefined;
  RestaurantDetail: { restaurantId: string };
  DishDetail: { dishId: string };
  ChefProfile: { chefId: string };
};

// Recommend stack (create recommendation flow)
export type RecommendStackParamList = {
  SelectRestaurant: undefined;
  SelectDish: { restaurantId: string; restaurantName: string };
  WriteRecommendation: {
    restaurantId: string;
    restaurantName: string;
    dishId?: string;
    dishName?: string;
  };
};

// Profile stack
export type ProfileStackParamList = {
  MyProfile: undefined;
  EditProfile: undefined;
  ChefProfile: { chefId: string };
  RecommendationDetail: { recommendationId: string };
};

// Root navigator
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};
