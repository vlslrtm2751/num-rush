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
  const { gameState, setGameState, saveGameRecord, setElapsedMs } = useGameContext();
  const { elapsedMs, start, pause, resume, stop } = useTimer();
  const gameDoneRef = useRef(false);

  const handleGameDone = useCallback(() => {
    if (gameDoneRef.current) return;
    gameDoneRef.current = true;
    stop();
    setElapsedMs(elapsedMs);
    setGameState('done');
  }, [stop, elapsedMs, setElapsedMs, setGameState]);

  const {
    targetNumber,
    gridPositions,
    flash,
    progress,
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
      saveGameRecord(elapsedMs).then(() => {
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
          <Text style={styles.timerText}>{formatTime(elapsedMs)}s</Text>
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

      {/* Progress Bar */}
      <View style={styles.progressRow}>
        <Text style={styles.hintText}>
          다음: <Text style={styles.hintNum}>{targetNumber}</Text>
        </Text>
        <View style={styles.progressBarBg}>
          <View
            style={[styles.progressBarFill, { width: `${(progress / 50) * 100}%` }]}
          />
        </View>
        <Text style={styles.progressText}>{progress}/50</Text>
      </View>

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
    fontSize: 24,
    color: '#FFFFFF',
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
    minWidth: 100,
    textAlign: 'center',
  } as TextStyle,
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  } as ViewStyle,
  hintText: {
    color: '#AAAAAA',
    fontSize: 14,
    minWidth: 60,
  } as TextStyle,
  hintNum: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontFamily: 'monospace' as any,
  } as TextStyle,
  progressBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: '#1E2D3D',
    borderRadius: 4,
    overflow: 'hidden',
  } as ViewStyle,
  progressBarFill: {
    height: '100%',
    backgroundColor: '#1A56A0',
    borderRadius: 4,
  } as ViewStyle,
  progressText: {
    color: '#AAAAAA',
    fontSize: 13,
    minWidth: 36,
    textAlign: 'right',
    fontFamily: 'monospace' as any,
  } as TextStyle,
  gridWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  } as ViewStyle,
});
