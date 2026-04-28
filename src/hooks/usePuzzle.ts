import { useState, useCallback, useEffect } from 'react';
import { GameMode, GameState } from '../types';

const SNAKE_MAP = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12];
const SPIRAL_MAP = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];

export function usePuzzle() {
  const [state, setState] = useState<GameState>({
    tiles: [],
    targetState: [],
    moves: 0,
    seconds: 0,
    isStarted: false,
    isVictory: false,
    mode: 'linear_asc',
  });

  const getTargetState = useCallback((mode: GameMode) => {
    let base = [...Array(15).keys()].map((i) => i + 1);
    let temp = Array(16).fill(null);

    if (mode === 'linear_asc') return [...base, null];
    if (mode === 'linear_desc') return [...base.reverse(), null];
    if (mode === 'snake_asc') {
      base.forEach((v, i) => (temp[SNAKE_MAP[i]] = v));
      return temp;
    }
    if (mode === 'spiral_asc') {
      base.forEach((v, i) => (temp[SPIRAL_MAP[i]] = v));
      return temp;
    }
    return [...base, null];
  }, []);

  const initGame = useCallback((mode: GameMode = state.mode) => {
    const target = getTargetState(mode);
    setState((s) => ({
      ...s,
      tiles: [...target],
      targetState: target,
      moves: 0,
      seconds: 0,
      isStarted: false,
      isVictory: false,
      mode,
    }));
  }, [state.mode, getTargetState]);

  const shuffleGame = useCallback(() => {
    initGame();
    setState((s) => {
      let newTiles = [...s.tiles];
      for (let i = 0; i < 300; i++) {
        const empty = newTiles.indexOf(null);
        const row = Math.floor(empty / 4);
        const col = empty % 4;
        let neighbors = [];
        if (row > 0) neighbors.push(empty - 4);
        if (row < 3) neighbors.push(empty + 4);
        if (col > 0) neighbors.push(empty - 1);
        if (col < 3) neighbors.push(empty + 1);
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        [newTiles[empty], newTiles[next]] = [newTiles[next], newTiles[empty]];
      }
      return { ...s, tiles: newTiles, isStarted: true };
    });
  }, [initGame]);

  const moveTile = useCallback((idx: number) => {
    setState((s) => {
      if (s.isVictory) return s;
      
      const emptyIdx = s.tiles.indexOf(null);
      const row = Math.floor(idx / 4);
      const col = idx % 4;
      const eRow = Math.floor(emptyIdx / 4);
      const eCol = emptyIdx % 4;

      if (Math.abs(row - eRow) + Math.abs(col - eCol) === 1) {
        const newTiles = [...s.tiles];
        [newTiles[idx], newTiles[emptyIdx]] = [newTiles[emptyIdx], newTiles[idx]];
        
        const isVictory = newTiles.every((v, i) => v === s.targetState[i]);
        return {
          ...s,
          tiles: newTiles,
          moves: s.moves + 1,
          isStarted: true,
          isVictory,
        };
      }
      return s;
    });
  }, []);

  useEffect(() => {
    initGame();
  }, [initGame]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (state.isStarted && !state.isVictory) {
      interval = setInterval(() => {
        setState((s) => ({ ...s, seconds: s.seconds + 1 }));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [state.isStarted, state.isVictory]);

  return { state, moveTile, shuffleGame, initGame };
}
