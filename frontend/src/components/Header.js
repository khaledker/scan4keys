import { ShieldCheck, Info, Volume2, VolumeX } from 'lucide-react';

export default function Header({ soundEnabled, setSoundEnabled, audioStarted, onLegalClick, sfx }) {
  return (
    <header className="border-b border-green-900/40 p-4 flex justify-between items-center bg-black/90 backdrop-blur-md z-40 sticky top-0 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
      <div className="flex items-center gap-3">
        <div className="bg-green-600 p-1.5 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.4)]">
          <ShieldCheck size={24} className="text-black" />
        </div>
        <div>
          <h1 className="text-sm md:text-base font-black uppercase tracking-[0.2em] leading-none drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]">
            SCAN 4 KEYS <span className="text-green-600">v6.7</span>
          </h1>
          <span className="text-[10px] text-green-800 font-bold uppercase">System Online</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {!audioStarted && (
          <span className="text-[10px] text-yellow-600 font-black animate-pulse mr-2 uppercase">Audio Node Offline</span>
        )}
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          onMouseEnter={() => sfx('hover')}
          className={`p-2 transition-colors ${soundEnabled ? 'text-green-400' : 'text-green-900'}`}
        >
          {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>
        <button onClick={onLegalClick} onMouseEnter={() => sfx('hover')} className="p-2 text-green-700 hover:text-green-400 transition-colors">
          <Info size={20} />
        </button>
      </div>
    </header>
  );
}
