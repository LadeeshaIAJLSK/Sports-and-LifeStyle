import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  RefreshControl,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

interface Player {
  idPlayer: string;
  strPlayer: string;
  strTeam: string;
  strPosition: string;
  strNationality: string;
  strThumb: string;
  strCutout: string;
  dateBorn: string;
  strHeight: string;
  strWeight: string;
  strNumber: string;
}

export default function PlayersScreen() {
  const dispatch = useAppDispatch();
  const favoriteTeams = useAppSelector((state) => state.favorites.favorites);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch players from top teams
      const topTeams = [
        '133604', // Manchester United
        '133602', // Arsenal
        '133602', // Chelsea
        '133616', // Real Madrid
        '133739', // Barcelona
      ];

      const allPlayers: Player[] = [];

      for (const teamId of topTeams) {
        try {
          const response = await fetch(
            `${SPORTS_API_BASE}/lookup_all_players.php?id=${teamId}`
          );
          const data = await response.json();
          
          if (data.player) {
            allPlayers.push(...data.player);
          }
        } catch (err) {
          console.error(`Error fetching team ${teamId}:`, err);
        }
      }

      setPlayers(allPlayers.slice(0, 50));
    } catch (err) {
      console.error('Error fetching players:', err);
      setError('Failed to load players. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPlayers();
    setRefreshing(false);
  };

  const isFavoritePlayer = (playerId: string) => {
    return favoriteTeams.some((fav: any) => fav.idPlayer === playerId);
  };

  const toggleFavoritePlayer = (player: Player) => {
    if (isFavoritePlayer(player.idPlayer)) {
      dispatch(removeFavorite({ idPlayer: player.idPlayer }));
    } else {
      dispatch(
        addFavorite({
          idPlayer: player.idPlayer,
          strPlayer: player.strPlayer,
          strThumb: player.strThumb,
          strTeam: player.strTeam,
          strPosition: player.strPosition,
        })
      );
    }
  };

  const filteredPlayers = players.filter((player) =>
    player.strPlayer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.strTeam?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    player.strPosition?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading && players.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A8FF00" />
          <Text style={styles.loadingText}>Loading players...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>⚽</Text>
          </View>
          <Text style={styles.headerTitle}>Players</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="bell" size={20} color="#1A1A1A" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Feather name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search players, teams, positions..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Feather name="x-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Players Section */}
      <View style={styles.playersSection}>
        <View style={styles.playersHeader}>
          <Text style={styles.playersTitle}>Top Players</Text>
          <Text style={styles.playersSubtitle}>
            Discover football's finest talents
          </Text>
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity
              style={styles.retryButton}
              onPress={fetchPlayers}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Players List */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#A8FF00']}
              tintColor="#A8FF00"
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.playersGrid}>
            {filteredPlayers.map((player, index) => (
              <TouchableOpacity
                key={player.idPlayer + index}
                style={styles.playerCard}
                onPress={() => router.push(`/player/${player.idPlayer}`)}
                activeOpacity={0.9}
              >
                {/* Card Background Gradient */}
                <LinearGradient
                  colors={['#667eea', '#764ba2']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.cardGradient}
                >
                  {/* Player Image */}
                  <View style={styles.playerImageContainer}>
                    {player.strCutout || player.strThumb ? (
                      <Image
                        source={{
                          uri: player.strCutout || player.strThumb,
                        }}
                        style={styles.playerImage}
                        resizeMode="contain"
                      />
                    ) : (
                      <View style={styles.playerImagePlaceholder}>
                        <Feather name="user" size={40} color="#fff" />
                      </View>
                    )}
                  </View>

                  {/* Favorite Button */}
                  <TouchableOpacity
                    style={styles.favoriteButton}
                    onPress={(e) => {
                      e.stopPropagation();
                      toggleFavoritePlayer(player);
                    }}
                  >
                    <Feather
                      name={isFavoritePlayer(player.idPlayer) ? 'heart' : 'heart'}
                      size={18}
                      color={isFavoritePlayer(player.idPlayer) ? '#FF4757' : '#999'}
                      fill={isFavoritePlayer(player.idPlayer) ? '#FF4757' : 'none'}
                    />
                  </TouchableOpacity>
                </LinearGradient>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  <Text style={styles.playerName} numberOfLines={1}>
                    {player.strPlayer}
                  </Text>
                  
                  <Text style={styles.playerTeam} numberOfLines={1}>
                    {player.strTeam || 'Free Agent'}
                  </Text>

                  <View style={styles.playerDetails}>
                    <View style={styles.detailItem}>
                      <Feather name="shield" size={12} color="#A8FF00" />
                      <Text style={styles.detailText}>
                        {player.strPosition || 'N/A'}
                      </Text>
                    </View>
                    
                    {player.strNumber && (
                      <View style={styles.detailItem}>
                        <Text style={styles.numberBadge}>
                          #{player.strNumber}
                        </Text>
                      </View>
                    )}
                  </View>

                  {player.strNationality && (
                    <View style={styles.nationalityContainer}>
                      <Feather name="flag" size={10} color="#999" />
                      <Text style={styles.nationalityText}>
                        {player.strNationality}
                      </Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 3,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#A8FF00',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoEmoji: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  headerIcon: {
    padding: 8,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: '#666',
    fontWeight: '500',
  },
  errorContainer: {
    backgroundColor: '#FFE5E5',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: 'center',
  },
  errorText: {
    color: '#D32F2F',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#A8FF00',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  playersSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  playersHeader: {
    marginBottom: 20,
  },
  playersTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  playersSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  scrollView: {
    flex: 1,
  },
  playersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    paddingBottom: 100,
  },
  playerCard: {
    width: '47.5%',
    backgroundColor: '#fff',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cardGradient: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  playerImageContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerImage: {
    width: 120,
    height: 160,
  },
  playerImagePlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 8,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  cardContent: {
    padding: 16,
  },
  playerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  playerTeam: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  playerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 11,
    color: '#666',
    fontWeight: '600',
  },
  numberBadge: {
    backgroundColor: '#A8FF00',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontSize: 11,
    fontWeight: 'bold',
    color: '#000',
  },
  nationalityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  nationalityText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
});