import { View, Text, FlatList, StyleSheet, RefreshControl } from 'react-native';
import { useState, useCallback } from 'react';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/types';
import type { FeedItem } from '@shared/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;

export function FeedScreen({ navigation }: Props) {
  const [refreshing, setRefreshing] = useState(false);
  const [items] = useState<FeedItem[]>([]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // TODO: fetch feed from API
    setRefreshing(false);
  }, []);

  function renderItem({ item }: { item: FeedItem }) {
    return (
      <View style={styles.card}>
        <Text style={styles.chefName}>
          {item.recommendation.chef?.displayName}
        </Text>
        <Text style={styles.restaurantName}>
          {item.recommendation.restaurant?.name}
        </Text>
        {item.recommendation.dish && (
          <Text style={styles.dishName}>{item.recommendation.dish.name}</Text>
        )}
        <Text style={styles.notes}>{item.recommendation.notes}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyTitle}>No recommendations yet</Text>
            <Text style={styles.emptySubtitle}>
              Follow chefs or explore nearby to discover great dishes
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  chefName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2D6A4F',
    marginBottom: 4,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  dishName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#555',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});
