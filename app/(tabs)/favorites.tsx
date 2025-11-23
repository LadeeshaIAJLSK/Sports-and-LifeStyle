import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { removeFavorite } from '@/store/slices/favoritesSlice';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function FavoritesScreen() {
  const dispatch = useAppDispatch();
  const { favorites } = useAppSelector((state) => state.favorites);
  const primaryColor = useThemeColor({}, 'tint');

  const handleRemoveFavorite = (team: any) => {
    dispatch(removeFavorite(team));
  };

  const handleTeamPress = (team: any) => {
    router.push({
      pathname: '/(tabs)/team/[id]' as const,
      params: { id: team.idTeam }
    });
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>
            ❤️ My Favorites
          </ThemedText>
          <ThemedText style={styles.subtitle}>
            {favorites.length} team{favorites.length !== 1 ? 's' : ''} saved
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
              onPress={() => router.navigate('/(tabs)/explore' as any)}
            >
              <ThemedText style={styles.exploreCTAText}>Explore Teams</ThemedText>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.favoritesList}>
            {favorites.map((favorite) => (
              <TouchableOpacity
                key={favorite.idTeam}
                style={styles.favoriteCard}
                onPress={() => handleTeamPress(favorite)}
              >
                {favorite.strTeamBadge && (
                  <Image
                    source={{ uri: favorite.strTeamBadge }}
                    style={styles.teamImage}
                    resizeMode="contain"
                  />
                )}
                <View style={styles.favoriteInfo}>
                  <ThemedText style={styles.favoriteName}>
                    {favorite.strTeam}
                  </ThemedText>
                  <ThemedText style={styles.favoriteLeague}>
                    {favorite.strLeague}
                  </ThemedText>
                  {favorite.intFormedYear && (
                    <ThemedText style={styles.favoriteYear}>
                      Founded: {favorite.intFormedYear}
                    </ThemedText>
                  )}
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
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 16,
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
    marginTop: 40,
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
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  teamImage: {
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
  favoriteYear: {
    fontSize: 11,
    opacity: 0.6,
  },
  removeButton: {
    padding: 8,
  },
});