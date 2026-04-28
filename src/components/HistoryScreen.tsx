import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { History, Timer, MoveUp, Calendar } from 'lucide-react';
import { motion } from 'motion/react';

export function HistoryScreen() {
  const { user } = useAuth();
  const [games, setGames] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <h2 className="text-5xl font-black text-white tracking-tighter italic">Mission Logs</h2>
          <p className="text-neutral-500 font-medium">Detailed history of all completed puzzle sessions.</p>
        </div>
      </div>

      <div className="grid gap-4">
        {games.map((game, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            key={game.id} 
            className="bg-neutral-900 border border-neutral-800 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-6 hover:bg-neutral-800/50 transition-colors group"
          >
            <div className="flex items-center gap-6 w-full sm:w-auto">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-black italic text-xl ${
                game.mode === 'classic' ? 'bg-blue-600/10 text-blue-500' : 'bg-emerald-500/10 text-emerald-400'
              } border border-current opacity-30 group-hover:opacity-100 transition-opacity`}>
                {game.mode[0].toUpperCase()}
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">MODE: {game.mode.replace('_', ' ').toUpperCase()}</span>
                <div className="flex items-center gap-2 text-neutral-300 font-bold">
                  <Calendar size={14} className="text-zinc-600" />
                  <span className="text-sm">{formatDate(game.timestamp)}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 w-full sm:w-auto border-t sm:border-t-0 border-neutral-800 pt-4 sm:pt-0 justify-between sm:justify-start">
              <div className="flex flex-col items-end sm:items-center">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Moves</span>
                <div className="flex items-center gap-2">
                  <MoveUp size={16} className="text-blue-500" />
                  <span className="text-xl font-black text-white italic">{game.moves}</span>
                </div>
              </div>
              <div className="flex flex-col items-end sm:items-center">
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-1">Speed</span>
                <div className="flex items-center gap-2">
                  <Timer size={16} className="text-emerald-400" />
                  <span className="text-xl font-black text-white italic">{formatTime(game.seconds)}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}

        {games.length === 0 && (
          <div className="bg-neutral-900/50 border border-dashed border-neutral-800 rounded-[2rem] p-12 text-center">
             <p className="text-neutral-600 font-black uppercase tracking-widest text-xs italic">No mission records found on file</p>
          </div>
        )}
      </div>
    </div>
  );
}
