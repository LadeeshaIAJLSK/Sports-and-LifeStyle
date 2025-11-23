
import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View, Text, TouchableOpacity, RefreshControl, Image, ActivityIndicator } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchLiveMatches } from '@/store/slices/liveMatchesSlice';
import { addFavorite, removeFavorite } from '@/store/slices/favoritesSlice';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '@/contexts/AuthContext';

const LOGO = require('@/assets/images/logo.png');

// Sports API Configuration
const SPORTS_API_BASE = 'https://www.thesportsdb.com/api/v1/json/3';

interface Match {
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
  strSport: string;
}

export default function HomeScreen() {
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites?.favorites || []);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const leagueIds = [
        '4328', // English Premier League
        '4335', // Spanish La Liga
        '4331', // German Bundesliga
        '4332', // Italian Serie A
        '4334', // French Ligue 1
        '4424', // UEFA Champions League
      ];

      const allMatches: Match[] = [];

      for (const leagueId of leagueIds) {
        try {
          const response = await fetch(`${SPORTS_API_BASE}/eventsnextleague.php?id=${leagueId}`);
          const data = await response.json();
          
          if (data.events) {
            allMatches.push(...data.events);
          }
        } catch (err) {
          console.error(`Error fetching league ${leagueId}:`, err);
        }
      }

      try {
        const liveResponse = await fetch(`${SPORTS_API_BASE}/eventsday.php?d=${getCurrentDate()}&s=Soccer`);
        const liveData = await liveResponse.json();
        
        if (liveData.events) {
          allMatches.push(...liveData.events);
        }
      } catch (err) {
        console.error('Error fetching live matches:', err);
      }

      const uniqueMatches = Array.from(
        new Map(allMatches.map(match => [match.idEvent, match])).values()
      ).sort((a, b) => {
        const dateA = new Date(`${a.dateEvent} ${a.strTime}`).getTime();
        const dateB = new Date(`${b.dateEvent} ${b.strTime}`).getTime();
        return dateA - dateB;
      });

      setMatches(uniqueMatches.slice(0, 20));
    } catch (err) {
      console.error('Error fetching matches:', err);
      setError('Failed to load matches. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMatches();
    setRefreshing(false);
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isFavorite = (matchId: string) => {
    if (!favorites || !Array.isArray(favorites)) return false;
    return favorites.some((fav: any) => fav.idEvent === matchId);
  };

  const toggleFavorite = (match: Match) => {
    const favoriteData = {
      idEvent: match.idEvent,
      strEvent: match.strEvent,
      strHomeTeam: match.strHomeTeam,
      strAwayTeam: match.strAwayTeam,
      strHomeTeamBadge: match.strHomeTeamBadge,
      strAwayTeamBadge: match.strAwayTeamBadge,
      strLeague: match.strLeague,
      dateEvent: match.dateEvent,
      strTime: match.strTime,
    };

    if (isFavorite(match.idEvent)) {
      dispatch(removeFavorite(favoriteData));
      console.log('❌ Removed from favorites');
    } else {
      dispatch(addFavorite(favoriteData));
      console.log('✅ Added to favorites');
    }
  };

  const filteredMatches = matches.filter(match => {
    if (activeTab === 'all') return true;
    if (activeTab === 'upcoming') return !match.intHomeScore;
    if (activeTab === 'completed') return match.intHomeScore !== undefined && match.intHomeScore !== null;
    return true;
  });

  const getMatchStatus = (match: Match) => {
    if (match.strStatus === 'FT' || (match.intHomeScore && match.intAwayScore)) {
      return 'Completed';
    } else if (match.strStatus === 'LIVE' || match.strStatus === 'In Play') {
      return 'Live';
    }
    return 'Scheduled';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'TBD';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (loading && matches.length === 0) {
    return (
      <ThemedView style={styles.container}>
        <View style={styles.header}>
          <Image 
            source={LOGO}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A8FF00" />
          <Text style={styles.loadingText}>Loading matches...</Text>
        </View>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Image 
          source={LOGO}
          style={styles.logoImage}
          resizeMode="contain"
        />
        <View style={styles.headerRight}>
          <Text style={styles.welcomeText}>Welcome, {user?.firstName || 'User'}!</Text>
          <TouchableOpacity style={styles.headerIcon}>
            <Feather name="bell" size={22} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Matches Section */}
      <View style={styles.matchesSection}>
        <View style={styles.matchesHeader}>
          <View>
            <Text style={styles.matchesTitle}>Matches</Text>
            <Text style={styles.matchesSubtitle}>Stay updated with the latest sports action</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {['all', 'upcoming', 'completed'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === 'all' ? 'All Matches' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity onPress={fetchMatches} style={styles.retryButton}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Matches Grid */}
        <ScrollView
          style={styles.scrollView}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#A8FF00']} />
          }
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.matchesGrid}>
            {filteredMatches.map((match, index) => (
              <TouchableOpacity
                key={match.idEvent}
                style={styles.matchCard}
                onPress={() => router.push(`/match/${match.idEvent}`)}
                activeOpacity={0.9}
              >
                {/* Gradient Background Header */}
                <View style={styles.cardHeader}>
                  <View style={styles.gradientOverlay} />
                  
                  {/* Overlapping Team Logos */}
                  <View style={styles.overlappingLogos}>
                    {/* Home Team Logo - Left */}
                    <View style={[styles.teamLogoContainer, styles.leftLogo]}>
                      <View style={styles.logoCircleWhite}>
                        {match.strHomeTeamBadge ? (
                          <Image
                            source={{ uri: match.strHomeTeamBadge }}
                            style={styles.teamLogoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Feather name="shield" size={40} color="#ccc" />
                        )}
                      </View>
                    </View>

                    {/* League Badge - Center (Overlapping) */}
                    <View style={styles.leagueBadgeCenter}>
                      <View style={styles.leagueBadgeCircle}>
                        {match.strLeagueBadge ? (
                          <Image
                            source={{ uri: match.strLeagueBadge }}
                            style={styles.leagueBadgeImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Feather name="award" size={18} color="#666" />
                        )}
                      </View>
                    </View>

                    {/* Away Team Logo - Right */}
                    <View style={[styles.teamLogoContainer, styles.rightLogo]}>
                      <View style={styles.logoCircleWhite}>
                        {match.strAwayTeamBadge ? (
                          <Image
                            source={{ uri: match.strAwayTeamBadge }}
                            style={styles.teamLogoImage}
                            resizeMode="contain"
                          />
                        ) : (
                          <Feather name="shield" size={40} color="#ccc" />
                        )}
                      </View>
                    </View>
                  </View>

                  {/* Team Names */}
                  <View style={styles.teamNamesRow}>
                    <Text style={styles.teamNameTop} numberOfLines={1}>
                      {match.strHomeTeam?.split(' ')[0]}
                    </Text>
                    <Text style={styles.teamNameTop} numberOfLines={1}>
                      {match.strAwayTeam?.split(' ')[0]}
                    </Text>
                  </View>
                </View>

                {/* Card Content */}
                <View style={styles.cardContent}>
                  {/* Match Title */}
                  <Text style={styles.matchTitle} numberOfLines={2}>
                    {match.strHomeTeam} vs {match.strAwayTeam}
                  </Text>
                  
                  <Text style={styles.leagueText} numberOfLines={1}>
                    {match.strLeague || 'League'}
                  </Text>

                  {/* Score Section */}
                  <View style={styles.scoreSection}>
                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreLabel}>
                        {match.strHomeTeam?.split(' ').slice(-1)[0] || 'Home'}
                      </Text>
                      <Text style={styles.scoreValue}>{match.intHomeScore ?? '0'}</Text>
                    </View>

                    <View style={styles.statusBadge}>
                      <View style={[
                        styles.statusDot,
                        getMatchStatus(match) === 'Live' && styles.statusDotLive,
                        getMatchStatus(match) === 'Completed' && styles.statusDotCompleted
                      ]} />
                      <Text style={styles.statusText}>{getMatchStatus(match)}</Text>
                    </View>

                    <View style={styles.scoreBox}>
                      <Text style={styles.scoreLabel}>
                        {match.strAwayTeam?.split(' ').slice(-1)[0] || 'Away'}
                      </Text>
                      <Text style={styles.scoreValue}>{match.intAwayScore ?? '0'}</Text>
                    </View>
                  </View>

                  {/* Date Time */}
                  <View style={styles.dateTimeRow}>
                    <View style={styles.dateTimeItem}>
                      <Feather name="calendar" size={12} color="#999" />
                      <Text style={styles.dateTimeText}>{formatDate(match.dateEvent)}</Text>
                    </View>
                    <View style={styles.dateTimeItem}>
                      <Feather name="clock" size={12} color="#999" />
                      <Text style={styles.dateTimeText}>{match.strTime || 'TBD'}</Text>
                    </View>
                  </View>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity
                  style={styles.favoriteButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    toggleFavorite(match);
                  }}
                >
                  <Feather
                    name="heart"
                    size={18}
                    color={isFavorite(match.idEvent) ? '#FF4757' : '#999'}
                    fill={isFavorite(match.idEvent) ? '#FF4757' : 'transparent'}
                  />
                </TouchableOpacity>
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
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingTop: 48,
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
  logoImage: {
    width: 120,
    height: 50,
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
  welcomeText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  headerIcon: {
    padding: 8,
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
  matchesSection: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  matchesHeader: {
    marginBottom: 20,
  },
  matchesTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  matchesSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 30,
    padding: 5,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 25,
  },
  tabActive: {
    backgroundColor: '#1A1A1A',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#999',
  },
  tabTextActive: {
    color: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  matchesGrid: {
    gap: 0,
    paddingBottom: 100,
  },
  matchCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    marginBottom: 12,
  },
  cardHeader: {
    backgroundColor: '#FF4757',
    paddingTop: 20,
    paddingBottom: 12,
    position: 'relative',
    overflow: 'hidden',
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  overlappingLogos: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 12,
  },
  teamLogoContainer: {
    alignItems: 'center',
    zIndex: 1,
  },
  leftLogo: {
    marginRight: -12,
  },
  rightLogo: {
    marginLeft: -12,
  },
  logoCircleWhite: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  teamLogoImage: {
    width: 50,
    height: 50,
  },
  leagueBadgeCenter: {
    zIndex: 2,
    marginHorizontal: 0,
  },
  leagueBadgeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#A8FF00',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  leagueBadgeImage: {
    width: 24,
    height: 24,
  },
  teamNamesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  teamNameTop: {
    fontSize: 13,
    fontWeight: '700',
    color: '#000',
    flex: 1,
    textAlign: 'center',
  },
  cardContent: {
    padding: 14,
  },
  matchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 3,
    lineHeight: 16,
  },
  leagueText: {
    fontSize: 11,
    color: '#999',
    marginBottom: 12,
    fontWeight: '500',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 12,
    gap: 4,
  },
  scoreBox: {
    flex: 0.28,
    alignItems: 'center',
  },
  scoreLabel: {
    fontSize: 9,
    color: '#999',
    marginBottom: 2,
    fontWeight: '600',
  },
  scoreValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  statusBadge: {
    flex: 0.44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#999',
  },
  statusDotLive: {
    backgroundColor: '#FF4757',
  },
  statusDotCompleted: {
    backgroundColor: '#4CAF50',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#666',
  },
  dateTimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'center',
  },
  dateTimeText: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 25,
    padding: 7,
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
});