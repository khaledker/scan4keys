import { Activity } from 'lucide-react';

export default function ScanProgress({ scanProgress, scanMessage }) {
  return (
    <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-12 text-center">
      <div className="w-full max-w-md space-y-8">
        <div className="flex justify-between items-end text-xs font-black uppercase text-green-500">
          <span className="flex items-center gap-2">
            <Activity size={12} className="animate-pulse" /> {scanMessage}
          </span>
          <span className="text-xl italic">{scanProgress}%</span>
        </div>
        <div className="h-12 border-2 border-green-900 flex items-center p-1 gap-1 relative overflow-hidden bg-green-950/10">
          <div className="absolute inset-0 grid-bg opacity-20" />
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`flex-1 h-full transition-all duration-300 ${scanProgress > (i * 5) ? 'bg-green-500' : 'bg-green-950/30'}`}
              style={{
                boxShadow: scanProgress > (i * 5) ? '0 0 10px rgba(34,197,94,0.4)' : 'none',
                opacity: scanProgress > (i * 5) ? 1 : 0.2
              }}
            />
          ))}
        </div>
        <p className="text-[10px] font-bold text-green-800 uppercase tracking-[0.3em]">SECURE SCAN IN PROGRESS</p>
      </div>
    </div>
  );
}
