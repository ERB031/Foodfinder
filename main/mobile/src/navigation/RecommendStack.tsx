import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SelectRestaurantScreen } from '../screens/recommend/SelectRestaurantScreen';
import { SelectDishScreen } from '../screens/recommend/SelectDishScreen';
import { WriteRecommendationScreen } from '../screens/recommend/WriteRecommendationScreen';
import type { RecommendStackParamList } from './types';

const Stack = createNativeStackNavigator<RecommendStackParamList>();

export function RecommendStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="SelectRestaurant"
        component={SelectRestaurantScreen}
        options={{ title: 'Pick a Restaurant' }}
      />
      <Stack.Screen
        name="SelectDish"
        component={SelectDishScreen}
        options={{ title: 'Pick a Dish' }}
      />
      <Stack.Screen
        name="WriteRecommendation"
        component={WriteRecommendationScreen}
        options={{ title: 'Recommend' }}
      />
    </Stack.Navigator>
  );
}
