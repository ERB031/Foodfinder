import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SearchScreen } from '../screens/search/SearchScreen';
import { RestaurantDetailScreen } from '../screens/restaurants/RestaurantDetailScreen';
import { ChefProfileScreen } from '../screens/profile/ChefProfileScreen';
import type { SearchStackParamList } from './types';

const Stack = createNativeStackNavigator<SearchStackParamList>();

export function SearchStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Search" component={SearchScreen} />
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
