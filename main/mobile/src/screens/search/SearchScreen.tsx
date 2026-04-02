import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { SearchStackParamList } from '../../navigation/types';
import type { Restaurant } from '@shared/types';

type Props = NativeStackScreenProps<SearchStackParamList, 'Search'>;

export function SearchScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results] = useState<Restaurant[]>([]);

  function renderResult({ item }: { item: Restaurant }) {
    return (
      <TouchableOpacity
        style={styles.resultCard}
        onPress={() =>
          navigation.navigate('RestaurantDetail', { restaurantId: item.id })
        }
      >
        <Text style={styles.resultName}>{item.name}</Text>
        <Text style={styles.resultInfo}>
          {item.cuisineTypes.join(', ')} · {'$'.repeat(item.priceRange)}
        </Text>
        <Text style={styles.resultAddress}>{item.address}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search restaurants, dishes, or chefs..."
          value={query}
          onChangeText={setQuery}
          autoCorrect={false}
        />
      </View>

      <FlatList
        data={results}
        renderItem={renderResult}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {query
                ? 'No results found'
                : 'Search for restaurants, dishes, or chefs'}
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
  searchBar: {
    backgroundColor: '#fff',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  searchInput: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  resultCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  resultName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  resultInfo: {
    fontSize: 14,
    color: '#2D6A4F',
    marginBottom: 4,
  },
  resultAddress: {
    fontSize: 13,
    color: '#888',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: 14,
    color: '#888',
  },
});
