import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { GameMode } from '../types';
import { History, Timer, MoveUp, Calendar, Share2, Play } from 'lucide-react';
import { motion } from 'motion/react';

interface HistoryScreenProps {
  onReplay?: (mode: GameMode) => void;
}

export function HistoryScreen({ onReplay }: HistoryScreenProps) {
  const { user } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const handleShare = async (game: any) => {
    const text = `I completed the 15 Puzzle in ${game.mode} mode! Moves: ${game.moves}, Time: ${game.seconds}s. Can you beat my record?`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: '15 Puzzle Mission Result',
          text,
          url: window.location.origin
        });
      } catch (err) {
        console.error("Share failed", err);
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("MISSION TRANSCRIPT COPIED TO CLIPBOARD.");
    }
  };

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const q = query(
      collection(db, 'games', user.uid, 'history'),
      orderBy('timestamp', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setGames(data);
      setLoading(false);
    }, (error) => {
      console.error("History subscribe error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const formatDate = (ts: any) => {
    if (!ts) return 'Unknown';
    const date = ts.toDate();
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-20 h-20 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mb-6">
          <History className="text-zinc-600" size={32} />
        </div>
        <h3 className="text-xl font-black text-white italic mb-2">ACCESS RESTRICTED</h3>
        <p className="text-neutral-500 max-w-xs">Please log in to synchronize and view your historical mission records.</p>
      </div>
    );
  }

  if (loading) {
    return <div className="flex items-center justify-center h-64 text-neutral-500 font-black uppercase tracking-widest italic animate-pulse">Retrieving Logs...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 lg:space-y-12 pb-24 px-4 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-3 h-10 bg-emerald-500 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)]" />
            <h2 className="text-4xl lg:text-7xl font-black text-white tracking-tighter italic uppercase">Mission Logs</h2>
          </div>
          <p className="text-neutral-500 font-black text-[10px] sm:text-xs uppercase tracking-[0.4em] pl-6 opacity-60">Chronological Archive // Neural Pattern Database</p>
        </div>
      </div>

      <div className="grid gap-6 lg:gap-8">
        {games.map((game, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, ease: "circOut" }}
            key={game.id} 
            className="bg-neutral-900 border border-white/5 p-6 sm:p-8 lg:p-12 rounded-[2.5rem] lg:rounded-[4rem] flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-10 hover:bg-neutral-800 transition-all group relative overflow-hidden shadow-2xl"
          >
            <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/[0.02] transition-colors" />
            
            <div className="flex items-center gap-8 w-full lg:w-auto relative z-10">
              <div className={`w-20 h-20 lg:w-24 lg:h-24 rounded-[1.5rem] lg:rounded-[2rem] flex items-center justify-center font-black italic text-2xl lg:text-3xl ${
                game.mode === 'classic' ? 'bg-blue-600 text-white shadow-[0_10px_30px_rgba(37,99,235,0.3)]' : 'bg-emerald-500 text-white shadow-[0_10px_30px_rgba(16,185,129,0.3)]'
              } transition-transform group-hover:scale-110 shadow-lg relative`}>
                <div className="absolute inset-0 bg-white/20 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity" />
                {game.mode[0].toUpperCase()}
              </div>
              
              <div className="text-left space-y-1">
                <span className={`text-[11px] font-black uppercase tracking-[0.3em] ${game.mode === 'classic' ? 'text-blue-500' : 'text-emerald-500'}`}>Protocol: {game.mode.replace('_', ' ').toUpperCase()}</span>
                <div className="flex items-center gap-3 text-white font-black italic text-xl lg:text-2xl tracking-tighter">
                  <Calendar size={20} className="text-neutral-600" />
                  <span>{formatDate(game.timestamp)}</span>
                </div>
                <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest opacity-40">System Node ID: {game.id.slice(0, 8)}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 lg:gap-8 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-8 lg:pt-0 justify-between lg:justify-start relative z-10">
              <div className="flex flex-col items-center group/stat">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-4 group-hover/stat:text-blue-500 transition-colors">Moves</span>
                <div className="flex items-center gap-4">
                  <MoveUp size={24} className="text-blue-500 opacity-50" />
                  <span className="text-4xl lg:text-6xl font-black text-white italic tracking-tighter tabular-nums">{game.moves}</span>
                </div>
              </div>
              
              <div className="flex flex-col items-center group/stat">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em] mb-4 group-hover/stat:text-emerald-500 transition-colors">Latency</span>
                <div className="flex items-center gap-4">
                  <Timer size={24} className="text-emerald-500 opacity-50" />
                  <span className="text-4xl lg:text-6xl font-black text-emerald-500 italic tracking-tighter tabular-nums">{formatTime(game.seconds)}</span>
                </div>
              </div>

               <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleShare(game)}
                  className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors text-neutral-400 hover:text-blue-500"
                  title="Share Results"
                >
                   <Share2 size={24} />
                </button>
                {onReplay && (
                  <button 
                    onClick={() => onReplay(game.mode)}
                    className="p-4 bg-blue-600/10 rounded-full hover:bg-blue-600/20 transition-colors text-blue-500"
                    title="Initialize Re-Entry"
                  >
                     <Play size={24} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {games.length === 0 && !loading && (
          <div className="bg-neutral-900 border-4 border-dashed border-white/5 rounded-[4rem] p-24 text-center">
             <div className="w-24 h-24 bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-8 opacity-20">
                <History size={48} className="text-neutral-400" />
             </div>
             <p className="text-neutral-600 font-black uppercase tracking-[0.6em] text-sm italic">UNRECOGNIZED CLEARANCE // ZERO LOGS DETECTED</p>
          </div>
        )}
      </div>
    </div>
  );
}
