import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shuffle, Undo2, Lightbulb, Sparkles, Play, Pause, RotateCcw } from 'lucide-react';
import { GameState, GameMode } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface PuzzleBoardProps {
  state: GameState;
  moveTile: (idx: number) => void;
  shuffleGame: () => void;
  onTogglePause: () => void;
}

export function PuzzleBoard({ state, moveTile, shuffleGame, onTogglePause }: PuzzleBoardProps) {
  const { userStats } = useAuth();
  const bestTime = userStats?.bestTime || 0;

  return (
    <div className="flex flex-col items-center gap-4 sm:gap-8 w-full max-w-full overflow-hidden">
      <div className="h-10 flex items-center gap-4">
        <AnimatePresence>
          {state.isVictory && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-6 py-2 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.3em] rounded-full shadow-[0_0_30px_rgba(16,185,129,0.5)] border border-white/20"
            >
              Sequence Verified
            </motion.div>
          )}
          {bestTime > 0 && !state.isVictory && !state.isPaused && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 py-1.5 bg-neutral-900/50 border border-white/10 text-text-secondary text-[9px] font-bold uppercase tracking-[0.2em] rounded-full flex items-center gap-2 backdrop-blur-sm"
            >
              <Sparkles size={12} className="text-blue-500" />
              Target Protocol: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, '0')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group p-2 xl:p-8">
        <div className="absolute inset-0 bg-blue-600/5 rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
        
        <div className="relative z-10 bg-bg-page p-3 sm:p-6 rounded-[2rem] sm:rounded-[3rem] border-4 border-border-panel shadow-[0_40px_80px_-15px_rgba(0,0,0,0.7)] flex flex-col items-center">
          <div className="grid grid-cols-4 gap-3 sm:gap-4 aspect-square w-[280px] sm:w-[480px] lg:w-[560px] relative">
            {state.tiles.map((tile, idx) => (
              <motion.div
                key={tile === null ? 'empty' : `tile-${tile}`}
                layout
                layoutId={tile === null ? 'empty' : `tile-${tile}`}
                onClick={() => moveTile(idx)}
                className={`
                  relative flex items-center justify-center text-xl sm:text-4xl lg:text-5xl font-black italic rounded-xl sm:rounded-2xl lg:rounded-3xl cursor-pointer select-none transition-all
                  ${tile === null 
                    ? 'bg-neutral-950/50 border-2 border-dashed border-neutral-800' 
                    : 'bg-neutral-900 border border-neutral-800 text-white shadow-[0_8px_16px_rgba(0,0,0,0.4)] active:scale-95 active:shadow-inner overflow-hidden group/tile'
                  }
                `}
                whileHover={tile !== null ? { 
                  y: -6,
                  backgroundColor: 'rgb(24, 24, 24)',
                  borderColor: 'rgba(37, 99, 235, 0.4)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
                } : {}}
              >
                {tile !== null && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] to-transparent pointer-events-none" />
                    <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-blue-600 opacity-0 group-hover/tile:opacity-10 blur-2xl transition-opacity" />
                    <div className="absolute top-2 left-2 w-1 h-4 bg-blue-500/20 rounded-full" />
                  </>
                )}
                <span className={tile !== null ? 'drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]' : ''}>{tile}</span>
              </motion.div>
            ))}

            <AnimatePresence>
              {state.isPaused && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-[ -12px] z-50 bg-bg-page/95 backdrop-blur-2xl rounded-[2.5rem] flex flex-col items-center justify-center gap-8 border border-white/10 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-blue-500/20 shadow-[0_0_40px_rgba(37,99,235,0.1)]">
                      <Pause className="text-blue-500 animate-pulse fill-current" size={40} />
                    </div>
                    <h3 className="text-3xl font-black text-white italic tracking-tighter mb-3">SYSTEM PAUSED</h3>
                    <p className="text-[10px] text-text-secondary uppercase tracking-[0.4em] font-bold opacity-60">Neural Link Suspend Protocol // v2.4</p>
                  </div>
                  <button 
                    onClick={onTogglePause}
                    className="group relative w-24 h-24 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-blue-600 rounded-full blur-xl opacity-40 group-hover:opacity-60 transition-opacity" />
                    <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white border-4 border-blue-400/30 shadow-2xl transition-all hover:scale-110 active:scale-90">
                      <Play className="fill-current transform translate-x-1" size={36} />
                    </div>
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
