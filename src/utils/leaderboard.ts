import AsyncStorage from '@react-native-async-storage/async-storage';

const LEADERBOARD_KEY = 'numrush_leaderboard';

export interface LeaderboardRecord {
  ms: number;
  date: string;
}

export async function saveRecord(ms: number): Promise<LeaderboardRecord[]> {
  try {
    const existing = await loadLeaderboard();
    const newRecord: LeaderboardRecord = {
      ms,
      date: new Date().toISOString(),
    };
    const updated = [...existing, newRecord]
      .sort((a, b) => a.ms - b.ms)
      .slice(0, 20);
    await AsyncStorage.setItem(LEADERBOARD_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return [];
  }
}

export async function loadLeaderboard(): Promise<LeaderboardRecord[]> {
  try {
    const data = await AsyncStorage.getItem(LEADERBOARD_KEY);
    if (!data) return [];
    return JSON.parse(data) as LeaderboardRecord[];
  } catch {
    return [];
  }
}

export function getRecordRank(ms: number, records: LeaderboardRecord[]): number {
  const sorted = [...records].sort((a, b) => a.ms - b.ms);
  const idx = sorted.findIndex((r) => r.ms === ms);
  return idx === -1 ? sorted.length + 1 : idx + 1;
}
