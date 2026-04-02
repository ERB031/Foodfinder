import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'ChefProfile'>;

export function ChefProfileScreen({ route }: Props) {
  const { chefId } = route.params;

  // TODO: fetch chef profile and recommendations from API

  return (
    <View style={styles.container}>
      <Text style={styles.placeholder}>Chef profile: {chefId}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  placeholder: {
    fontSize: 14,
    color: '#888',
  },
});
