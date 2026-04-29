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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`bg-bg-page h-screen w-64 fixed left-0 top-0 border-r border-border-panel flex flex-col pt-8 z-[70] transition-transform duration-300 transform ${
        isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      }`}>
        <div className="px-6 mb-8 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-black text-white shrink-0">P</div>
              <h1 className="text-xl font-black text-text-primary tracking-tighter uppercase leading-none">15 PUZZLE</h1>
            </div>
            <p className="text-text-secondary font-medium uppercase tracking-widest text-[10px] mt-2">Mechanical Edition</p>
          </div>
          <button onClick={onToggle} className="lg:hidden text-text-secondary hover:text-text-primary transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* User Profile Card */}
        <div className="px-4 mb-8">
          {user ? (
            <div className="bg-bg-panel border border-border-panel rounded-2xl p-4 flex items-center gap-3 relative group overflow-hidden">
               <div className="absolute inset-0 bg-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              <img src={user.photoURL || ''} alt="" className="w-10 h-10 rounded-xl object-cover bg-bg-page relative z-10 border border-border-panel" />
              <div className="overflow-hidden relative z-10">
                <p className="text-text-primary font-black text-xs truncate italic">{user.displayName}</p>
                <p className="text-blue-500 font-black text-[9px] uppercase tracking-widest">Lv. {userStats?.level || 1} • {userStats?.xp || 0} XP</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button 
                onClick={signInWithGoogle}
                className="w-full bg-bg-panel border border-border-panel hover:bg-neutral-800 text-text-primary py-3 px-4 rounded-xl flex items-center gap-3 transition-colors group"
              >
                <LogIn size={16} className="text-blue-500 group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Login / Sync</span>
              </button>
            </div>
          )}
        </div>
        
        <nav className="flex-1 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id as View)}
              className={`w-full flex items-center gap-3 px-6 py-4 transition-all duration-200 active:translate-x-1 font-inter text-[11px] font-bold uppercase tracking-widest ${
                currentView === item.id 
                  ? 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600 font-black italic' 
                  : 'text-text-secondary hover:text-text-primary hover:bg-bg-panel'
              }`}
            >
              <item.icon size={18} />
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
    <header className="bg-bg-panel/50 fixed top-0 right-0 left-0 lg:left-64 h-16 flex justify-between items-center px-4 lg:px-8 z-40 border-b border-border-panel backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleMenu}
          className="lg:hidden p-2 text-text-secondary hover:bg-bg-page rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
        <span className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] hidden sm:block">{title}</span>
        <span className="text-text-secondary font-bold uppercase tracking-[0.2em] text-[10px] sm:hidden">{title.split(' ')[0]}</span>
      </div>
      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden md:block px-4 py-1.5 bg-bg-page rounded-full text-[10px] font-bold text-text-secondary border border-border-panel">v2.0.4 - STABLE</div>
        <button className="text-text-secondary hover:bg-bg-page p-2 rounded-lg transition-colors">
          <HelpCircle size={20} />
        </button>
        <div className="flex items-center gap-3">
          {user ? (
            <img src={user.photoURL || ''} alt="" className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-border-panel bg-bg-page object-cover shrink-0" />
          ) : (
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-full border border-border-panel bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-400 to-blue-700 shadow-lg shrink-0"></div>
          )}
        </div>
      </div>
    </header>
  );
}
