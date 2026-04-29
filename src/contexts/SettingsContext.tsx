import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameSettings } from '../types';

interface SettingsContextType {
  settings: GameSettings;
  updateSettings: (newSettings: Partial<GameSettings>) => void;
  playSFX: (type: 'move' | 'victory' | 'click') => void;
  triggerHaptic: () => void;
}

const defaultSettings: GameSettings = {
  sfx: true,
  music: false,
  haptics: true,
  theme: 'cobalt'
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<GameSettings>(() => {
    const saved = localStorage.getItem('game_settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('game_settings', JSON.stringify(settings));
    document.documentElement.setAttribute('data-theme', settings.theme);
  }, [settings]);

  const updateSettings = useCallback((newSettings: Partial<GameSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  }, []);

  const playSFX = useCallback((type: 'move' | 'victory' | 'click') => {
    if (!settings.sfx) return;
    
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      if (type === 'move') {
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.05);
      } else if (type === 'click') {
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(200, audioCtx.currentTime);
        gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
        oscillator.start();
        oscillator.stop(audioCtx.currentTime + 0.02);
      } else if (type === 'victory') {
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
        gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
        oscillator.start();
        oscillator.frequency.exponentialRampToValueAtTime(1046.5, audioCtx.currentTime + 0.5); // C6
        oscillator.stop(audioCtx.currentTime + 0.5);
      }
    } catch (e) {
      console.warn("AudioContext failed", e);
    }
  }, [settings.sfx]);

  const triggerHaptic = useCallback(() => {
    if (!settings.haptics) return;
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  }, [settings.haptics]);

  const value = React.useMemo(() => ({
    settings,
    updateSettings,
    playSFX,
    triggerHaptic
  }), [settings, updateSettings, playSFX, triggerHaptic]);

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within SettingsProvider');
  return context;
}
