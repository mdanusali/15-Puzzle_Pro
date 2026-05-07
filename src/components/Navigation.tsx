import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
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
  Grid3X3,
  X,
  LogIn,
  Facebook
} from 'lucide-react';
import { View } from '../types';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  currentView: View;
  setView: (view: View) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ currentView, setView, isOpen, onToggle }: SidebarProps) {
  const { user, signInWithGoogle, signInWithFacebook, userStats } = useAuth();
  const menuItems = [
    { id: 'play', label: 'Play', icon: Grid2X2 },
    { id: 'stats', label: 'Statistics', icon: BarChart3 },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
    { id: 'history', label: 'History', icon: History },
  ];

  const handleNavClick = (view: View) => {
    setView(view);
    if (window.innerWidth < 1024) {
      onToggle();
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
          />
        )}
      </AnimatePresence>

      <aside className={`bg-neutral-950 h-screen w-80 fixed left-0 top-0 border-r-8 border-neutral-900 flex flex-col pt-12 z-[70] transition-transform duration-500 cubic-bezier(0.4, 0, 0.2, 1) ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="px-8 mb-12 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-600 rounded-[1rem] flex items-center justify-center font-black text-white shrink-0 shadow-[0_0_30px_rgba(37,99,235,0.4)]">P</div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase leading-none italic">15 PUZZLE</h1>
            </div>
            <p className="text-neutral-500 font-black uppercase tracking-[0.4em] text-[10px] mt-4 pl-1">Mechanical Edition</p>
          </div>
          <button onClick={onToggle} className="text-neutral-500 hover:text-white transition-colors p-2 lg:hidden">
            <X size={24} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-6 mb-12">
          {user ? (
            <div className="bg-neutral-900 border-2 border-white/5 rounded-[2rem] p-5 flex items-center gap-4 relative group overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={user.photoURL || ''} alt="" className="w-12 h-12 rounded-[1.25rem] object-cover bg-black relative z-10 border border-white/10" />
              <div className="overflow-hidden relative z-10">
                <p className="text-white font-black text-sm truncate italic uppercase tracking-tighter">{user.displayName}</p>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                  <p className="text-blue-500 font-black text-[9px] uppercase tracking-widest">Lv. {userStats?.level || 1} • {userStats?.xp || 0} XP</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <button 
                onClick={signInWithGoogle}
                className="w-full bg-blue-600 text-white hover:bg-blue-500 h-16 px-6 rounded-2xl flex items-center gap-4 transition-all group shadow-[0_8px_0_0_#1e40af] active:translate-y-1 active:shadow-none"
              >
                <LogIn size={20} className="group-hover:scale-110 transition-transform" />
                <span className="text-[11px] font-black uppercase tracking-[0.2em]">Join the Matrix</span>
              </button>
            </div>
          )}
        </div>
        
        <nav className="flex-1 space-y-2 px-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as View)}
              className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-300 active:scale-95 font-inter text-[11px] font-black uppercase tracking-[0.3em] ${
                currentView === item.id 
                  ? 'bg-blue-600/10 text-blue-500 shadow-inner' 
                  : 'text-neutral-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <item.icon size={20} className={currentView === item.id ? 'text-blue-500' : 'text-neutral-600'} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="mt-auto px-6 pb-8 space-y-4">
          <button 
            onClick={() => handleNavClick('play')}
            className="w-full bg-blue-600 text-white py-4 px-4 rounded-2xl font-black tactile-button transition-all duration-150 shadow-[0_4px_0_0_#1e40af] border border-blue-400/20 flex items-center justify-center gap-2 uppercase text-xs tracking-tighter"
          >
            <Plus size={18} />
            New Game
          </button>
          <div className="pt-6 border-t border-border-panel">
            <button
              onClick={() => handleNavClick('settings')}
              className={`w-full flex items-center justify-center gap-3 py-3 rounded-xl transition-all duration-200 font-inter text-xs font-bold uppercase tracking-widest bg-bg-panel border border-border-panel ${
                currentView === 'settings' ? 'text-blue-500 border-blue-500/50' : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

export function TopBar({ title, onToggleMenu }: { title: string, onToggleMenu: () => void }) {
  const { user } = useAuth();
  return (
    <header className="bg-black fixed top-0 right-0 left-0 h-16 sm:h-20 flex justify-between items-center px-4 sm:px-12 z-50 border-b border-white/5 shadow-2xl">
      <div className="flex items-center gap-6">
        <button 
          onClick={onToggleMenu}
          className="p-2 text-text-secondary hover:bg-white/5 rounded-xl transition-all active:scale-95"
        >
          <Menu size={24} />
        </button>
        <div className="flex flex-col">
          <h2 className="text-white font-black italic tracking-tighter text-sm sm:text-base leading-none uppercase">GAME ENGINE</h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-black text-text-secondary uppercase tracking-[0.2em]">Quantum Core Active</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4 sm:gap-8">
        <div className="hidden sm:flex px-4 py-1.5 bg-neutral-900 rounded-full text-[10px] font-black text-text-secondary border border-white/5 shadow-inner">
          v2.0.4 - STABLE
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 bg-neutral-900/50 p-1 pr-4 rounded-full border border-white/5">
              <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-white/10 bg-black object-cover" />
              <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest hidden lg:block">{user.displayName?.split(' ')[0]}</span>
            </div>
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-white/10 bg-blue-600 shadow-[0_0_20px_rgba(37,99,235,0.3)]" />
          )}
        </div>
      </div>
    </header>
  );
}
