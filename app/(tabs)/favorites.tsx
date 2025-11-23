import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFavorite } from '@/store/slices/favoritesSlice';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

const LOGO = require('@/assets/images/logo.png');

export default function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites?.favorites || []);
  const primaryColor = useThemeColor({}, 'tint');

  const handleRemoveFavorite = (item: any) => {
    dispatch(removeFavorite(item));
  };

  const handleItemPress = (item: any) => {
    if (item.idTeam) {
      // Navigate to team details (you can implement this later)
      console.log('Navigate to team:', item.idTeam);
    } else if (item.idPlayer) {
      router.push(`/player/${item.idPlayer}`);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Image 
            source={LOGO}
            style={styles.logoImage}
            resizeMode="contain"
          />
          <ThemedText style={styles.subtitle}>
            {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
          </ThemedText>
        </View>

        {/* Favorites List */}
        {favorites.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Feather name="heart" size={64} color={primaryColor} opacity={0.3} />
            <ThemedText style={styles.emptyTitle}>No Favorites Yet</ThemedText>
            <ThemedText style={styles.emptySubtitle}>
              Mark teams, players, or matches as favorites to see them here
            </ThemedText>
            <TouchableOpacity
              style={styles.exploreCTA}
              onPress={() => router.push('/(tabs)')}
            >
              <ThemedText style={styles.exploreCTAText}>Explore Matches</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {favorites.map((favorite: any, index: number) => (
              <TouchableOpacity
                key={favorite.idTeam || favorite.idPlayer || index}
                style={styles.favoriteCard}
                onPress={() => handleItemPress(favorite)}
              >
                {(favorite.strTeamBadge || favorite.strThumb) && (
                  <Image
                    source={{ uri: favorite.strTeamBadge || favorite.strThumb }}
                    style={styles.itemImage}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.favoriteInfo}>
                  <ThemedText style={styles.favoriteName}>
                    {favorite.strTeam || favorite.strPlayer || 'Unknown'}
                  </ThemedText>
                  <ThemedText style={styles.favoriteLeague}>
                    {favorite.strLeague || favorite.strPosition || 'N/A'}
                  </ThemedText>
                </View>
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={() => handleRemoveFavorite(favorite)}
                >
                  <Feather name="heart" size={24} color="#FF4757" />
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 48,
    backgroundColor: '#fff',
  },
  logoImage: {
    width: 120,
    height: 50,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    opacity: 0.7,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    marginTop: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreCTA: {
    backgroundColor: '#FF4757',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  exploreCTAText: {
    color: 'white',
    fontWeight: '600',
  },
  favoritesList: {
    padding: 12,
  },
  favoriteCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  favoriteInfo: {
    flex: 1,
  },
  favoriteName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  favoriteLeague: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 2,
  },
  removeButton: {
    padding: 8,
  },
});

