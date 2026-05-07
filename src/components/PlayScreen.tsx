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
    <div className="flex flex-col items-center gap-8 lg:gap-16 w-full max-w-full">
      <div className="h-10 flex items-center justify-center gap-4">
        <AnimatePresence>
          {state.isVictory && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="px-10 py-3 bg-emerald-500 text-white text-[12px] font-black uppercase tracking-[0.4em] rounded-full shadow-[0_0_60px_rgba(16,185,129,0.5)] border border-white/20 z-20"
            >
              SEQUENCE VERIFIED
            </motion.div>
          )}
          {bestTime > 0 && !state.isVictory && !state.isPaused && (
             <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-6 py-2 bg-neutral-900 border border-white/5 text-text-secondary text-[10px] font-black uppercase tracking-[0.3em] rounded-full flex items-center gap-3 shadow-2xl"
            >
              <Sparkles size={14} className="text-blue-500" />
              RECORD: {Math.floor(bestTime / 60)}:{(bestTime % 60).toString().padStart(2, '0')}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="relative group perspective-[1000px]">
        {/* Extreme Outer Glow */}
        <div className="absolute -inset-40 bg-blue-600/5 blur-[120px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
        
        <div className="relative z-10 bg-neutral-950 p-6 sm:p-12 lg:p-16 rounded-[4rem] lg:rounded-[6rem] border-[16px] sm:border-[32px] border-neutral-900 shadow-[0_80px_120px_-20px_rgba(0,0,0,0.9),inset_0_4px_40px_rgba(255,255,255,0.05)]">
          <div className="grid grid-cols-4 gap-4 sm:gap-6 lg:gap-8 aspect-square w-[260px] sm:w-[520px] lg:w-[680px] relative">
            {state.tiles.map((tile, idx) => (
              <motion.div
                key={tile === null ? 'empty' : `tile-${tile}`}
                layout
                layoutId={tile === null ? 'empty' : `tile-${tile}`}
                onClick={() => moveTile(idx)}
                className={`
                  relative flex items-center justify-center text-2xl sm:text-5xl lg:text-7xl font-black rounded-2xl lg:rounded-[2.5rem] cursor-pointer select-none transition-all
                  ${tile === null 
                    ? 'bg-neutral-900/50 border-4 border-dashed border-neutral-800 shadow-inner' 
                    : 'bg-blue-600 text-white shadow-[0_12px_0_0_#1e40af,0_20px_40px_rgba(0,0,0,0.5)] active:translate-y-2 active:shadow-[0_4px_0_0_#1e40af] overflow-hidden group/tile'
                  }
                `}
                whileHover={tile !== null ? { 
                  scale: 1.02,
                  boxShadow: '0 16px_0_0_#1e40af,0_40px_80px_rgba(0,0,0,0.7)'
                } : {}}
              >
                {tile !== null && (
                  <>
                    <div className="absolute inset-0 bg-gradient-to-br from-white/[0.2] to-transparent pointer-events-none" />
                    <div className="absolute top-2 left-8 right-8 h-1 bg-white/30 rounded-full blur-[1px]" />
                  </>
                )}
                <span className={tile !== null ? 'drop-shadow-[0_6px_12px_rgba(0,0,0,0.4)]' : ''}>{tile}</span>
              </motion.div>
            ))}

            <AnimatePresence>
              {state.isPaused && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute -inset-6 sm:-inset-12 lg:-inset-16 z-50 bg-black/98 backdrop-blur-3xl rounded-[3rem] lg:rounded-[5rem] flex flex-col items-center justify-center gap-12 border border-white/10 shadow-2xl"
                >
                  <div className="text-center">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 bg-blue-600/10 rounded-full flex items-center justify-center mx-auto mb-10 border-2 border-blue-500/20 shadow-[0_0_80px_rgba(37,99,235,0.2)]">
                      <Pause className="text-blue-500 animate-pulse fill-current" size={40} />
                    </div>
                    <h3 className="text-3xl sm:text-5xl font-black text-white italic tracking-tighter mb-4 uppercase">SYSTEM PAUSED</h3>
                    <p className="text-[10px] sm:text-[14px] text-text-secondary uppercase tracking-[0.6em] font-black opacity-40">Tactile Link Suspended</p>
                  </div>
                  <button 
                    onClick={onTogglePause}
                    className="group relative w-24 h-24 sm:w-36 sm:h-36 flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-blue-600 rounded-full blur-3xl opacity-40 group-hover:opacity-70 transition-opacity" />
                    <div className="relative w-full h-full bg-blue-600 rounded-full flex items-center justify-center text-white border-8 border-blue-400/40 shadow-2xl transition-all hover:scale-110 active:scale-90">
                      <Play className="fill-current transform translate-x-3" size={48} />
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
    <div className="w-full xl:w-[480px] flex flex-col gap-8 lg:gap-12">
      {/* Stats Bento */}
      <div className="grid grid-cols-2 gap-6 lg:gap-8">
        <div className="bg-neutral-900 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl transition-transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[12px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 relative z-10">Moves</div>
          <div className="text-4xl lg:text-7xl font-black italic relative z-10 text-white">{moves}</div>
        </div>
        <div className="bg-neutral-900 border border-white/5 rounded-[3rem] p-10 flex flex-col items-center justify-center relative overflow-hidden group shadow-2xl transition-transform hover:-translate-y-1">
          <div className="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="text-[12px] font-black text-neutral-500 uppercase tracking-[0.3em] mb-4 relative z-10">Timer</div>
          <div className="text-4xl lg:text-7xl font-black text-emerald-500 italic relative z-10 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">{formatTime(seconds)}</div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="bg-neutral-900 border border-white/5 rounded-[3rem] p-8 lg:p-12 space-y-10 shadow-2xl">
        <div className="flex gap-6">
          <button 
            onClick={onShuffle}
            className="flex-1 bg-blue-600 text-white hover:bg-blue-500 py-8 rounded-[2rem] font-black uppercase tracking-tighter text-lg lg:text-xl shadow-[0_12px_0_0_#1d4ed8] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center gap-4"
          >
            <Shuffle size={32} />
            {isStarted ? 'Reset Matrix' : 'Initialize'}
          </button>
          
          {isStarted && !isVictory && (
            <button 
              onClick={onTogglePause}
              className={`w-24 lg:w-32 rounded-[2rem] flex items-center justify-center transition-all border-4 ${isPaused ? 'bg-emerald-500/10 border-emerald-500 text-emerald-500' : 'bg-black border-white/10 text-white hover:border-white/30'}`}
            >
              {isPaused ? <Play size={40} className="fill-current" /> : <Pause size={40} className="fill-current" />}
            </button>
          )}
        </div>

        <div className="space-y-6">
          <label className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em] block px-2">Operation Mode Selection</label>
          <div className="relative group">
             <div className="absolute inset-0 bg-blue-600/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <select 
              value={currentMode}
              onChange={(e) => onModeChange(e.target.value as GameMode)}
              className="w-full bg-black text-white border-2 border-white/10 rounded-[1.5rem] py-6 px-10 text-[14px] font-black uppercase tracking-widest focus:ring-4 focus:ring-blue-500 focus:border-transparent outline-none cursor-pointer hover:border-white/20 transition-all relative z-10 appearance-none text-center"
            >
              <option value="linear_asc">Standard Linear</option>
              <option value="linear_desc">Reverse Linear</option>
              <option value="snake_asc">Snake Pattern</option>
              <option value="spiral_asc">Spiral Pattern</option>
            </select>
          </div>
        </div>
      </div>

      {/* Footer Controls */}
      <div className="flex gap-6">
        <button 
          onClick={onUndo}
          disabled={historyLength === 0 || isPaused || isVictory}
          className={`flex-1 py-6 rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.2em] border-2 transition-all flex items-center justify-center gap-4 ${
            historyLength > 0 && !isPaused && !isVictory
              ? 'bg-neutral-800 text-white border-white/10 hover:bg-neutral-700 shadow-xl active:scale-95' 
              : 'bg-black text-neutral-700 border-white/5 opacity-50 cursor-not-allowed shadow-none'
          }`}
        >
          <RotateCcw size={20} />
          Rewind Sequence ({historyLength})
        </button>
        <button className="flex-1 bg-black text-neutral-800 py-6 rounded-[1.5rem] font-black uppercase text-[12px] tracking-[0.2em] border-2 border-white/5 opacity-30 cursor-not-allowed">
          Auto Drive
        </button>
      </div>
    </div>
  );
}
