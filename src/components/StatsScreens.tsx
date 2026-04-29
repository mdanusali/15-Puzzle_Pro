import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { 
  Trophy, 
  CheckCircle2, 
  Timer, 
  MoveUp, 
  Zap, 
  Gamepad2, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Verified,
  Award,
  ChevronDown,
  History,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Minus as MinusIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/firebase';
import { collection, query, orderBy, limit, onSnapshot, where, Timestamp } from 'firebase/firestore';

const getTier = (xp: number = 0) => {
  if (xp < 500) return 'Initiate';
  if (xp < 1500) return 'Novice';
  if (xp < 3000) return 'Competitor';
  if (xp < 6000) return 'Elite';
  if (xp < 10000) return 'Master';
  return 'Grandmaster';
};

export function StatsScreen() {
  const { user, userStats } = useAuth();
  const [activity, setActivity] = useState<number[]>(Array(7).fill(0));
  
  useEffect(() => {
    if (!user) return;

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const q = query(
      collection(db, `games/${user.uid}/history`),
      where('timestamp', '>=', Timestamp.fromDate(sevenDaysAgo)),
      orderBy('timestamp', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const counts = Array(7).fill(0);
      const now = new Date();
      now.setHours(23, 59, 59, 999);

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        const date = data.timestamp?.toDate();
        if (date) {
          const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
          if (diff >= 0 && diff < 7) {
            counts[6 - diff]++;
          }
        }
      });
      setActivity(counts);
    });

    return unsubscribe;
  }, [user]);
  
  const formatTime = (s: number) => {
    if (!s) return '0:00';
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const stats = [
    { label: 'GAMES WON', value: userStats?.totalGames || 0, sub: 'PRO', color: 'text-blue-500', borderColor: 'border-blue-500/20' },
    { label: 'BEST TIME', value: formatTime(userStats?.bestTime), icon: Timer, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'TOTAL MOVES', value: userStats?.totalMoves || 0, icon: MoveUp, color: 'text-white', borderColor: 'border-white/10' },
  ];

  const maxActivity = Math.max(...activity, 1);

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-bg-panel border border-border-panel rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between h-40 sm:h-48 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 blur-[40px] rounded-full group-hover:opacity-10 transition-opacity" />
            <p className="text-[10px] font-black text-text-secondary mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className={`text-4xl sm:text-5xl font-black ${stat.color} tracking-tighter italic`}>{stat.value}</h3>
              {stat.sub ? (
                <span className={`${stat.color}/10 ${stat.color} text-[10px] px-3 py-1 rounded-full border border-current font-bold mb-2`}>{stat.sub}</span>
              ) : stat.icon && (
                <stat.icon className={`${stat.color} mb-2`} size={28} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-bg-panel border border-border-panel rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-text-primary tracking-tight italic">Activity</h3>
              <p className="text-sm font-medium text-text-secondary">Games completed over last 7 days</p>
            </div>
            <div className="px-5 py-2 bg-bg-page rounded-full text-[10px] font-bold text-text-secondary border border-border-panel">WEEKLY VIEW</div>
          </div>
          <div className="h-48 sm:h-64 bg-bg-page rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-end justify-between gap-2 sm:gap-6 border border-border-panel shadow-inner overflow-hidden">
            {activity.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 sm:gap-4 h-full justify-end">
                <div className="w-full bg-blue-600/10 rounded-lg sm:rounded-xl relative h-24 sm:h-32 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxActivity) * 100}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg sm:rounded-t-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  />
                  {count > 0 && (
                    <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[8px] font-black text-blue-500">{count}</div>
                  )}
                </div>
                <span className="text-[10px] sm:text-[10px] font-black text-text-secondary italic">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][(new Date().getDay() + i + 1) % 7]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-bg-panel border border-border-panel rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col">
          <h3 className="text-xl sm:text-2xl font-black text-text-primary italic mb-2">Level {userStats?.level || 1}</h3>
          <p className="text-sm font-medium text-text-secondary mb-6 sm:mb-10 tracking-tight">{userStats?.xp || 0} XP • {getTier(userStats?.xp)}</p>
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8 p-1 bg-bg-page rounded-full border border-border-panel">
              <svg className="w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="var(--color-bg-page)" strokeWidth="8" />
                <circle 
                  cx="50%" cy="50%" r="45%" 
                  fill="transparent" 
                  stroke="#2563eb" 
                  strokeWidth="8" 
                  strokeDasharray="100%" 
                  strokeDashoffset={`${100 - (userStats?.xp % 100 || 0)}%`} 
                  strokeLinecap="round" 
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-text-primary font-black text-lg sm:text-xl italic mb-1">{userStats?.xp % 100 || 0}% Progress</p>
              <p className="text-[9px] sm:text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black">{100 - (userStats?.xp % 100 || 0)} XP to Next Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardScreen() {
  const [leaders, setLeaders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterMode, setFilterMode] = useState<string>('linear_asc');
  const [filterTime, setFilterTime] = useState<'alltime' | 'daily' | 'weekly'>('alltime');

  useEffect(() => {
    let cat = `alltime_${filterMode}`;
    const now = new Date();

    if (filterTime === 'daily') {
      const dateKey = now.toISOString().split('T')[0];
      cat = `daily_${dateKey}_${filterMode}`;
    } else if (filterTime === 'weekly') {
      const d = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
      const dayNum = d.getUTCDay() || 7;
      d.setUTCDate(d.getUTCDate() + 4 - dayNum);
      const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
      const weekNo = Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
      const weekKey = `${d.getUTCFullYear()}-W${weekNo.toString().padStart(2, '0')}`;
      cat = `weekly_${weekKey}_${filterMode}`;
    }

    setLoading(true);
    const q = query(
      collection(db, `leaderboard/${cat}/entries`),
      orderBy('seconds', 'asc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setLeaders(data);
      setLoading(false);
    }, (error) => {
      console.error("Leaderboard subscribe error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [filterMode, filterTime]);

  const formatTime = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const topThree = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  if (loading) {
     return <div className="flex items-center justify-center h-64 text-neutral-500 font-black uppercase tracking-widest italic animate-pulse">Scanning Neural Network...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 pb-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter italic">Global Ranks</h2>
          <p className="text-neutral-500 font-medium text-sm sm:text-base">Competitive standings for current season.</p>
        </div>
        <div className="space-y-4 w-full sm:w-auto">
          <div className="flex bg-neutral-900 p-1.5 rounded-xl border border-neutral-800 shadow-xl overflow-x-auto">
            {['linear_asc', 'linear_desc', 'snake_asc', 'spiral_asc'].map((m) => (
              <button 
                key={m}
                onClick={() => setFilterMode(m)}
                className={`flex-1 sm:flex-none px-4 py-2 rounded-lg font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap ${filterMode === m ? 'bg-blue-600 text-white shadow-lg' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex bg-neutral-900 p-1 rounded-xl border border-neutral-800 shadow-xl w-fit ml-auto">
            {(['alltime', 'weekly', 'daily'] as const).map((t) => (
              <button 
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-4 py-1.5 rounded-lg font-bold text-[9px] uppercase tracking-widest transition-colors ${filterTime === t ? 'bg-neutral-800 text-blue-500' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                {t === 'alltime' ? 'All-Time' : t === 'weekly' ? 'This Week' : 'Today'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-8 items-end pt-4 sm:pt-12">
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-2 sm:order-none">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            {topThree[1] && <PodiumAvatar user={topThree[1]} rank={2} medal="🥈" size="small" />}
            <div className="bg-neutral-900 w-full h-12 sm:h-24 rounded-t-xl sm:rounded-t-[2rem] border-x border-t border-neutral-800 flex items-center justify-center text-xl sm:text-3xl shadow-2xl">🥈</div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-1 sm:order-none scale-105 sm:scale-100">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            {topThree[0] && <PodiumAvatar user={topThree[0]} rank={1} medal="🏆" size="large" />}
            <div className="bg-blue-600/10 w-full h-16 sm:h-40 rounded-t-2xl sm:rounded-t-[2.5rem] border-x border-t border-blue-600/20 flex items-center justify-center text-4xl sm:text-7xl relative overflow-hidden shadow-[0_-10px_30px_rgba(37,99,235,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>🏆</motion.div>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-3 sm:order-none">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            {topThree[2] && <PodiumAvatar user={topThree[2]} rank={3} medal="🥉" size="small" />}
            <div className="bg-neutral-900 w-full h-8 sm:h-16 rounded-t-xl sm:rounded-t-[2rem] border-x border-t border-neutral-800 flex items-center justify-center text-lg sm:text-3xl shadow-xl">🥉</div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden shadow-2xl overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-neutral-800 bg-neutral-950/50">
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest">Rank</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest">User</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest">Moves</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {rest.map((player, i) => (
              <tr key={player.userId} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 sm:px-8 py-4 sm:py-6 font-black text-lg sm:text-xl italic text-neutral-500 group-hover:text-white transition-colors">{i + 4}</td>
                <td className="px-6 sm:px-8 py-4 sm:py-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <img src={player.photoURL} alt="" className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800 border border-neutral-700 object-cover" />
                    <span className="font-bold text-sm sm:text-base text-white tracking-tight">{player.displayName}</span>
                  </div>
                </td>
                <td className="px-6 sm:px-8 py-4 sm:py-6 font-medium text-neutral-400 text-sm sm:text-base">{player.moves}</td>
                <td className="px-6 sm:px-8 py-4 sm:py-6 text-right font-black text-blue-500 italic text-sm sm:text-base">{formatTime(player.seconds)}</td>
              </tr>
            ))}
            {rest.length === 0 && (
              <tr>
                <td colSpan={4} className="px-8 py-12 text-center text-neutral-600 font-bold uppercase tracking-widest text-xs">No entries found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumAvatar({ user, rank, medal, size }: { user: any, rank: number, medal: string, size: 'small' | 'large' }) {
  const isLarge = size === 'large';
  return (
    <div className="flex flex-col items-center mb-4 sm:mb-6 px-2">
      <div className={`relative group ${isLarge ? 'p-1 sm:p-1.5 bg-neutral-800 border-2 sm:border-4 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'p-0.5 sm:p-1 bg-neutral-800 border-2 border-neutral-700'} rounded-2xl sm:rounded-[2rem] mb-2 sm:mb-4 transition-all duration-300 hover:-translate-y-1`}>
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className={`${isLarge ? 'w-24 h-24 sm:w-48 sm:h-48' : 'w-16 h-16 sm:w-32 sm:h-32'} object-cover rounded-xl sm:rounded-[1.75rem]`} 
        />
        <div className={`absolute -top-2 -right-2 sm:-top-4 sm:-right-4 ${isLarge ? 'w-8 h-8 sm:w-14 sm:h-14 bg-blue-600' : 'w-6 h-6 sm:w-10 sm:h-10 bg-neutral-600'} text-white font-black rounded-full flex items-center justify-center border-2 sm:border-4 border-neutral-950 shadow-lg italic text-[9px] sm:text-lg`}>
          {rank}
        </div>
      </div>
      <span className={`${isLarge ? 'text-xl sm:text-3xl' : 'text-sm sm:text-xl'} font-black text-white italic tracking-tighter mb-0.5 sm:mb-1 truncate max-w-full`}>{user.displayName}</span>
      <span className={`${isLarge ? 'text-lg sm:text-2xl text-blue-500 font-black italic' : 'text-xs sm:text-lg text-emerald-400 font-bold italic'}`}>{user.seconds}s</span>
    </div>
  );
}
