import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { LeaderboardRecord, loadLeaderboard, saveRecord } from '../utils/leaderboard';

export type GameState = 'idle' | 'countdown' | 'playing' | 'paused' | 'done';

interface GameContextValue {
  gameState: GameState;
  setGameState: (s: GameState) => void;
  elapsedMs: number;
  setElapsedMs: (ms: number) => void;
  leaderboard: LeaderboardRecord[];
  refreshLeaderboard: () => Promise<void>;
  saveGameRecord: (ms: number) => Promise<void>;
  lastRecordMs: number;
}

const GameContext = createContext<GameContextValue | null>(null);

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [gameState, setGameState] = useState<GameState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [leaderboard, setLeaderboard] = useState<LeaderboardRecord[]>([]);
  const [lastRecordMs, setLastRecordMs] = useState(0);

  const refreshLeaderboard = useCallback(async () => {
    const records = await loadLeaderboard();
    setLeaderboard(records);
  }, []);

  const saveGameRecord = useCallback(async (ms: number) => {
    setLastRecordMs(ms);
    const updated = await saveRecord(ms);
    setLeaderboard(updated);
  }, []);

  return (
    <GameContext.Provider
      value={{
        gameState,
        setGameState,
        elapsedMs,
        setElapsedMs,
        leaderboard,
        refreshLeaderboard,
        saveGameRecord,
        lastRecordMs,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGameContext must be used within GameProvider');
  return ctx;
}
