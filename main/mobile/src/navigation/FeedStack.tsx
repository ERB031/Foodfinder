import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FeedScreen } from '../screens/feed/FeedScreen';
import { RecommendationDetailScreen } from '../screens/feed/RecommendationDetailScreen';
import { RestaurantDetailScreen } from '../screens/restaurants/RestaurantDetailScreen';
import { ChefProfileScreen } from '../screens/profile/ChefProfileScreen';
import type { FeedStackParamList } from './types';

const Stack = createNativeStackNavigator<FeedStackParamList>();

export function FeedStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Feed"
        component={FeedScreen}
        options={{ title: 'Foodfinder' }}
      />
      <Stack.Screen
        name="RecommendationDetail"
        component={RecommendationDetailScreen}
        options={{ title: 'Recommendation' }}
      />
      <Stack.Screen
        name="RestaurantDetail"
        component={RestaurantDetailScreen}
        options={{ title: 'Restaurant' }}
      />
      <Stack.Screen
        name="ChefProfile"
        component={ChefProfileScreen}
        options={{ title: 'Chef' }}
      />
    </Stack.Navigator>
  );
}
