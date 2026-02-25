import { useState, useCallback, useRef } from 'react';
import * as Haptics from 'expo-haptics';
import { shuffle } from '../utils/shuffle';

const TOTAL_NUMBERS = 50;
const GRID_SIZE = 30;
const INITIAL_DISPLAY_COUNT = 10;

export interface ButtonFlash {
  number: number;
  type: 'correct' | 'wrong';
}

export interface GameLogicState {
  targetNumber: number;
  gridPositions: number[];
  displayedNumbers: number[];
  lastDisplayedNumber: number;
  flash: ButtonFlash | null;
  progress: number;
  initGame: () => void;
  handleNumberPress: (num: number) => void;
}

export function useGameLogic(onGameDone: () => void): GameLogicState {
  const [targetNumber, setTargetNumber] = useState(1);
  const [gridPositions, setGridPositions] = useState<number[]>(Array(GRID_SIZE).fill(0));
  const [displayedNumbers, setDisplayedNumbers] = useState<number[]>([]);
  const [lastDisplayedNumber, setLastDisplayedNumber] = useState(INITIAL_DISPLAY_COUNT);
  const [flash, setFlash] = useState<ButtonFlash | null>(null);
  const [progress, setProgress] = useState(0);
  const flashTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const initGame = useCallback(() => {
    // Place numbers 1-10 in random positions in the 30-slot grid
    const positions = Array(GRID_SIZE).fill(0);
    const slots = shuffle(Array.from({ length: GRID_SIZE }, (_, i) => i));
    const initial = Array.from({ length: INITIAL_DISPLAY_COUNT }, (_, i) => i + 1);
    initial.forEach((num, idx) => {
      positions[slots[idx]] = num;
    });
    setGridPositions(positions);
    setDisplayedNumbers(initial);
    setTargetNumber(1);
    setLastDisplayedNumber(INITIAL_DISPLAY_COUNT);
    setFlash(null);
    setProgress(0);
  }, []);

  const handleNumberPress = useCallback(
    (num: number) => {
      if (flashTimeoutRef.current) return; // debounce during flash

      if (num === targetNumber) {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

        setFlash({ number: num, type: 'correct' });
        flashTimeoutRef.current = setTimeout(() => {
          flashTimeoutRef.current = null;

          setGridPositions((prev) => {
            const next = [...prev];
            const idx = next.indexOf(num);
            if (idx !== -1) {
              // Place next number if available
              const nextNum = lastDisplayedNumber + 1;
              if (nextNum <= TOTAL_NUMBERS) {
                next[idx] = nextNum;
              } else {
                next[idx] = 0;
              }
            }
            return next;
          });

          setDisplayedNumbers((prev) => {
            const withoutCurrent = prev.filter((n) => n !== num);
            const nextNum = lastDisplayedNumber + 1;
            if (nextNum <= TOTAL_NUMBERS) {
              return [...withoutCurrent, nextNum];
            }
            return withoutCurrent;
          });

          if (lastDisplayedNumber + 1 <= TOTAL_NUMBERS) {
            setLastDisplayedNumber((prev) => prev + 1);
          }

          setFlash(null);
          setProgress(num); // progress = last tapped correct number

          const nextTarget = num + 1;
          if (nextTarget > TOTAL_NUMBERS) {
            onGameDone();
          } else {
            setTargetNumber(nextTarget);
          }
        }, 100);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        setFlash({ number: num, type: 'wrong' });
        flashTimeoutRef.current = setTimeout(() => {
          flashTimeoutRef.current = null;
          setFlash(null);
        }, 200);
      }
    },
    [targetNumber, lastDisplayedNumber, onGameDone]
  );

  return {
    targetNumber,
    gridPositions,
    displayedNumbers,
    lastDisplayedNumber,
    flash,
    progress,
    initGame,
    handleNumberPress,
  };
}
