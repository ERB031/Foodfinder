import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'RestaurantDetail'>;

export function RestaurantDetailScreen({ route }: Props) {
  const { restaurantId } = route.params;

  // TODO: fetch restaurant detail, dishes, and recommendations from API

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>Restaurant: {restaurantId}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
  },
});
