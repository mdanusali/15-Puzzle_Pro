export type GameMode = 'linear_asc' | 'linear_desc' | 'snake_asc' | 'spiral_asc';

export interface GameState {
  tiles: (number | null)[];
  targetState: (number | null)[];
  moves: number;
  seconds: number;
  isStarted: boolean;
  isVictory: boolean;
  isPaused: boolean;
  mode: GameMode;
  history: (number | null)[][];
}

export interface GameSettings {
  sfx: boolean;
  music: boolean;
  haptics: boolean;
  theme: 'cobalt' | 'ivory';
}

export type View = 'play' | 'stats' | 'leaderboard' | 'settings';
