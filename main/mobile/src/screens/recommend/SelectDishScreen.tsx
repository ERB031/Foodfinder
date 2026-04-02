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
import type { Dish } from '@shared/types';

type Props = NativeStackScreenProps<RecommendStackParamList, 'SelectDish'>;

export function SelectDishScreen({ navigation, route }: Props) {
  const { restaurantId, restaurantName } = route.params;
  const [dishName, setDishName] = useState('');
  const [existingDishes] = useState<Dish[]>([]);

  function handleSelectExisting(dish: Dish) {
    navigation.navigate('WriteRecommendation', {
      restaurantId,
      restaurantName,
      dishId: dish.id,
      dishName: dish.name,
    });
  }

  function handleCreateNew() {
    navigation.navigate('WriteRecommendation', {
      restaurantId,
      restaurantName,
      dishName: dishName.trim(),
    });
  }

  function handleSkip() {
    navigation.navigate('WriteRecommendation', {
      restaurantId,
      restaurantName,
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>
        What dish at {restaurantName} do you recommend?
      </Text>

      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          placeholder="Type a dish name..."
          value={dishName}
          onChangeText={setDishName}
        />
        {dishName.trim().length > 0 && (
          <TouchableOpacity style={styles.addButton} onPress={handleCreateNew}>
            <Text style={styles.addButtonText}>Add</Text>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={existingDishes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.dishItem}
            onPress={() => handleSelectExisting(item)}
          >
            <Text style={styles.dishName}>{item.name}</Text>
            <Text style={styles.dishMeta}>
              {item.recommendationCount} recommendations
            </Text>
          </TouchableOpacity>
        )}
        ListHeaderComponent={
          existingDishes.length > 0 ? (
            <Text style={styles.sectionTitle}>Previously recommended dishes</Text>
          ) : null
        }
      />

      <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
        <Text style={styles.skipText}>
          Skip — recommend the restaurant overall
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 16,
    fontWeight: '600',
    padding: 16,
    paddingBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#2D6A4F',
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#888',
    paddingHorizontal: 16,
    paddingVertical: 8,
    textTransform: 'uppercase',
  },
  dishItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  dishName: {
    fontSize: 16,
    fontWeight: '500',
  },
  dishMeta: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  skipButton: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    alignItems: 'center',
  },
  skipText: {
    color: '#888',
    fontSize: 14,
  },
});
