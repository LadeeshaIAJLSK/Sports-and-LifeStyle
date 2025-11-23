import React from 'react';
import { StyleSheet, ScrollView, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { sportsAPI, LEAGUES } from '@/services/sportsAPI';

export default function APITest() {
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<any>({});
  const [error, setError] = React.useState<string | null>(null);

  const testEndpoints = async () => {
    setLoading(true);
    setError(null);
    const testResults: any = {};

    try {
      // Test 1: Get Premier League Teams
      console.log('Testing Premier League Teams...');
      const plTeams = await sportsAPI.getLeagueTeams('English Premier League');
      testResults.plTeams = {
        success: true,
        count: plTeams.length,
        sample: plTeams[0],
      };

      // Test 2: Get Today's Events
      console.log('Testing Today\'s Events...');
      const today = new Date().toISOString().split('T')[0];
      const events = await sportsAPI.getEventsByDate(today);
      testResults.todayEvents = {
        success: true,
        count: events.length,
        sample: events[0],
      };

      // Test 3: Get Premier League Events
      console.log('Testing Premier League Events...');
      const plEvents = await sportsAPI.getLastLeagueEvents(LEAGUES.PREMIER_LEAGUE);
      testResults.plEvents = {
        success: true,
        count: plEvents.length,
        sample: plEvents[0],
      };

      // Test 4: Get Team Details
      if (plTeams.length > 0) {
        console.log('Testing Team Details...');
        const teamDetails = await sportsAPI.getTeamDetails(plTeams[0].idTeam);
        testResults.teamDetails = {
          success: true,
          sample: teamDetails,
        };
      }

      // Test 5: Get Event Details
      if (events.length > 0) {
        console.log('Testing Event Details...');
        const eventDetails = await sportsAPI.getEventDetails(events[0].idEvent);
        testResults.eventDetails = {
          success: true,
          sample: eventDetails,
        };
      }

      setResults(testResults);
    } catch (err) {
      console.error('API Test Error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderTestResults = () => {
    return Object.entries(results).map(([key, value]: [string, any]) => (
      <View key={key} style={styles.resultCard}>
        <ThemedText style={styles.resultTitle}>
          {key}: {value.success ? '✅' : '❌'}
        </ThemedText>
        {value.count !== undefined && (
          <ThemedText>Count: {value.count}</ThemedText>
        )}
        {value.sample && (
          <ScrollView style={styles.sampleData} horizontal>
            <ThemedText>
              Sample Data: {JSON.stringify(value.sample, null, 2)}
            </ThemedText>
          </ScrollView>
        )}
      </View>
    ));
  };

  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity
        style={styles.testButton}
        onPress={testEndpoints}
        disabled={loading}
      >
        <ThemedText style={styles.buttonText}>
          {loading ? 'Testing...' : 'Run API Tests'}
        </ThemedText>
      </TouchableOpacity>

      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
          <ThemedText style={styles.loadingText}>
            Testing API endpoints...
          </ThemedText>
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>{error}</ThemedText>
        </View>
      )}

      <ScrollView style={styles.resultsContainer}>
        {renderTestResults()}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  testButton: {
    backgroundColor: '#4CAF50',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  loadingText: {
    marginTop: 8,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: '#ffebee',
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#c62828',
  },
  resultsContainer: {
    flex: 1,
  },
  resultCard: {
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    marginBottom: 12,
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  sampleData: {
    maxHeight: 200,
    marginTop: 8,
  },
});