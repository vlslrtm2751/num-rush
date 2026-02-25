import React, { useEffect, useCallback, useRef } from 'react';
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
import { NumberGrid } from '../components/NumberGrid';
import { CountdownOverlay } from '../components/CountdownOverlay';
import { PauseOverlay } from '../components/PauseOverlay';
import { useTimer } from '../hooks/useTimer';
import { useGameLogic } from '../hooks/useGameLogic';
import { useGameContext } from '../context/GameContext';
import { RootStackParamList } from '../../App';

type GameScreenNavProp = StackNavigationProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavProp;
}

function formatTime(ms: number): string {
  const totalMs = Math.floor(ms);
  const secs = Math.floor(totalMs / 1000);
  const millis = totalMs % 1000;
  return `${String(secs).padStart(2, '0')}.${String(millis).padStart(3, '0')}`;
}

export const GameScreen: React.FC<Props> = ({ navigation }) => {
  const { gameState, setGameState, saveGameRecord, setElapsedMs, setWrongCount, leaderboard } = useGameContext();
  const { elapsedMs, start, pause, resume, stop } = useTimer();
  const gameDoneRef = useRef(false);
  // Ref to capture elapsedMs without adding it to handleGameDone's deps.
  // Avoids recreating handleGameDone (and handleNumberPress) on every RAF tick.
  const elapsedMsRef = useRef(0);
  useEffect(() => {
    elapsedMsRef.current = elapsedMs;
  }, [elapsedMs]);

  const bestMs = leaderboard.length > 0 ? leaderboard[0].ms : null;

  const handleGameDone = useCallback(() => {
    if (gameDoneRef.current) return;
    gameDoneRef.current = true;
    stop();
    const finalMs = elapsedMsRef.current;
    setElapsedMs(finalMs);
    setGameState('done');
  }, [stop, setElapsedMs, setGameState]);

  const {
    targetNumber,
    gridPositions,
    flash,
    progress,
    wrongCount,
    initGame,
    handleNumberPress,
  } = useGameLogic(handleGameDone);

  // Start game when this screen mounts
  useEffect(() => {
    gameDoneRef.current = false;
    initGame();
    setGameState('countdown');
    return () => {
      stop();
      setGameState('idle');
    };
  }, []);

  // Navigate to result when done
  useEffect(() => {
    if (gameState === 'done') {
      setWrongCount(wrongCount);
      saveGameRecord(elapsedMsRef.current).then(() => {
        navigation.replace('Result');
      });
    }
  }, [gameState]);

  const handleCountdownDone = useCallback(() => {
    setGameState('playing');
    start();
  }, [start, setGameState]);

  const handlePause = useCallback(() => {
    if (gameState !== 'playing') return;
    pause();
    setGameState('paused');
  }, [gameState, pause, setGameState]);

  const handleResume = useCallback(() => {
    if (gameState !== 'paused') return;
    setGameState('playing');
    resume();
  }, [gameState, resume, setGameState]);

  const handleHome = useCallback(() => {
    stop();
    setGameState('idle');
    navigation.navigate('Home');
  }, [stop, setGameState, navigation]);

  const isPlaying = gameState === 'playing';
  const isPaused = gameState === 'paused';
  const isCountdown = gameState === 'countdown';

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleHome}>
          <Text style={styles.iconText}>🏠</Text>
        </TouchableOpacity>

        <View style={styles.timerArea}>
          <Text style={styles.clockIcon}>⏱</Text>
          <Text style={styles.timerText}>{formatTime(elapsedMs)}</Text>
        </View>

        <TouchableOpacity
          style={styles.iconBtn}
          onPress={handlePause}
          disabled={!isPlaying}
        >
          <Text style={[styles.iconText, !isPlaying && styles.iconDisabled]}>
            ⏸
          </Text>
        </TouchableOpacity>
      </View>

      {/* Target + Stats Row */}
      <View style={styles.statsRow}>
        <View style={styles.targetBox}>
          <Text style={styles.targetLabel}>NEXT</Text>
          <Text style={styles.targetNum}>{targetNumber}</Text>
        </View>

        <View style={styles.centerStats}>
          <View style={styles.progressBarBg}>
            <View
              style={[styles.progressBarFill, { width: `${(progress / 50) * 100}%` }]}
            />
          </View>
          <Text style={styles.progressText}>{progress} / 50</Text>
        </View>

        <View style={styles.wrongBox}>
          <Text style={styles.wrongLabel}>MISS</Text>
          <Text style={styles.wrongNum}>{wrongCount}</Text>
        </View>
      </View>

      {/* Best time hint */}
      {bestMs !== null && (
        <View style={styles.bestRow}>
          <Text style={styles.bestText}>
            Best: <Text style={styles.bestVal}>{formatTime(bestMs)}</Text>
          </Text>
        </View>
      )}

      {/* Grid */}
      <View style={styles.gridWrapper}>
        <NumberGrid
          gridPositions={gridPositions}
          flash={flash}
          onPress={handleNumberPress}
          disabled={!isPlaying}
        />
      </View>

      {/* Countdown Overlay */}
      {isCountdown && (
        <CountdownOverlay onCountdownDone={handleCountdownDone} />
      )}

      {/* Pause Overlay */}
      {isPaused && (
        <PauseOverlay onResume={handleResume} onHome={handleHome} />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0D1B2A',
  } as ViewStyle,
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1E2D3D',
  } as ViewStyle,
  iconBtn: {
    padding: 8,
    width: 44,
    alignItems: 'center',
  } as ViewStyle,
  iconText: {
    fontSize: 22,
  } as TextStyle,
  iconDisabled: {
    opacity: 0.3,
  } as TextStyle,
  timerArea: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  clockIcon: {
    fontSize: 18,
    marginRight: 4,
  } as TextStyle,
  timerText: {
    fontSize: 26,
    color: '#FFFFFF',
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
  } as TextStyle,
  // Stats row (target | progress | miss)
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#1A2A3A',
  } as ViewStyle,
  targetBox: {
    alignItems: 'center',
    minWidth: 52,
    backgroundColor: '#1A3A5C',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#3B9EFF',
  } as ViewStyle,
  targetLabel: {
    color: '#7AB8FF',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  } as TextStyle,
  targetNum: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace' as any,
    lineHeight: 32,
  } as TextStyle,
  centerStats: {
    flex: 1,
    gap: 4,
  } as ViewStyle,
  progressBarBg: {
    height: 10,
    backgroundColor: '#1E2D3D',
    borderRadius: 5,
    overflow: 'hidden',
  } as ViewStyle,
  progressBarFill: {
    height: '100%',
    backgroundColor: '#3B9EFF',
    borderRadius: 5,
  } as ViewStyle,
  progressText: {
    color: '#888888',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'monospace' as any,
  } as TextStyle,
  wrongBox: {
    alignItems: 'center',
    minWidth: 52,
    backgroundColor: '#3A1A1A',
    borderRadius: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#FF5555',
  } as ViewStyle,
  wrongLabel: {
    color: '#FF9999',
    fontSize: 9,
    fontWeight: 'bold',
    letterSpacing: 1,
  } as TextStyle,
  wrongNum: {
    color: '#FF5555',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'monospace' as any,
    lineHeight: 32,
  } as TextStyle,
  bestRow: {
    alignItems: 'center',
    paddingVertical: 4,
  } as ViewStyle,
  bestText: {
    color: '#555555',
    fontSize: 12,
  } as TextStyle,
  bestVal: {
    color: '#FFD700',
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
  } as TextStyle,
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  } as ViewStyle,
});
