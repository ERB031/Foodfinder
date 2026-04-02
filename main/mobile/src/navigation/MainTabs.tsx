import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FeedStack } from './FeedStack';
import { SearchStack } from './SearchStack';
import { RecommendStack } from './RecommendStack';
import { ProfileStack } from './ProfileStack';
import type { MainTabParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="FeedTab"
        component={FeedStack}
        options={{
          title: 'Feed',
        }}
      />
      <Tab.Screen
        name="SearchTab"
        component={SearchStack}
        options={{
          title: 'Search',
        }}
      />
      <Tab.Screen
        name="RecommendTab"
        component={RecommendStack}
        options={{
          title: 'Recommend',
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileStack}
        options={{
          title: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}
