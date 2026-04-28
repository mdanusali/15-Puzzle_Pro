export type GameMode = 'linear_asc' | 'linear_desc' | 'snake_asc' | 'spiral_asc';

export interface GameState {
  tiles: (number | null)[];
  targetState: (number | null)[];
  moves: number;
  seconds: number;
  isStarted: boolean;
  isVictory: boolean;
  mode: GameMode;
}

export type View = 'play' | 'stats' | 'leaderboard' | 'settings';
