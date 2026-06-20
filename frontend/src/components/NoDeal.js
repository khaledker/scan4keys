import { ShieldAlert } from 'lucide-react';

export default function NoDeal({ results, onOpenAlert, onBack, sfx }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6">
      <ShieldAlert size={80} className="text-red-900" />
      <h3 className="text-red-500 font-black text-3xl uppercase">No active deal was found</h3>
      <button
        onClick={() => { sfx('click'); onOpenAlert(); }}
        onMouseEnter={() => sfx('hover')}
        className="w-full max-w-xs border-2 border-green-600 text-green-500 font-black p-4 uppercase hover:bg-green-600 hover:text-black transition-all"
      >
        Alert me when discounted
      </button>
      <button onClick={onBack} onMouseEnter={() => sfx('hover')} className="text-[10px] font-bold text-green-800 uppercase underline">
        Back
      </button>
    </div>
  );
}
