import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { MusicToggle } from '../components/MusicToggle';
import { RootStackParamList } from '../../App';
import { useGameContext } from '../context/GameContext';

type HomeScreenNavProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavProp;
}

const ANIMATED_NUMS = ['1', '3', '7', '2', '9', '4'];

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const { refreshLeaderboard } = useGameContext();
  const animValues = useRef(
    ANIMATED_NUMS.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    refreshLeaderboard();
    const anims = animValues.map((val, i) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(i * 300),
          Animated.timing(val, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(val, {
            toValue: 0,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      )
    );
    anims.forEach((a) => a.start());
    return () => anims.forEach((a) => a.stop());
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft} />
        <MusicToggle />
      </View>

      <View style={styles.logoArea}>
        <View style={styles.numRow}>
          {ANIMATED_NUMS.map((n, i) => (
            <Animated.Text
              key={i}
              style={[
                styles.animNum,
                {
                  opacity: animValues[i].interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.3, 1],
                  }),
                  transform: [
                    {
                      translateY: animValues[i].interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, -8],
                      }),
                    },
                  ],
                },
              ]}
            >
              {n}
            </Animated.Text>
          ))}
        </View>
        <Text style={styles.logo}>NumRush</Text>
        <Text style={styles.tagline}>Tap 1 → 50 as fast as you can!</Text>
      </View>

      <View style={styles.btnArea}>
        <TouchableOpacity
          style={styles.startBtn}
          onPress={() => navigation.navigate('Game')}
          activeOpacity={0.85}
        >
          <Text style={styles.startText}>START</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.leaderboardBtn}
          onPress={() => navigation.navigate('Leaderboard')}
          activeOpacity={0.85}
        >
          <Text style={styles.leaderboardText}>🏆  LEADERBOARD</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.version}>v1.0.0</Text>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
  } as ViewStyle,
  headerLeft: {
    width: 40,
  } as ViewStyle,
  logoArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  } as ViewStyle,
  numRow: {
    flexDirection: 'row',
    marginBottom: 12,
  } as ViewStyle,
  animNum: {
    fontSize: 28,
    color: '#2E75B6',
    fontFamily: 'monospace' as any,
    fontWeight: 'bold',
    marginHorizontal: 4,
  } as TextStyle,
  logo: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#FFFFFF',
    letterSpacing: 2,
  } as TextStyle,
  tagline: {
    fontSize: 14,
    color: '#AAAAAA',
    marginTop: 8,
  } as TextStyle,
  btnArea: {
    paddingHorizontal: 32,
    paddingBottom: 32,
    alignItems: 'center',
  } as ViewStyle,
  startBtn: {
    backgroundColor: '#1A56A0',
    paddingVertical: 18,
    paddingHorizontal: 80,
    borderRadius: 12,
    marginBottom: 16,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#1A56A0',
    shadowOpacity: 0.4,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  } as ViewStyle,
  startText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 4,
  } as TextStyle,
  leaderboardBtn: {
    backgroundColor: '#2E75B6',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
  } as ViewStyle,
  leaderboardText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  } as TextStyle,
  version: {
    textAlign: 'center',
    color: '#444',
    fontSize: 12,
    paddingBottom: 8,
  } as TextStyle,
});
