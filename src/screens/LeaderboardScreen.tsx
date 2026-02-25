import React, { useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGameContext } from '../context/GameContext';
import { LeaderboardRecord } from '../utils/leaderboard';
import { RootStackParamList } from '../../App';

type LeaderboardScreenNavProp = StackNavigationProp<RootStackParamList, 'Leaderboard'>;

interface Props {
  navigation: LeaderboardScreenNavProp;
}

function formatTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const secs = Math.floor(totalMs / 1000);
  const millis = totalMs % 1000;
  return `${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}s`;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  } catch {
    return '';
  }
}

const MEDAL = ['🥇', '🥈', '🥉'];

export const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
  const { leaderboard, refreshLeaderboard } = useGameContext();

  useEffect(() => {
    refreshLeaderboard();
  }, []);

  const renderItem = ({ item, index }: { item: LeaderboardRecord; index: number }) => (
    <View style={[styles.row, index === 0 && styles.topRow]}>
      <Text style={styles.rank}>
        {index < 3 ? MEDAL[index] : `#${index + 1}`}
      </Text>
      <Text style={styles.timeVal}>{formatTime(item.ms)}</Text>
      <Text style={styles.date}>{formatDate(item.date)}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>🏆 Leaderboard</Text>
        <View style={styles.headerRight} />
      </View>

      {leaderboard.length === 0 ? (
        <View style={styles.emptyArea}>
          <Text style={styles.emptyText}>No records yet.</Text>
          <Text style={styles.emptySubText}>Complete a game to see your time here!</Text>
        </View>
      ) : (
        <FlatList
          data={leaderboard}
          keyExtractor={(_, i) => String(i)}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  } as ViewStyle,
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D3D',
  } as ViewStyle,
  backBtn: {
    padding: 4,
    minWidth: 70,
  } as ViewStyle,
  backText: {
    color: '#2E75B6',
    fontSize: 16,
  } as TextStyle,
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  } as TextStyle,
  headerRight: {
    minWidth: 70,
  } as ViewStyle,
  listContent: {
    padding: 16,
  } as ViewStyle,
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E2D3D',
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#2E3D4E',
  } as ViewStyle,
  topRow: {
    borderColor: '#FFD700',
    backgroundColor: '#1E2D3D',
  } as ViewStyle,
  rank: {
    fontSize: 18,
    width: 48,
    color: '#FFFFFF',
    fontWeight: 'bold',
  } as TextStyle,
  timeVal: {
    flex: 1,
    fontSize: 20,
    color: '#FFFFFF',
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
  } as TextStyle,
  date: {
    fontSize: 12,
    color: '#AAAAAA',
    minWidth: 80,
    textAlign: 'right',
  } as TextStyle,
  emptyArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  } as ViewStyle,
  emptyText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: 'bold',
    marginBottom: 8,
  } as TextStyle,
  emptySubText: {
    fontSize: 14,
    color: '#AAAAAA',
    textAlign: 'center',
  } as TextStyle,
});
