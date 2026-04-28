import React from 'react';
import { 
  Grid2X2, 
  BarChart3, 
  Trophy, 
  Settings, 
  History, 
  RefreshCw, 
  HelpCircle,
  LogOut,
  Edit2,
  Verified,
  Shuffle,
  Undo2,
  Lightbulb,
  CheckCircle2,
  Timer,
  Award,
  Gamepad2,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Menu,
  MoreVertical,
  Plus,
  Grid3X3
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
}

export function Sidebar({ currentView, setView }: SidebarProps) {
  const menuItems = [
    { id: 'play', label: 'Play', icon: Grid2X2 },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'history', label: 'History', icon: History },
  ];

  return (
    <aside className="bg-neutral-950 h-screen w-64 fixed left-0 top-0 border-r border-white/5 flex flex-col pt-8 z-50">
      <div className="px-6 mb-12">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shrink-0">P</div>
          <h1 className="text-xl font-black text-white tracking-tighter uppercase leading-none">15 PUZZLE</h1>
        </div>
        <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px] mt-2">Mechanical Edition</p>
      </div>
      
      <nav className="flex-1 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as View)}
            className={`w-full flex items-center gap-3 px-6 py-4 transition-all duration-200 active:translate-x-1 font-inter text-[11px] font-bold uppercase tracking-widest ${
              currentView === item.id 
                ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-neutral-900'
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto px-6 pb-8 space-y-4">
        <button 
          onClick={() => setView('play')}
          className="w-full bg-blue-600 text-white py-4 px-4 rounded-2xl font-black tactile-button transition-all duration-150 shadow-[0_4px_0_0_#1e40af] border border-blue-400/20 flex items-center justify-center gap-2 uppercase text-xs tracking-tighter"
        >
          <Plus size={18} />
          New Game
        </button>
        <div className="pt-6 border-t border-neutral-900">
          <button
            onClick={() => setView('settings')}
            className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-200 font-inter text-xs font-bold uppercase tracking-widest bg-neutral-900 border border-neutral-800 ${
              currentView === 'settings' ? 'text-blue-500' : 'text-zinc-500 hover:text-zinc-200'
            }`}
          >
            <Settings size={18} />
            <span>Settings</span>
          </button>
        </div>
      </div>
    </aside>
  );
}

export function TopBar({ title }: { title: string }) {
  return (
    <header className="bg-neutral-900/50 fixed top-0 right-0 left-64 h-16 flex justify-between items-center px-8 z-40 border-b border-white/5 backdrop-blur-md">
      <div className="flex items-center gap-2">
        <span className="text-zinc-400 font-bold uppercase tracking-[0.2em] text-[10px]">{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="px-4 py-1.5 bg-neutral-800 rounded-full text-[10px] font-bold text-neutral-400 border border-neutral-700">v2.0.4 - STABLE</div>
        <button className="text-zinc-400 hover:bg-neutral-800 p-2 rounded-lg transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full border border-neutral-700 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-400 to-blue-700 shadow-lg"></div>
        </div>
      </div>
    </header>
  );
}
