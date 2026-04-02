import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { FeedStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'RecommendationDetail'>;

export function RecommendationDetailScreen({ route }: Props) {
  const { recommendationId } = route.params;

  // TODO: fetch recommendation detail from API

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.placeholder}>
          Recommendation: {recommendationId}
        </Text>
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
