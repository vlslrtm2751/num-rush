import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const MUSIC_KEY = 'numrush_music_on';

interface SoundContextValue {
  isMusicOn: boolean;
  toggleMusic: () => void;
}

const SoundContext = createContext<SoundContextValue>({
  isMusicOn: false,
  toggleMusic: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const soundRef = useRef<Audio.Sound | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(MUSIC_KEY).then((val) => {
      if (val === 'true') setIsMusicOn(true);
    });
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function manageSound() {
      if (isMusicOn) {
        if (!loadedRef.current) {
          try {
            await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
            const { sound } = await Audio.Sound.createAsync(
              require('../../assets/sounds/bgm.mp3'),
              { isLooping: true, volume: 0.5 }
            );
            if (cancelled) {
              await sound.unloadAsync();
              return;
            }
            soundRef.current = sound;
            loadedRef.current = true;
            await sound.playAsync();
          } catch {
            // BGM file missing or error - silently ignore
            loadedRef.current = false;
          }
        } else if (soundRef.current) {
          try {
            await soundRef.current.playAsync();
          } catch {
            // ignore
          }
        }
      } else {
        if (soundRef.current) {
          try {
            await soundRef.current.pauseAsync();
          } catch {
            // ignore
          }
        }
      }
    }

    manageSound();
    return () => {
      cancelled = true;
    };
  }, [isMusicOn]);

  const toggleMusic = useCallback(() => {
    setIsMusicOn((prev) => {
      const next = !prev;
      AsyncStorage.setItem(MUSIC_KEY, String(next));
      return next;
    });
  }, []);

  return (
    <SoundContext.Provider value={{ isMusicOn, toggleMusic }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext(): SoundContextValue {
  return useContext(SoundContext);
}
