import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

export default function PlayerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPlayerDetails();
  }, [id]);

  const fetchPlayerDetails = async () => {
    try {
      const response = await fetch(`${SPORTS_API_BASE}/lookupplayer.php?id=${id}`);
      const data = await response.json();
      if (data.players && data.players.length > 0) {
        setPlayer(data.players[0]);
      }
    } catch (error) {
      console.error('Error fetching player details:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={playerStyles.container}>
        <View style={playerStyles.loadingContainer}>
          <ActivityIndicator size="large" color="#A8FF00" />
          <Text style={playerStyles.loadingText}>Loading player details...</Text>
        </View>
      </ThemedView>
    );
  }

  if (!player) {
    return (
      <ThemedView style={playerStyles.container}>
        <View style={playerStyles.header}>
          <TouchableOpacity onPress={() => router.back()} style={playerStyles.backButton}>
            <Feather name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={playerStyles.headerTitleWhite}>Player Profile</Text>
        </View>
        <View style={playerStyles.errorContainer}>
          <Feather name="alert-circle" size={48} color="#FF4757" />
          <Text style={playerStyles.errorText}>Player not found</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={playerStyles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Player Header */}
        <LinearGradient colors={['#667eea', '#764ba2']} style={playerStyles.playerHeader}>
          {/* Header with Back Button */}
          <View style={playerStyles.header}>
            <TouchableOpacity onPress={() => router.back()} style={playerStyles.backButton}>
              <Feather name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={playerStyles.headerTitleWhite}>Player Profile</Text>
          </View>

          {/* Player Image */}
          <View style={playerStyles.playerImageSection}>
            {player.strCutout || player.strThumb ? (
              <Image
                source={{ uri: player.strCutout || player.strThumb }}
                style={playerStyles.playerImage}
                resizeMode="contain"
              />
            ) : (
              <View style={playerStyles.playerImagePlaceholder}>
                <Feather name="user" size={80} color="#fff" />
              </View>
            )}
          </View>

          {/* Player Name and Number */}
          <Text style={playerStyles.playerName}>{player.strPlayer}</Text>
          {player.strNumber && (
            <View style={playerStyles.numberBadge}>
              <Text style={playerStyles.numberText}>#{player.strNumber}</Text>
            </View>
          )}
        </LinearGradient>

        {/* Player Info Cards */}
        <View style={playerStyles.infoSection}>
          <View style={playerStyles.infoCard}>
            <Feather name="shield" size={24} color="#FF4757" />
            <View style={playerStyles.infoTextContainer}>
              <Text style={playerStyles.infoLabel}>Team</Text>
              <Text style={playerStyles.infoValue}>{player.strTeam || 'Free Agent'}</Text>
            </View>
          </View>

          <View style={playerStyles.infoCard}>
            <Feather name="target" size={24} color="#A8FF00" />
            <View style={playerStyles.infoTextContainer}>
              <Text style={playerStyles.infoLabel}>Position</Text>
              <Text style={playerStyles.infoValue}>{player.strPosition || 'N/A'}</Text>
            </View>
          </View>

          <View style={playerStyles.infoCard}>
            <Feather name="flag" size={24} color="#2196F3" />
            <View style={playerStyles.infoTextContainer}>
              <Text style={playerStyles.infoLabel}>Nationality</Text>
              <Text style={playerStyles.infoValue}>{player.strNationality || 'N/A'}</Text>
            </View>
          </View>

          <View style={playerStyles.infoCard}>
            <Feather name="calendar" size={24} color="#FFC107" />
            <View style={playerStyles.infoTextContainer}>
              <Text style={playerStyles.infoLabel}>Birth Date</Text>
              <Text style={playerStyles.infoValue}>{player.dateBorn || 'N/A'}</Text>
            </View>
          </View>
        </View>

        {/* Physical Stats */}
        {(player.strHeight || player.strWeight) && (
          <View style={playerStyles.statsSection}>
            <Text style={playerStyles.sectionTitle}>Physical Stats</Text>
            <View style={playerStyles.statsGrid}>
              {player.strHeight && (
                <View style={playerStyles.statBox}>
                  <Text style={playerStyles.statValue}>{player.strHeight}</Text>
                  <Text style={playerStyles.statLabel}>Height</Text>
                </View>
              )}
              {player.strWeight && (
                <View style={playerStyles.statBox}>
                  <Text style={playerStyles.statValue}>{player.strWeight}</Text>
                  <Text style={playerStyles.statLabel}>Weight</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* Biography */}
        {player.strDescriptionEN && (
          <View style={playerStyles.bioSection}>
            <Text style={playerStyles.sectionTitle}>Biography</Text>
            <View style={playerStyles.bioCard}>
              <Text style={playerStyles.bioText}>{player.strDescriptionEN}</Text>
            </View>
          </View>
        )}
      </ScrollView>
    </ThemedView>
  );
}

const playerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    padding: 32,
  },
  errorText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    gap: 12,
  },
  backButton: {
    padding: 8,
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: 20,
  },
  headerTitleWhite: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  playerHeader: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  playerImageSection: {
    marginTop: 20,
    marginBottom: 20,
  },
  playerImage: {
    width: 200,
    height: 250,
  },
  playerImagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  numberBadge: {
    backgroundColor: '#A8FF00',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 12,
  },
  numberText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  infoSection: {
    padding: 16,
    gap: 12,
  },
  infoCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statsSection: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF4757',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
  },
  bioSection: {
    padding: 16,
    marginBottom: 32,
  },
  bioCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  bioText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});
