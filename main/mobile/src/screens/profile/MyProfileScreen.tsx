import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useAuth } from '../../hooks/useAuth';
import type { ProfileStackParamList } from '../../navigation/types';

type Props = NativeStackScreenProps<ProfileStackParamList, 'MyProfile'>;

export function MyProfileScreen({ navigation }: Props) {
  const { chef, logout } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {chef?.displayName?.charAt(0).toUpperCase() ?? '?'}
          </Text>
        </View>
        <Text style={styles.name}>{chef?.displayName ?? 'Chef'}</Text>
        <Text style={styles.bio}>{chef?.bio ?? 'No bio yet'}</Text>

        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statCount}>{chef?.recommendationCount ?? 0}</Text>
            <Text style={styles.statLabel}>Recs</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statCount}>{chef?.followerCount ?? 0}</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </View>
          <View style={styles.stat}>
            <Text style={styles.statCount}>{chef?.followingCount ?? 0}</Text>
            <Text style={styles.statLabel}>Following</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditProfile')}
      >
        <Text style={styles.editButtonText}>Edit Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Sign Out</Text>
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
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    color: '#666',
    paddingHorizontal: 40,
    textAlign: 'center',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 32,
  },
  stat: {
    alignItems: 'center',
  },
  statCount: {
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  editButton: {
    margin: 16,
    borderWidth: 1,
    borderColor: '#2D6A4F',
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#2D6A4F',
    fontWeight: '600',
  },
  logoutButton: {
    marginHorizontal: 16,
    padding: 14,
    alignItems: 'center',
  },
  logoutText: {
    color: '#D32F2F',
    fontWeight: '500',
  },
});
