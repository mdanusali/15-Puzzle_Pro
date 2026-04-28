import React from 'react';
import { motion } from 'motion/react';
import { User, Volume2, Music, Vibrate, Trash2, ChevronRight, Lock, Check } from 'lucide-react';

export function SettingsScreen() {
  return (
    <div className="max-w-2xl mx-auto space-y-12 pb-12">
      <section>
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Core Identity</h2>
        <div className="bg-neutral-900 rounded-[2rem] p-8 border border-neutral-800 shadow-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-neutral-800 flex items-center justify-center border border-neutral-700 shadow-lg">
              <User className="text-blue-500" size={32} />
            </div>
            <div>
              <p className="text-2xl font-black text-white italic tracking-tighter">Alex Rivers</p>
              <p className="text-sm font-bold text-blue-500 uppercase tracking-widest">Grandmaster • Lv. 42</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="bg-neutral-800 text-white border border-neutral-700 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest active:translate-y-0.5 transition-all">
              Modify Protocol
            </button>
            <button className="bg-neutral-800 text-red-400 border border-neutral-700 rounded-xl py-3 px-4 text-xs font-black uppercase tracking-widest active:translate-y-0.5 transition-all">
              Terminate Session
            </button>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Tactile Feedback</h2>
        <div className="bg-neutral-900 rounded-[2rem] overflow-hidden border border-neutral-800 shadow-2xl divide-y divide-neutral-800/50">
          <ToggleRow icon={Volume2} label="Acoustic harmonics" active />
          <ToggleRow icon={Music} label="Background ambience" />
          <ToggleRow icon={Vibrate} label="Haptic resonance" active />
        </div>
      </section>

      <section>
        <h2 className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-4">Aesthetics</h2>
        <div className="bg-neutral-900 rounded-[2rem] p-8 border border-neutral-800 shadow-2xl">
          <p className="text-[10px] font-black text-neutral-500 mb-6 uppercase tracking-widest">Visual Matrix</p>
          <div className="grid grid-cols-2 gap-6">
            <div className="relative rounded-2xl p-2 border-2 border-blue-600 bg-neutral-950">
              <div className="bg-neutral-900 aspect-video rounded-xl flex items-center justify-center mb-3 overflow-hidden border border-neutral-800 shadow-inner">
                <div className="grid grid-cols-2 gap-2 w-16">
                  <div className="w-6 h-6 bg-blue-600 rounded-md shadow-[0_2px_0_0_#1e40af]" />
                  <div className="w-6 h-6 bg-neutral-800 rounded-md" />
                </div>
              </div>
              <p className="text-center text-[10px] font-black text-blue-500 uppercase tracking-widest">Cobalt Matrix</p>
              <div className="absolute -top-3 -right-3 bg-blue-600 rounded-full p-1.5 border-4 border-neutral-950 shadow-lg">
                <Check size={12} className="text-white" />
              </div>
            </div>
            <div className="relative rounded-2xl p-2 border-2 border-transparent bg-neutral-950 opacity-40 grayscale group hover:opacity-60 transition-opacity">
              <div className="bg-white aspect-video rounded-xl flex items-center justify-center mb-3 overflow-hidden shadow-inner">
                <div className="grid grid-cols-2 gap-2 w-16">
                  <div className="w-6 h-6 bg-neutral-200 rounded-md" />
                  <div className="w-6 h-6 bg-neutral-300 rounded-md" />
                </div>
              </div>
              <p className="text-center text-[10px] font-black text-neutral-500 uppercase tracking-widest">Ivory Slate</p>
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-2xl">
                <Lock size={20} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-4">
        <button className="w-full p-8 bg-red-500/5 border border-red-500/20 rounded-[2rem] flex items-center justify-between text-red-500 active:translate-y-1 transition-all group">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center border border-red-500/20 group-hover:bg-red-500 opacity-80 transition-colors">
              <Trash2 size={24} className="group-hover:text-white" />
            </div>
            <div className="text-left">
              <span className="block font-black uppercase tracking-widest text-xs mb-1 group-hover:text-white">Hard Reset Matrix</span>
              <p className="text-[10px] font-medium text-red-500/60 uppercase tracking-tighter">This action is irreversible and will purge all data</p>
            </div>
          </div>
          <ChevronRight size={24} />
        </button>
      </section>
    </div>
  );
}

function ToggleRow({ icon: Icon, label, active = false }: { icon: any, label: string, active?: boolean }) {
  return (
    <div className="flex items-center justify-between p-8 hover:bg-neutral-800/30 transition-colors cursor-pointer group">
      <div className="flex items-center gap-5">
        <div className={`p-3 rounded-xl border border-neutral-800 ${active ? 'bg-blue-600/10 border-blue-500/20 shadow-[0_0_15px_rgba(37,99,235,0.1)]' : 'bg-neutral-900'}`}>
          <Icon size={20} className={active ? 'text-blue-500' : 'text-neutral-500'} />
        </div>
        <span className={`font-black uppercase tracking-widest text-xs ${active ? 'text-white' : 'text-neutral-500'} group-hover:text-white transition-colors`}>{label}</span>
      </div>
      <button className={`w-14 h-7 rounded-full relative transition-all duration-300 ${active ? 'bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.3)]' : 'bg-neutral-800 shadow-inner'}`}>
        <motion.div 
          animate={{ x: active ? 28 : 4 }}
          className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
        />
      </button>
    </div>
  );
}
