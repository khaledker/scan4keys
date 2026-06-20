import { Globe, Search } from 'lucide-react';

export default function ReadyState() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4 opacity-40 text-center">
      <div className="relative">
        <Globe size={100} className="text-green-800 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Search size={30} className="text-green-600" />
        </div>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-4xl font-black uppercase italic tracking-tighter text-green-700 w-full drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">
          Ready to Search
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.5em] mt-1 text-green-800 border-t border-green-900/30 pt-2 w-full text-center">
          Awaiting user input...
        </p>
      </div>
    </div>
  );
}
