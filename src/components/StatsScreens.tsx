import React from 'react';
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

export function StatsScreen() {
  const stats = [
    { label: 'WIN RATE', value: '84.2%', sub: 'PRO', color: 'text-blue-500', borderColor: 'border-blue-500/20' },
    { label: 'FASTEST TIME', value: '0:42.12', icon: Timer, color: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'FEWEST MOVES', value: '56', icon: MoveUp, color: 'text-white', borderColor: 'border-white/10' },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto pb-12 w-full">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-neutral-900 border border-neutral-800 rounded-[2rem] p-6 sm:p-8 flex flex-col justify-between h-40 sm:h-48 shadow-2xl relative overflow-hidden group">
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-current opacity-5 blur-[40px] rounded-full group-hover:opacity-10 transition-opacity" />
            <p className="text-[10px] font-black text-neutral-500 mb-2 uppercase tracking-[0.2em]">{stat.label}</p>
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
        <div className="lg:col-span-2 bg-neutral-900 border border-neutral-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-10 gap-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight italic">Activity</h3>
              <p className="text-sm font-medium text-neutral-500">Last 7 days performance metrics</p>
            </div>
            <div className="px-5 py-2 bg-neutral-800 rounded-full text-[10px] font-bold text-neutral-400 border border-neutral-700">WEEKLY VIEW</div>
          </div>
          <div className="h-48 sm:h-64 bg-neutral-950 rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex items-end justify-between gap-2 sm:gap-6 border border-neutral-800 shadow-inner overflow-hidden">
            {[60, 85, 45, 95, 30, 70, 55].map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 sm:gap-4 h-full justify-end">
                <div className="w-full bg-blue-600/10 rounded-lg sm:rounded-xl relative h-24 sm:h-32 overflow-hidden border border-white/5">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ duration: 1, delay: i * 0.1 }}
                    className="absolute bottom-0 w-full bg-blue-600 rounded-t-lg sm:rounded-t-xl shadow-[0_0_20px_rgba(37,99,235,0.3)]"
                  />
                </div>
                <span className="text-[10px] sm:text-[10px] font-black text-neutral-600 italic">
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl flex flex-col">
          <h3 className="text-xl sm:text-2xl font-black text-white italic mb-2">Grandmaster</h3>
          <p className="text-sm font-medium text-neutral-500 mb-6 sm:mb-10 tracking-tight">Level 42 • Tier 1</p>
          <div className="flex-1 flex flex-col justify-center items-center py-4">
            <div className="relative w-32 h-32 sm:w-40 sm:h-40 mb-6 sm:mb-8 p-1 bg-neutral-800 rounded-full border border-neutral-700">
              <svg className="w-full h-full -rotate-90">
                <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#0a0a0a" strokeWidth="8" />
                <circle cx="50%" cy="50%" r="45%" fill="transparent" stroke="#2563eb" strokeWidth="8" strokeDasharray="100%" strokeDashoffset="15%" strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Award className="text-blue-500" size={32} />
              </div>
            </div>
            <div className="text-center">
              <p className="text-white font-black text-lg sm:text-xl italic mb-1">88% Progress</p>
              <p className="text-[9px] sm:text-[10px] text-blue-500 uppercase tracking-[0.2em] font-black">550 XP to Elite Level</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function LeaderboardScreen() {
  const users = [
    { rank: 1, name: 'SARA_X', time: '00:38', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop' },
    { rank: 2, name: 'ALEX_M', time: '00:42', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop' },
    { rank: 3, name: 'MARCUS', time: '00:45', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop' },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12 pb-12 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 sm:gap-0">
        <div className="space-y-2">
          <h2 className="text-4xl sm:text-6xl font-black text-white tracking-tighter italic">Global Ranks</h2>
          <p className="text-neutral-500 font-medium text-sm sm:text-base">Competitive standings for current season.</p>
        </div>
        <div className="flex bg-neutral-900 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl border border-neutral-800 shadow-xl w-full sm:w-auto">
          <button className="flex-1 sm:flex-none px-6 sm:px-8 py-2 sm:py-2.5 bg-blue-600 text-white rounded-lg sm:rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-lg border border-blue-400/20">Global</button>
          <button className="flex-1 sm:flex-none px-6 sm:px-8 py-2 sm:py-2.5 text-neutral-500 hover:text-neutral-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest">Friends</button>
        </div>
      </div>

      <div className="flex flex-col sm:grid sm:grid-cols-3 gap-8 items-end pt-4 sm:pt-12">
        {/* Mobile Podium is different, we'll just stack or resize */}
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-2 sm:order-none">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            <PodiumAvatar user={users[1]} rank={2} medal="🥈" size="small" />
            <div className="bg-neutral-900 w-full h-12 sm:h-24 rounded-t-xl sm:rounded-t-[2rem] border-x border-t border-neutral-800 flex items-center justify-center text-xl sm:text-3xl shadow-2xl">🥈</div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-1 sm:order-none scale-105 sm:scale-100">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            <PodiumAvatar user={users[0]} rank={1} medal="🏆" size="large" />
            <div className="bg-blue-600/10 w-full h-16 sm:h-40 rounded-t-2xl sm:rounded-t-[2.5rem] border-x border-t border-blue-600/20 flex items-center justify-center text-4xl sm:text-7xl relative overflow-hidden shadow-[0_-10px_30px_rgba(37,99,235,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent" />
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 4, repeat: Infinity }}>🏆</motion.div>
            </div>
          </div>
        </div>
        <div className="flex flex-row sm:flex-col items-center w-full gap-4 sm:gap-0 order-3 sm:order-none">
          <div className="flex-1 sm:w-full flex flex-col items-center">
            <PodiumAvatar user={users[2]} rank={3} medal="🥉" size="small" />
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
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest">Avg Moves</th>
              <th className="px-6 sm:px-8 py-4 sm:py-6 text-[9px] sm:text-[10px] font-black text-neutral-500 uppercase tracking-widest text-right">Best Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            {[...Array(8)].map((_, i) => (
              <tr key={i} className="group hover:bg-white/5 transition-colors">
                <td className="px-6 sm:px-8 py-4 sm:py-6 font-black text-lg sm:text-xl italic text-neutral-500 group-hover:text-white transition-colors">{i + 4}</td>
                <td className="px-6 sm:px-8 py-4 sm:py-6">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-neutral-800 border border-neutral-700" />
                    <span className="font-bold text-sm sm:text-base text-white tracking-tight">PLAYER_{1024 + i}</span>
                  </div>
                </td>
                <td className="px-6 sm:px-8 py-4 sm:py-6 font-medium text-neutral-400 text-sm sm:text-base">{(62 + i * 1.5).toFixed(1)}</td>
                <td className="px-6 sm:px-8 py-4 sm:py-6 text-right font-black text-blue-500 italic text-sm sm:text-base">00:{(48 + i).toString().padStart(2, '0')}.4</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PodiumAvatar({ user, rank, medal, size }: { user: any, rank: number, medal: string, size: 'small' | 'large' }) {
  const isLarge = size === 'large';
  return (
    <div className="flex flex-col items-center mb-4 sm:mb-6">
      <div className={`relative group ${isLarge ? 'p-1 sm:p-1.5 bg-neutral-800 border-2 sm:border-4 border-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.2)]' : 'p-0.5 sm:p-1 bg-neutral-800 border-2 border-neutral-700'} rounded-2xl sm:rounded-[2rem] mb-2 sm:mb-4 transition-all duration-300 hover:-translate-y-1`}>
        <img 
          src={user.avatar} 
          alt={user.name} 
          className={`${isLarge ? 'w-24 h-24 sm:w-48 sm:h-48' : 'w-16 h-16 sm:w-32 sm:h-32'} object-cover rounded-xl sm:rounded-[1.75rem]`} 
        />
        <div className={`absolute -top-2 -right-2 sm:-top-4 sm:-right-4 ${isLarge ? 'w-8 h-8 sm:w-14 sm:h-14 bg-blue-600' : 'w-6 h-6 sm:w-10 sm:h-10 bg-neutral-600'} text-white font-black rounded-full flex items-center justify-center border-2 sm:border-4 border-neutral-950 shadow-lg italic text-[9px] sm:text-lg`}>
          {rank}
        </div>
      </div>
      <span className={`${isLarge ? 'text-xl sm:text-3xl' : 'text-sm sm:text-xl'} font-black text-white italic tracking-tighter mb-0.5 sm:mb-1`}>{user.name}</span>
      <span className={`${isLarge ? 'text-lg sm:text-2xl text-blue-500 font-black italic' : 'text-xs sm:text-lg text-emerald-400 font-bold italic'}`}>{user.time}</span>
    </div>
  );
}
