import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RecommendStackParamList } from '../../navigation/types';
import type { Restaurant } from '@shared/types';

type Props = NativeStackScreenProps<RecommendStackParamList, 'SelectRestaurant'>;

export function SelectRestaurantScreen({ navigation }: Props) {
  const [query, setQuery] = useState('');
  const [results] = useState<Restaurant[]>([]);

  function handleSelect(restaurant: Restaurant) {
    navigation.navigate('SelectDish', {
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
    });
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a restaurant..."
          value={query}
          onChangeText={setQuery}
          autoFocus
        />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => handleSelect(item)}
          >
            <Text style={styles.itemName}>{item.name}</Text>
            <Text style={styles.itemAddress}>{item.address}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>
              {query ? 'No restaurants found' : 'Type to search restaurants'}
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
  item: {
    backgroundColor: '#fff',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemAddress: {
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
