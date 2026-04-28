import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Undo2, Lightbulb, Sparkles } from 'lucide-react';
import { GameState, GameMode } from '../types';

interface PuzzleBoardProps {
  state: GameState;
  moveTile: (idx: number) => void;
  shuffleGame: () => void;
}

export function PuzzleBoard({ state, moveTile, shuffleGame }: PuzzleBoardProps) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="h-8">
        <AnimatePresence>
          {state.isVictory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-400 font-black uppercase tracking-[0.3em] text-xs flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20"
            >
              <Sparkles size={14} /> MISSION ACCOMPLISHED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-neutral-900/40 p-12 rounded-[3rem] border border-neutral-800 relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 bg-neutral-950 p-5 rounded-[2.5rem] border-4 border-neutral-900 shadow-2xl">
          <div className="grid grid-cols-4 gap-3 w-[420px] h-[420px]">
            {state.tiles.map((tile, idx) => (
              <motion.div
                key={tile || 'empty'}
                layout
                onClick={() => tile !== null && moveTile(idx)}
                className={`
                  rounded-2xl flex items-center justify-center select-none transition-all duration-75 text-3xl font-black
                  ${tile === null 
                    ? 'bg-neutral-900 border-2 border-dashed border-neutral-800' 
                    : 'bg-blue-600 text-white cursor-pointer tile-shadow hover:brightness-110 active:tile-pressed border border-blue-400/20'
                  }
                `}
              >
                {tile}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlPanelProps {
  onShuffle: () => void;
  onModeChange: (mode: GameMode) => void;
  currentMode: GameMode;
  moves: number;
  seconds: number;
}

export function ControlPanel({ onShuffle, onModeChange, currentMode, moves, seconds }: ControlPanelProps) {
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="w-80 flex flex-col gap-6">
      {/* Game Mode Selector */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
        <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-3 block">Operation Mode</label>
        <select 
          value={currentMode}
          onChange={(e) => onModeChange(e.target.value as GameMode)}
          className="w-full bg-neutral-950 text-white border border-neutral-800 rounded-xl py-3 px-4 text-[11px] font-bold uppercase tracking-tight focus:ring-blue-500 outline-none"
        >
          <option value="linear_asc">Standard Linear</option>
          <option value="linear_desc">Reverse Linear</option>
          <option value="snake_asc">Snake Pattern</option>
          <option value="spiral_asc">Spiral Pattern</option>
        </select>
      </div>

      {/* Main Action */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5">
        <button 
          onClick={onShuffle}
          className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-tighter text-sm shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
        >
          <Shuffle size={20} />
          Initialize Sequence
        </button>
      </div>

      {/* Stats Bento */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-2">Moves</div>
          <div className="text-3xl font-black text-white italic">{moves}</div>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-6 flex flex-col items-center justify-center">
          <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest leading-none mb-2">Timer</div>
          <div className="text-3xl font-black text-emerald-400 italic">{formatTime(seconds)}</div>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl p-5 flex gap-2">
        <button className="flex-1 bg-neutral-800 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-neutral-700 opacity-50 cursor-not-allowed">
          AutoSolve
        </button>
        <button className="flex-1 bg-neutral-800 text-white py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-neutral-700 opacity-50 cursor-not-allowed">
          Undo
        </button>
      </div>
    </div>
  );
}
