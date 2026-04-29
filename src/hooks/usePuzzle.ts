import { useState, useCallback, useEffect } from 'react';
import { GameMode, GameState } from '../types';
import { db, auth } from '../lib/firebase';
import { collection, addDoc, doc, updateDoc, increment, serverTimestamp, setDoc, getDoc } from 'firebase/firestore';
import { useSettings } from '../contexts/SettingsContext';

const SNAKE_MAP = [0, 1, 2, 3, 7, 6, 5, 4, 8, 9, 10, 11, 15, 14, 13, 12];
const SPIRAL_MAP = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4, 5, 6, 10, 9];

export function usePuzzle() {
  const { playSFX, triggerHaptic } = useSettings();
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
    const target = getTargetState(state.mode);
    setState((s) => {
      let newTiles = [...target];
      let lastMove: number | null = null;
      
      for (let i = 0; i < 300; i++) {
        const empty = newTiles.indexOf(null);
        const row = Math.floor(empty / 4);
        const col = empty % 4;
        let neighbors = [];
        
        if (row > 0 && empty - 4 !== lastMove) neighbors.push(empty - 4);
        if (row < 3 && empty + 4 !== lastMove) neighbors.push(empty + 4);
        if (col > 0 && empty - 1 !== lastMove) neighbors.push(empty - 1);
        if (col < 3 && empty + 1 !== lastMove) neighbors.push(empty + 1);
        
        const next = neighbors[Math.floor(Math.random() * neighbors.length)];
        [newTiles[empty], newTiles[next]] = [newTiles[next], newTiles[empty]];
        lastMove = empty; // Track last empty position to avoid immediate reverse moves
      }
      
      return { 
        ...s, 
        tiles: newTiles, 
        targetState: target,
        moves: 0, 
        seconds: 0, 
        isStarted: true, 
        isVictory: false 
      };
    });
  }, [state.mode, getTargetState]);

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

        // Feedback
        if (isVictory) {
          playSFX('victory');
        } else {
          playSFX('move');
        }
        triggerHaptic();

        if (isVictory && auth.currentUser) {
          saveGameResult(s.moves + 1, s.seconds, s.mode);
        }

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
  }, [playSFX, triggerHaptic]);

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

  const saveGameResult = async (moves: number, seconds: number, mode: GameMode) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      // 1. Save to history
      await addDoc(collection(db, 'games', user.uid, 'history'), {
        userId: user.uid,
        mode,
        moves,
        seconds,
        timestamp: serverTimestamp()
      });

      // 2. Update user stats
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      const currentBest = userDoc.data()?.bestTime || 999999;
      
      await updateDoc(userRef, {
        totalGames: increment(1),
        totalMoves: increment(moves),
        xp: increment(Math.max(10, 100 - seconds)), // Simple XP logic
        bestTime: Math.min(currentBest, seconds),
        updatedAt: serverTimestamp()
      });

      // 3. Update leaderboards (All-time, Daily, and Weekly)
      const now = new Date();
      const dateKey = now.toISOString().split('T')[0];
      
      // Weekly key (YYYY-WW)
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      const weekKey = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;

      const leadCategories = [
        `alltime_${mode}`,
        `daily_${dateKey}_${mode}`,
        `weekly_${weekKey}_${mode}`
      ];

      for (const cat of leadCategories) {
        const leaderboardRef = doc(db, 'leaderboard', cat, user.uid);
        const currentLead = await getDoc(leaderboardRef);
        
        if (!currentLead.exists() || seconds < currentLead.data().seconds) {
          await setDoc(leaderboardRef, {
            userId: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
            moves,
            seconds,
            mode,
            timeCategory: cat,
            timestamp: serverTimestamp()
          });
        }
      }
    } catch (error) {
      console.error("Error saving game result:", error);
    }
  };

  return { state, moveTile, shuffleGame, initGame };
}
