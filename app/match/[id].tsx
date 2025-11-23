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

interface MatchDetails {
  idEvent: string;
  strEvent: string;
  strHomeTeam: string;
  strAwayTeam: string;
  intHomeScore: string | null;
  intAwayScore: string | null;
  strHomeTeamBadge: string;
  strAwayTeamBadge: string;
  strLeague: string;
  strLeagueBadge: string;
  dateEvent: string;
  strTime: string;
  strStatus: string;
  strVenue: string;
  strDescriptionEN: string;
  strCity: string;
  strCountry: string;
}

export default function MatchDetailsScreen() {
  const { id } = useLocalSearchParams();
  const [match, setMatch] = useState<MatchDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔍 Match ID from params:', id);
    if (id) {
      fetchMatchDetails();
    }
  }, [id]);

  const fetchMatchDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`📡 Fetching match details for ID: ${id}`);
      const response = await fetch(`${SPORTS_API_BASE}/lookupevent.php?id=${id}`);
      const data = await response.json();
      
      console.log('📊 API Response:', data);
      
      if (data.events && data.events.length > 0) {
        const matchData = data.events[0];
        setMatch(matchData);
        console.log('✅ Match loaded:', matchData.strEvent);
      } else {
        setError('Match not found');
        console.log('❌ No match data found');
      }
    } catch (err) {
      console.error('❌ Error fetching match details:', err);
      setError('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A8FF00" />
          <Text style={styles.loadingText}>Loading match details...</Text>
        </View>
      </ThemedView>
    );
  }

  if (error || !match) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Details</Text>
          <View style={{ width: 40 }} />
        </View>
        <View style={styles.errorContainer}>
          <Feather name="alert-circle" size={64} color="#FF4757" />
          <Text style={styles.errorTitle}>{error || 'Match not found'}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchMatchDetails}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButtonAlt} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Feather name="arrow-left" size={24} color="#1A1A1A" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Match Details</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Match Header Card */}
        <LinearGradient colors={['#FF4757', '#FF6B7A']} style={styles.matchHeader}>
          <View style={styles.teamsContainer}>
            {/* Home Team */}
            <View style={styles.teamSection}>
              {match.strHomeTeamBadge ? (
                <Image source={{ uri: match.strHomeTeamBadge }} style={styles.teamLogo} />
              ) : (
                <View style={styles.placeholderLogo}>
                  <Feather name="shield" size={40} color="#fff" />
                </View>
              )}
              <Text style={styles.teamName} numberOfLines={2}>
                {match.strHomeTeam}
              </Text>
            </View>

            {/* Score */}
            <View style={styles.scoreContainer}>
              <Text style={styles.score}>
                {match.intHomeScore || '0'} - {match.intAwayScore || '0'}
              </Text>
              <View style={styles.statusBadge}>
                <Text style={styles.matchStatus}>{match.strStatus || 'Scheduled'}</Text>
              </View>
            </View>

            {/* Away Team */}
            <View style={styles.teamSection}>
              {match.strAwayTeamBadge ? (
                <Image source={{ uri: match.strAwayTeamBadge }} style={styles.teamLogo} />
              ) : (
                <View style={styles.placeholderLogo}>
                  <Feather name="shield" size={40} color="#fff" />
                </View>
              )}
              <Text style={styles.teamName} numberOfLines={2}>
                {match.strAwayTeam}
              </Text>
            </View>
          </View>

          {/* League Badge */}
          {match.strLeagueBadge && (
            <View style={styles.leagueBadgeContainer}>
              <Image
                source={{ uri: match.strLeagueBadge }}
                style={styles.leagueBadgeSmall}
                resizeMode="contain"
              />
            </View>
          )}
        </LinearGradient>

        {/* Match Info Card */}
        <View style={styles.infoCard}>
          <Text style={styles.sectionTitle}>Match Information</Text>
          
          <View style={styles.infoRow}>
            <Feather name="award" size={20} color="#FF4757" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>League</Text>
              <Text style={styles.infoValue}>{match.strLeague || 'N/A'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="calendar" size={20} color="#A8FF00" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Date</Text>
              <Text style={styles.infoValue}>{match.dateEvent || 'TBD'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="clock" size={20} color="#2196F3" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Time</Text>
              <Text style={styles.infoValue}>{match.strTime || 'TBD'}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Feather name="map-pin" size={20} color="#FFC107" />
            <View style={styles.infoTextContainer}>
              <Text style={styles.infoLabel}>Venue</Text>
              <Text style={styles.infoValue}>{match.strVenue || 'TBD'}</Text>
            </View>
          </View>

          {match.strCity && (
            <View style={styles.infoRow}>
              <Feather name="navigation" size={20} color="#9C27B0" />
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoLabel}>Location</Text>
                <Text style={styles.infoValue}>
                  {match.strCity}{match.strCountry ? `, ${match.strCountry}` : ''}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Description */}
        {match.strDescriptionEN && (
          <View style={styles.descriptionCard}>
            <Text style={styles.sectionTitle}>Match Description</Text>
            <Text style={styles.description}>{match.strDescriptionEN}</Text>
          </View>
        )}

        {/* Debug Info (Remove in production) */}
        <View style={styles.debugCard}>
          <Text style={styles.debugText}>Match ID: {match.idEvent}</Text>
        </View>
      </ScrollView>
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
    padding: 16,
    paddingTop: 48,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E8EBED',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingVertical: 100,
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
    paddingVertical: 100,
  },
  errorTitle: {
    fontSize: 18,
    color: '#666',
    fontWeight: '600',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#A8FF00',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  backButtonAlt: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  backButtonText: {
    color: '#666',
    fontWeight: '600',
    fontSize: 14,
  },
  matchHeader: {
    padding: 24,
    paddingTop: 32,
    margin: 16,
    borderRadius: 20,
    position: 'relative',
  },
  teamsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogo: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  placeholderLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  teamName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  scoreContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  score: {
    color: '#fff',
    fontSize: 40,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 8,
  },
  matchStatus: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },
  leagueBadgeContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#fff',
    borderRadius: 25,
    padding: 8,
  },
  leagueBadgeSmall: {
    width: 30,
    height: 30,
  },
  infoCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#1A1A1A',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 16,
    color: '#1A1A1A',
    fontWeight: '600',
  },
  descriptionCard: {
    backgroundColor: '#fff',
    margin: 16,
    marginTop: 0,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
  debugCard: {
    backgroundColor: '#f0f0f0',
    margin: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 32,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'monospace',
  },
});
