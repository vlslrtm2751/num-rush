import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { useGameContext } from '../context/GameContext';
import { getRecordRank } from '../utils/leaderboard';
import { RootStackParamList } from '../../App';

type ResultScreenNavProp = StackNavigationProp<RootStackParamList, 'Result'>;

interface Props {
  navigation: ResultScreenNavProp;
}

function formatTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const secs = Math.floor(totalMs / 1000);
  const millis = totalMs % 1000;
  return `${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}s`;
}

export const ResultScreen: React.FC<Props> = ({ navigation }) => {
  const { elapsedMs, leaderboard, lastRecordMs } = useGameContext();
  const displayMs = lastRecordMs || elapsedMs;

  const bestMs = leaderboard.length > 0 ? leaderboard[0].ms : displayMs;
  const rank = getRecordRank(displayMs, leaderboard);
  const isNewBest = leaderboard.length > 0 && displayMs === bestMs;

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>🎉 DONE!</Text>

      <View style={styles.card}>
        <Text style={styles.label}>YOUR TIME</Text>
        <Text style={styles.timeText}>{formatTime(displayMs)}</Text>

        {isNewBest && (
          <View style={styles.newBestBadge}>
            <Text style={styles.newBestText}>🏆 NEW BEST!</Text>
          </View>
        )}

        <View style={styles.divider} />

        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>BEST</Text>
            <Text style={styles.statValue}>{formatTime(bestMs)}</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>RANK</Text>
            <Text style={styles.statValue}>#{rank}</Text>
          </View>
        </View>
      </View>

      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.retryBtn}
          onPress={() => navigation.replace('Game')}
          activeOpacity={0.85}
        >
          <Text style={styles.retryText}>🔄  RETRY</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leaderboardBtn}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.85}
        >
          <Text style={styles.leaderboardText}>🏆  LEADERBOARD</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.homeBtn}
          onPress={() => navigation.navigate('Home')}
          activeOpacity={0.85}
        >
          <Text style={styles.homeText}>🏠  HOME</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  } as ViewStyle,
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    letterSpacing: 2,
  } as TextStyle,
  card: {
    backgroundColor: '#1E2D3D',
    borderRadius: 16,
    padding: 28,
    width: '100%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E75B6',
    marginBottom: 32,
  } as ViewStyle,
  label: {
    color: '#AAAAAA',
    fontSize: 13,
    letterSpacing: 2,
    marginBottom: 8,
  } as TextStyle,
  timeText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontFamily: 'monospace' as any,
  } as TextStyle,
  newBestBadge: {
    backgroundColor: '#1A56A0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginTop: 8,
  } as ViewStyle,
  newBestText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  } as TextStyle,
  divider: {
    height: 1,
    backgroundColor: '#2E75B6',
    width: '100%',
    marginVertical: 20,
  } as ViewStyle,
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  } as ViewStyle,
  statItem: {
    alignItems: 'center',
  } as ViewStyle,
  statLabel: {
    color: '#AAAAAA',
    fontSize: 12,
    letterSpacing: 2,
    marginBottom: 4,
  } as TextStyle,
  statValue: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'monospace' as any,
  } as TextStyle,
  btnArea: {
    width: '100%',
    gap: 12,
  } as ViewStyle,
  retryBtn: {
    backgroundColor: '#1A56A0',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  } as ViewStyle,
  retryText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  } as TextStyle,
  leaderboardBtn: {
    backgroundColor: '#2E75B6',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  } as ViewStyle,
  leaderboardText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  } as TextStyle,
  homeBtn: {
    backgroundColor: '#1E2D3D',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#2E75B6',
  } as ViewStyle,
  homeText: {
    color: '#AAAAAA',
    fontSize: 16,
  } as TextStyle,
});
