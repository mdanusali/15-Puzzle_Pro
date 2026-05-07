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
    { label: 'OPERATIONS COMPLETED', value: userStats?.totalGames || 0, sub: 'CERTIFIED', color: 'text-blue-500', borderColor: 'border-blue-500/20' },
    { label: 'CRITICAL RESPONSE TIME', value: formatTime(userStats?.bestTime), icon: Timer, color: 'text-emerald-500', borderColor: 'border-emerald-500/20' },
    { label: 'TOTAL VECTOR DISPLACEMENT', value: userStats?.totalMoves || 0, icon: MoveUp, color: 'text-white', borderColor: 'border-white/10' },
  ];

  const maxActivity = Math.max(...activity, 1);

  return (
    <div className="space-y-8 lg:space-y-12 max-w-7xl mx-auto pb-24 w-full px-4 sm:px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-neutral-900 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between h-44 lg:h-56 shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:scale-[1.02] transition-transform ${i === 2 ? 'sm:col-span-2 lg:col-span-1' : ''}`}>
            <div className={`absolute -right-8 -top-8 w-32 h-32 ${stat.color.replace('text-', 'bg-')} opacity-5 blur-[60px] rounded-full group-hover:opacity-20 transition-opacity`} />
            <div className="space-y-1 relative z-10">
              <div className="w-8 h-1 bg-current opacity-20 rounded-full mb-4" />
              <p className="text-[10px] font-black text-neutral-500 mb-2 uppercase tracking-[0.3em] leading-tight">{stat.label}</p>
            </div>
            <div className="flex items-end justify-between relative z-10">
              <h3 className={`text-5xl lg:text-7xl font-black ${stat.color} tracking-tighter italic drop-shadow-2xl`}>{stat.value}</h3>
              {stat.sub ? (
                <span className="bg-blue-600/10 text-blue-500 text-[10px] px-4 py-1.5 rounded-full border border-blue-500/20 font-black tracking-widest mb-3">{stat.sub}</span>
              ) : stat.icon && (
                <stat.icon className={`${stat.color} mb-3 opacity-50`} size={32} />
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
        <div className="lg:col-span-2 bg-neutral-900 border border-white/5 rounded-[3rem] p-6 sm:p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 lg:mb-16 gap-6">
            <div>
              <h3 className="text-xl lg:text-3xl font-black text-white tracking-tighter italic uppercase">Biometric Activity</h3>
              <p className="text-[10px] lg:text-[11px] font-black text-neutral-500 uppercase tracking-[0.2em] mt-2">Neural Synchronization over 168h period</p>
            </div>
            <div className="px-6 py-2 bg-black rounded-full text-[9px] lg:text-[10px] font-black text-neutral-500 border border-white/5 shadow-inner tracking-[0.2em]">REAL-TIME LOGGING</div>
          </div>
          <div className="h-56 lg:h-80 bg-black/40 rounded-[2.5rem] p-6 lg:p-12 flex items-end justify-between gap-2 lg:gap-10 border border-white/5 shadow-inner overflow-hidden relative">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between py-12 px-8 pointer-events-none opacity-5">
              {[1,2,3,4].map(line => <div key={line} className="w-full h-px bg-white" />)}
            </div>
            
            {activity.map((count, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-6 h-full justify-end group/bar relative">
                <div className="w-full bg-blue-600/5 rounded-2xl relative h-full overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(count / maxActivity) * 100}%` }}
                    transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                    className="absolute bottom-0 w-full bg-blue-600 rounded-t-2xl shadow-[0_0_40px_rgba(37,99,235,0.4)] transition-all group-hover/bar:bg-blue-400 group-hover/bar:shadow-[0_0_60px_rgba(37,99,235,0.6)]"
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-white/20 rounded-full" />
                  </motion.div>
                  {count > 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute -top-1 left-1/2 -translate-x-1/2 text-[10px] font-black text-blue-500 tracking-tighter"
                    >
                      {count.toString().padStart(2, '0')}
                    </motion.div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    <span className="bg-white text-black text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg">DATA_{count}</span>
                  </div>
                </div>
                <span className="text-[11px] font-black text-neutral-600 italic tracking-tighter group-hover/bar:text-white transition-colors uppercase">
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][(new Date().getDay() + i + 1) % 7]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-white/5 rounded-[4rem] p-12 shadow-[0_40px_80px_rgba(0,0,0,0.6)] flex flex-col items-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8">
            <Verified className="text-blue-500/20" size={48} />
          </div>
          
          <div className="w-full">
            <h3 className="text-3xl font-black text-white italic tracking-tighter uppercase mb-1">Rank Engine</h3>
            <p className="text-[11px] font-black text-blue-500/60 uppercase tracking-[0.3em] mb-12">Identification: Level {userStats?.level || 1}</p>
          </div>

          <div className="flex-1 flex flex-col justify-center items-center w-full">
            <div className="relative w-48 h-48 lg:w-60 lg:h-60 mb-12 flex items-center justify-center">
              {/* Outer Pulse */}
              <div className="absolute inset-0 rounded-full border-2 border-blue-500/10 animate-ping" />
              <div className="absolute inset-4 rounded-full border-2 border-blue-500/5" />
              
              <svg className="w-full h-full -rotate-90">
                 <circle cx="50%" cy="50%" r="42%" fill="transparent" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                <circle 
                  cx="50%" cy="50%" r="42%" 
                  fill="transparent" 
                  stroke="#2563eb" 
                  strokeWidth="12" 
                  strokeDasharray="100%" 
                  strokeDashoffset={`${100 - (userStats?.xp % 100 || 0)}%`} 
                  strokeLinecap="round" 
                  className="drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <Award className="text-blue-500 mb-2" size={48} />
                <span className="text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em] mb-1">XP LOG</span>
                <span className="text-3xl font-black text-white italic">{userStats?.xp || 0}</span>
              </div>
            </div>
            
            <div className="w-full bg-black/50 p-8 rounded-[2.5rem] border border-white/5 text-center">
              <p className="text-white font-black text-2xl lg:text-3xl italic tracking-tighter mb-2 uppercase">{getTier(userStats?.xp)}</p>
              <div className="flex items-center justify-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-neutral-500 uppercase tracking-[0.4em] font-black">{100 - (userStats?.xp % 100 || 0)} Units to upgrade</p>
              </div>
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
      collection(db, 'leaderboard', cat, 'entries'),
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
    <div className="max-w-7xl mx-auto space-y-12 lg:space-y-16 pb-24 w-full px-4 lg:px-0 mt-8 sm:mt-0">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-10">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
             <div className="w-3 h-10 bg-blue-600 rounded-full" />
             <h2 className="text-5xl lg:text-8xl font-black text-white tracking-tighter italic uppercase leading-none">Global Ranks</h2>
          </div>
          <p className="text-neutral-500 font-black text-xs lg:text-[13px] uppercase tracking-[0.4em] pl-6">Season Alpha // Neural Proficiency Terminal</p>
        </div>
        <div className="space-y-6 w-full xl:w-auto">
          <div className="flex bg-neutral-900 p-2 rounded-[2rem] border border-white/5 shadow-2xl overflow-x-auto no-scrollbar">
            {['linear_asc', 'linear_desc', 'snake_asc', 'spiral_asc'].map((m) => (
              <button 
                key={m}
                onClick={() => setFilterMode(m)}
                className={`flex-1 sm:flex-none px-8 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all whitespace-nowrap ${filterMode === m ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.4)] scale-105' : 'text-neutral-500 hover:text-neutral-300'}`}
              >
                {m.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div className="flex bg-neutral-950 p-1.5 rounded-2xl border border-white/5 shadow-2xl w-fit ml-auto">
            {(['alltime', 'weekly', 'daily'] as const).map((t) => (
              <button 
                key={t}
                onClick={() => setFilterTime(t)}
                className={`px-6 py-2 rounded-xl font-black text-[9px] uppercase tracking-[0.3em] transition-all ${filterTime === t ? 'bg-blue-600/10 text-blue-500' : 'text-neutral-600 hover:text-neutral-400'}`}
              >
                {t === 'alltime' ? 'All-Time' : t === 'weekly' ? '7D Log' : '24H Log'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-12 lg:gap-16 items-center lg:items-end pt-12 lg:pt-24 relative">
        {/* Glow behind podium */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-64 bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center w-full lg:w-auto order-2 lg:order-none">
          <div className="w-full lg:w-full flex flex-col items-center">
            {topThree[1] && <PodiumAvatar user={topThree[1]} rank={2} medal="🥈" size="small" />}
            <div className="bg-neutral-900 w-full h-24 lg:h-32 rounded-t-[2.5rem] lg:rounded-t-[3rem] border-x border-t border-white/5 flex items-center justify-center text-4xl lg:text-5xl shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent" />
              <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-neutral-800" />
              <span className="opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">🥈</span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-center w-full lg:w-auto order-1 lg:order-none scale-100 lg:scale-110 relative z-10">
          <div className="w-full lg:w-full flex flex-col items-center">
            {topThree[0] && <PodiumAvatar user={topThree[0]} rank={1} medal="🏆" size="large" />}
            <div className="bg-blue-600 w-full h-32 lg:h-56 rounded-t-[3rem] lg:rounded-t-[4rem] border-x-4 border-t-4 border-blue-400/30 flex items-center justify-center text-6xl lg:text-9xl relative overflow-hidden shadow-[0_-20px_60px_rgba(37,99,235,0.3)] group">
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-6 left-6 w-3 h-3 rounded-full bg-white/20" />
              <motion.div 
                animate={{ rotate: [0, 5, -5, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 4, repeat: Infinity }}
                className="drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
              >
                🏆
              </motion.div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center w-full lg:w-auto order-3 lg:order-none">
          <div className="w-full lg:w-full flex flex-col items-center">
            {topThree[2] && <PodiumAvatar user={topThree[2]} rank={3} medal="🥉" size="small" />}
            <div className="bg-neutral-900 w-full h-16 lg:h-20 rounded-t-[2rem] lg:rounded-t-[2.5rem] border-x border-t border-white/5 flex items-center justify-center text-3xl lg:text-4xl shadow-xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent" />
              <div className="absolute bottom-4 right-4 w-2 h-2 rounded-full bg-neutral-800" />
              <span className="opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500">🥉</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-neutral-900 border-4 border-neutral-950 rounded-[4rem] overflow-hidden shadow-[0_60px_100px_rgba(0,0,0,0.8)]">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b-4 border-neutral-950 bg-black/40">
                <th className="px-10 py-8 text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em]">RANKING</th>
                <th className="px-10 py-8 text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em]">OPERATIVE</th>
                <th className="px-10 py-8 text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em]">VECTORS</th>
                <th className="px-10 py-8 text-[11px] font-black text-neutral-500 uppercase tracking-[0.4em] text-right">SYNC TIME</th>
              </tr>
            </thead>
            <tbody className="divide-y-2 divide-neutral-950">
              {rest.map((player, i) => (
                <tr key={player.userId + i} className={`group hover:bg-blue-600/[0.03] transition-all duration-500 ${player.userId === user?.uid ? 'bg-blue-600/5' : ''}`}>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-6">
                      <span className={`font-black text-3xl lg:text-5xl italic ${player.userId === user?.uid ? 'text-blue-500' : 'text-neutral-800'} group-hover:text-neutral-500 transition-colors leading-none tracking-tighter`}>{(i + 4).toString().padStart(2, '0')}</span>
                    </div>
                  </td>
                  <td className="px-10 py-10">
                    <div className="flex items-center gap-6">
                      <div className="relative">
                        <img src={player.photoURL} alt="" className={`w-12 h-12 lg:w-16 lg:h-16 rounded-[1.5rem] bg-black border-2 ${player.userId === user?.uid ? 'border-blue-500' : 'border-white/5'} object-cover group-hover:border-blue-500/30 transition-colors`} />
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 rounded-full border-4 border-neutral-900" />
                        {player.userId === user?.uid && (
                          <div className="absolute -top-2 -left-2 bg-blue-600 text-[8px] font-black px-1.5 py-0.5 rounded-md text-white uppercase tracking-tighter z-20">You</div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <span className={`font-black text-xl lg:text-2xl ${player.userId === user?.uid ? 'text-blue-500' : 'text-white'} tracking-tighter uppercase italic`}>{player.displayName}</span>
                        <span className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mt-1">Verified Node</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-10 font-black text-2xl lg:text-3xl text-neutral-400 italic tracking-tighter leading-none">{player.moves}</td>
                  <td className="px-10 py-10 text-right">
                    <div className="flex flex-col items-end">
                      <span className={`font-black text-3xl lg:text-5xl ${player.userId === user?.uid ? 'text-white' : 'text-blue-500'} italic tracking-tighter leading-none drop-shadow-lg group-hover:scale-105 transition-transform`}>{formatTime(player.seconds)}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {rest.length === 0 && !loading && (
                <tr>
                  <td colSpan={4} className="px-10 py-24 text-center">
                     <p className="text-neutral-700 font-black uppercase tracking-[0.6em] text-sm italic opacity-50">NO SIGNAL DETECTED IN THIS DOMAIN</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function PodiumAvatar({ user, rank, medal, size }: { user: any, rank: number, medal: string, size: 'small' | 'large' }) {
  const isLarge = size === 'large';
  return (
    <div className="flex flex-col items-center mb-6 lg:mb-10 px-4 w-full">
      <div className={`relative group ${isLarge ? 'p-2 sm:p-3 bg-neutral-950 border-4 lg:border-8 border-blue-600 shadow-[0_0_80px_rgba(37,99,235,0.3)]' : 'p-1.5 sm:p-2 bg-neutral-950 border-4 border-neutral-800 shadow-2xl'} rounded-[2.5rem] lg:rounded-[4rem] mb-6 lg:mb-10 transition-all duration-700 hover:-translate-y-4 hover:rotate-2`}>
        <div className="absolute inset-0 bg-blue-600/5 rounded-[inherit] opacity-0 group-hover:opacity-100 transition-opacity blur-xl" />
        <img 
          src={user.photoURL} 
          alt={user.displayName} 
          className={`${isLarge ? 'w-28 h-28 sm:w-56 sm:h-56 lg:w-72 lg:h-72' : 'w-20 h-20 sm:w-40 sm:h-40 lg:w-48 lg:h-48'} object-cover rounded-[2rem] lg:rounded-[3.2rem] relative z-10`} 
        />
        <div className={`absolute -top-3 -right-3 lg:-top-6 lg:-right-6 ${isLarge ? 'w-12 h-12 lg:w-20 lg:h-20 bg-blue-600' : 'w-10 h-10 lg:w-16 lg:h-16 bg-neutral-800'} text-white font-black rounded-full flex items-center justify-center border-4 lg:border-8 border-neutral-950 shadow-2xl italic text-xs lg:text-3xl z-20`}>
          {rank}
        </div>
      </div>
      <div className="text-center w-full px-2">
        <span className={`${isLarge ? 'text-2xl sm:text-4xl lg:text-5xl' : 'text-lg sm:text-2xl lg:text-3xl'} font-black text-white italic tracking-tighter mb-1 truncate block uppercase`}>{user.displayName}</span>
        <div className="flex items-center justify-center gap-3 mt-2">
           <div className={`w-1.5 h-1.5 rounded-full ${isLarge ? 'bg-blue-500 animate-pulse' : 'bg-neutral-600'}`} />
           <span className={`${isLarge ? 'text-xl sm:text-3xl lg:text-4xl text-blue-500 font-black italic' : 'text-base sm:text-xl lg:text-2xl text-neutral-500 font-black italic'}`}>{user.seconds} SEC</span>
        </div>
      </div>
    </div>
  );
}
