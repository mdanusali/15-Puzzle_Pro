import React, { useState } from 'react';
import { Sidebar, TopBar } from './components/Navigation';
import { PuzzleBoard, ControlPanel } from './components/PlayScreen';
import { StatsScreen, LeaderboardScreen } from './components/StatsScreens';
import { SettingsScreen } from './components/SettingsScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { usePuzzle } from './hooks/usePuzzle';
import { View } from './types';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('play');
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { state, moveTile, shuffleGame, initGame } = usePuzzle();

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const renderContent = () => {
    switch (currentView) {
      case 'play':
        return (
          <div className="flex flex-col items-center gap-12 pt-0 lg:pt-8 w-full">
            <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-center lg:items-start w-full justify-center">
              <div className="flex flex-col items-center w-full lg:w-auto">
                <PuzzleBoard 
                  state={state} 
                  moveTile={moveTile} 
                  shuffleGame={shuffleGame} 
                />
              </div>
              <ControlPanel 
                onShuffle={shuffleGame} 
                onModeChange={initGame} 
                currentMode={state.mode}
                moves={state.moves}
                seconds={state.seconds}
              />
            </div>
          </div>
        );
      case 'stats':
        return <StatsScreen />;
      case 'leaderboard':
        return <LeaderboardScreen />;
      case 'history':
        return <HistoryScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (currentView) {
      case 'play': return 'Game Engine';
      case 'stats': return 'Performance Metrics';
      case 'leaderboard': return 'Global Standings';
      case 'history': return 'Mission Logs';
      case 'settings': return 'System Configuration';
      default: return '';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-slate-200 font-sans selection:bg-blue-600/30 overflow-x-hidden">
      <Sidebar 
        currentView={currentView} 
        setView={setCurrentView} 
        isOpen={isSidebarOpen} 
        onToggle={toggleSidebar} 
      />
      <TopBar title={getTitle()} onToggleMenu={toggleSidebar} />
      
      <main className="lg:ml-64 pt-24 px-4 sm:px-8 lg:px-12 pb-24 transition-all duration-300 min-h-screen">
        {renderContent()}
      </main>

      <footer className="fixed bottom-0 lg:left-64 left-0 right-0 h-14 lg:h-12 bg-neutral-900 border-t border-white/5 flex flex-col lg:flex-row items-center justify-center lg:justify-between px-4 lg:px-12 text-[10px] font-bold text-neutral-500 uppercase tracking-widest z-30 shrink-0 gap-2 lg:gap-0">
        <div className="flex gap-4 items-center">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>System Online: Node-FR2GM</span>
        </div>
        <div className="flex gap-4 lg:gap-8">
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Docs</span>
          <span className="hover:text-blue-500 cursor-pointer transition-colors">Ranks</span>
        </div>
        <div className="italic hidden lg:block">© 2026 TACTILE LABS - V2.0</div>
      </footer>

      {/* Bento-style ambient glows */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] sm:w-[600px] lg:w-[800px] h-[300px] sm:h-[600px] lg:h-[800px] bg-blue-600/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="fixed top-20 right-[-100px] w-[200px] sm:w-[400px] lg:w-[500px] h-[200px] sm:h-[400px] lg:h-[500px] bg-emerald-500/5 blur-[80px] sm:blur-[120px] rounded-full pointer-events-none -z-10" />
    </div>
  );
}
