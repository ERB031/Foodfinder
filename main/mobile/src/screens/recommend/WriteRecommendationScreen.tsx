import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RecommendStackParamList } from '../../navigation/types';
import { MAX_PHOTOS_PER_RECOMMENDATION } from '@shared/constants';

type Props = NativeStackScreenProps<
  RecommendStackParamList,
  'WriteRecommendation'
>;

export function WriteRecommendationScreen({ route }: Props) {
  const { restaurantName, dishName } = route.params;
  const [notes, setNotes] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAddPhoto() {
    if (photos.length >= MAX_PHOTOS_PER_RECOMMENDATION) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: MAX_PHOTOS_PER_RECOMMENDATION - photos.length,
    });

    if (!result.canceled) {
      setPhotos((prev) => [
        ...prev,
        ...result.assets.map((a) => a.uri),
      ].slice(0, MAX_PHOTOS_PER_RECOMMENDATION));
    }
  }

  async function handleSubmit() {
    if (!notes.trim()) return;
    setLoading(true);
    // TODO: call API to create recommendation
    setLoading(false);
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.restaurantName}>{restaurantName}</Text>
        {dishName && <Text style={styles.dishName}>{dishName}</Text>}
      </View>

      <Text style={styles.label}>
        Why do you recommend this? Share your notes.
      </Text>
      <TextInput
        style={styles.notesInput}
        placeholder="The tonkotsu broth is the best in the city. Ask for extra chashu..."
        value={notes}
        onChangeText={setNotes}
        multiline
        textAlignVertical="top"
      />

      <Text style={styles.label}>
        Photos ({photos.length}/{MAX_PHOTOS_PER_RECOMMENDATION})
      </Text>
      <View style={styles.photoGrid}>
        {photos.map((uri, index) => (
          <View key={uri} style={styles.photoWrapper}>
            <Image source={{ uri }} style={styles.photo} />
            <TouchableOpacity
              style={styles.removePhoto}
              onPress={() =>
                setPhotos((prev) => prev.filter((_, i) => i !== index))
              }
            >
              <Text style={styles.removePhotoText}>X</Text>
            </TouchableOpacity>
          </View>
        ))}
        {photos.length < MAX_PHOTOS_PER_RECOMMENDATION && (
          <TouchableOpacity
            style={styles.addPhotoButton}
            onPress={handleAddPhoto}
          >
            <Text style={styles.addPhotoText}>+</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
        style={[
          styles.submitButton,
          (!notes.trim() || loading) && styles.submitDisabled,
        ]}
        onPress={handleSubmit}
        disabled={!notes.trim() || loading}
      >
        <Text style={styles.submitText}>
          {loading ? 'Posting...' : 'Post Recommendation'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  restaurantName: {
    fontSize: 20,
    fontWeight: '700',
  },
  dishName: {
    fontSize: 16,
    color: '#2D6A4F',
    fontWeight: '500',
    marginTop: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#555',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  notesInput: {
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    minHeight: 120,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 8,
  },
  photoWrapper: {
    position: 'relative',
  },
  photo: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  removePhoto: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#D32F2F',
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removePhotoText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
  addPhotoButton: {
    width: 80,
    height: 80,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addPhotoText: {
    fontSize: 28,
    color: '#aaa',
  },
  submitButton: {
    backgroundColor: '#2D6A4F',
    margin: 16,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  submitDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
