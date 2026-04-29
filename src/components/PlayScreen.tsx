import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Undo2, Lightbulb, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import { GameState, GameMode } from '../types';

interface PuzzleBoardProps {
  state: GameState;
  moveTile: (idx: number) => void;
  shuffleGame: () => void;
  onTogglePause: () => void;
}

export function PuzzleBoard({ state, moveTile, shuffleGame, onTogglePause }: PuzzleBoardProps) {
  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-full overflow-hidden">
      <div className="h-8">
        <AnimatePresence>
          {state.isVictory && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-emerald-400 font-black uppercase tracking-[0.3em] text-[10px] sm:text-xs flex items-center gap-2 bg-emerald-500/10 px-4 py-2 rounded-full border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
            >
              <Sparkles size={14} /> MISSION ACCOMPLISHED
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="bg-bg-panel p-4 sm:p-8 lg:p-12 rounded-[2rem] sm:rounded-[3rem] border border-border-panel relative overflow-hidden w-full max-w-[480px]">
        {/* Ambient Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 sm:w-80 h-40 sm:h-80 bg-blue-600/10 blur-[40px] sm:blur-[80px] rounded-full pointer-events-none"></div>
        
        <div className="relative z-10 bg-bg-page p-2 sm:p-5 rounded-[1.5rem] sm:rounded-[2.5rem] border-4 border-border-panel shadow-2xl">
          <div className="grid grid-cols-4 gap-2 sm:gap-3 aspect-square w-full relative">
            {state.tiles.map((tile, idx) => (
              <motion.div
                key={tile === null ? 'empty' : `tile-${tile}`}
                layout
                layoutId={tile === null ? 'empty' : `tile-${tile}`}
                transition={{
                  type: 'spring',
                  stiffness: 500,
                  damping: 40,
                  mass: 1,
                }}
                whileHover={tile !== null ? { 
                  scale: 1.02, 
                  filter: 'brightness(1.1)',
                  transition: { duration: 0.2 }
                } : {}}
                whileTap={tile !== null ? { scale: 0.98 } : {}}
                onClick={() => tile !== null && moveTile(idx)}
                className={`
                  rounded-lg sm:rounded-2xl flex items-center justify-center select-none text-xl sm:text-3xl font-black aspect-square transition-colors
                  ${tile === null 
                    ? 'bg-bg-panel border-2 border-dashed border-border-panel' 
                    : 'bg-blue-600 text-white cursor-pointer shadow-[0_4px_0_0_#1d4ed8] active:shadow-none border border-blue-400/20'
                  }
                `}
              >
                {tile}
              </motion.div>
            ))}

            <AnimatePresence>
              {state.isPaused && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 z-50 bg-bg-page/80 backdrop-blur-md rounded-2xl flex flex-col items-center justify-center gap-6"
                >
                  <div className="text-center">
                    <h3 className="text-2xl font-black text-text-primary italic tracking-tight mb-2">SYSTEM PAUSED</h3>
                    <p className="text-[10px] text-text-secondary uppercase tracking-[0.2em] font-bold">Neural Link Suspended</p>
                  </div>
                  <button 
                    onClick={onTogglePause}
                    className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 active:scale-95 transition-all group"
                  >
                    <Play className="fill-current group-hover:scale-110 transition-transform" size={28} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

interface ControlPanelProps {
  onShuffle: () => void;
  onModeChange: (mode: GameMode) => void;
  onUndo: () => void;
  onTogglePause: () => void;
  currentMode: GameMode;
  moves: number;
  seconds: number;
  isStarted: boolean;
  isVictory: boolean;
  isPaused: boolean;
  historyLength: number;
}

export function ControlPanel({ 
  onShuffle, 
  onModeChange, 
  onUndo, 
  onTogglePause,
  currentMode, 
  moves, 
  seconds,
  isStarted,
  isVictory,
  isPaused,
  historyLength
}: ControlPanelProps) {
  const formatTime = (s: number) => {
    const min = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${min}:${sec}`;
  };

  return (
    <div className="w-full sm:w-80 flex flex-col gap-4 sm:gap-6">
      {/* Stats Bento */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 order-first lg:order-none">
        <div className="bg-bg-panel border border-border-panel rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-2 relative z-10">Moves</div>
          <div className="text-2xl sm:text-3xl font-black italic relative z-10">{moves}</div>
        </div>
        <div className="bg-bg-panel border border-border-panel rounded-3xl p-4 sm:p-6 flex flex-col items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[10px] font-black text-text-secondary uppercase tracking-widest leading-none mb-2 relative z-10">Timer</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 italic relative z-10">{formatTime(seconds)}</div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="bg-bg-panel border border-border-panel rounded-3xl p-4 sm:p-5 space-y-4">
        <div className="flex gap-2">
          <button 
            onClick={onShuffle}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-500 py-4 rounded-2xl font-black uppercase tracking-tighter text-sm shadow-[0_4px_0_0_#1d4ed8] active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            <Shuffle size={20} />
            {isStarted ? 'Restart' : 'Initialize'}
          </button>
          
          {isStarted && !isVictory && (
            <button 
              onClick={onTogglePause}
              className={`w-14 sm:w-16 rounded-2xl flex items-center justify-center transition-all border-2 ${isPaused ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-bg-page border-border-panel text-text-primary hover:bg-bg-panel'}`}
            >
              {isPaused ? <Play size={20} className="fill-current" /> : <Pause size={20} className="fill-current" />}
            </button>
          )}
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest block px-1">Operation Mode</label>
          <select 
            value={currentMode}
            onChange={(e) => onModeChange(e.target.value as GameMode)}
            className="w-full bg-bg-page text-text-primary border border-border-panel rounded-xl py-3 px-4 text-[11px] font-bold uppercase tracking-tight focus:ring-blue-500 outline-none cursor-pointer hover:border-blue-500/50 transition-colors"
          >
            <option value="linear_asc">Standard Linear</option>
            <option value="linear_desc">Reverse Linear</option>
            <option value="snake_asc">Snake Pattern</option>
            <option value="spiral_asc">Spiral Pattern</option>
          </select>
        </div>
      </div>

      {/* Secondary Controls */}
      <div className="bg-bg-panel border border-border-panel rounded-3xl p-4 sm:p-5 flex flex-col gap-4">
         <div className="flex gap-2">
          <button 
            onClick={onUndo}
            disabled={historyLength === 0 || isPaused || isVictory}
            className={`flex-1 py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border transition-all flex items-center justify-center gap-2 ${
              historyLength > 0 && !isPaused && !isVictory
                ? 'bg-bg-page text-text-primary border-border-panel hover:bg-neutral-800 shadow-sm' 
                : 'bg-bg-page text-text-secondary border-border-panel opacity-50 cursor-not-allowed shadow-none'
            }`}
          >
            <RotateCcw size={14} />
            Rewind ({historyLength})
          </button>
          <button className="flex-1 bg-bg-page text-text-secondary py-3 rounded-xl font-bold uppercase text-[10px] tracking-widest border border-border-panel opacity-50 cursor-not-allowed">
            Auto
          </button>
        </div>
        <div className="px-1">
          <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-text-secondary opacity-60">
            <span>Neural Stability</span>
            <span>98.4%</span>
          </div>
          <div className="mt-2 h-1 bg-bg-page rounded-full overflow-hidden border border-border-panel">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: '98.4%' }}
              className="h-full bg-emerald-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
