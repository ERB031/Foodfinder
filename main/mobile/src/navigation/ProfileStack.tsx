import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MyProfileScreen } from '../screens/profile/MyProfileScreen';
import { EditProfileScreen } from '../screens/profile/EditProfileScreen';
import { ChefProfileScreen } from '../screens/profile/ChefProfileScreen';
import { RecommendationDetailScreen } from '../screens/feed/RecommendationDetailScreen';
import type { ProfileStackParamList } from './types';

const Stack = createNativeStackNavigator<ProfileStackParamList>();

export function ProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{ title: 'Edit Profile' }}
      />
      <Stack.Screen
        name="ChefProfile"
        component={ChefProfileScreen}
        options={{ title: 'Chef' }}
      />
      <Stack.Screen
        name="RecommendationDetail"
        component={RecommendationDetailScreen}
        options={{ title: 'Recommendation' }}
      />
    </Stack.Navigator>
  );
}
