import { Zap, Layers, Bell } from 'lucide-react';

export default function PriceComparison({ results, onSelectStore, onOpenAlert, sfx }) {
  return (
    <div className="space-y-8 flex-1 flex flex-col animate-in slide-in-from-bottom-4 min-h-0">
      <div className="flex flex-col lg:flex-row gap-8 bg-black/40 p-6 rounded border border-green-900/50 relative shadow-[0_0_20px_rgba(34,197,94,0.1)]">
        <img src={results.thumb} alt="" className="w-full lg:w-48 h-64 object-contain border-2 border-green-600/60 rounded-lg shadow-xl" />
        <div className="flex-1 space-y-6 w-full">
          <h2 className="text-3xl lg:text-5xl font-black text-white uppercase italic drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">
            {results.title}
          </h2>
          <div className="bg-green-950/20 border-2 border-green-500/80 rounded overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.2)]">
            <div className="flex justify-between p-4 bg-black/50 border-b border-green-900">
              <div>
                <p className="text-[10px] font-bold text-green-700 uppercase">Lowest Found</p>
                <p className="text-3xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]">
                  ${results.deals[0].price}
                </p>
              </div>
              <div className="text-right opacity-60">
                <p className="text-[10px] font-bold text-green-700 uppercase">Retail</p>
                <p className="text-xl font-bold text-green-800 line-through">${results.deals[0].retail}</p>
              </div>
            </div>
            <div className="bg-green-600 p-4 flex items-center justify-center gap-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]">
              <Zap size={20} className="fill-black text-black animate-bounce" />
              <span className="text-black font-black text-2xl uppercase italic tracking-tighter">
                YOU JUST SAVED: ${(results.deals[0].retail - results.deals[0].price).toFixed(2)}
              </span>
              <Zap size={20} className="fill-black text-black animate-bounce" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4">
          <span className="text-xs font-black uppercase text-green-700 tracking-widest">
            <Layers size={14} className="inline mr-2" /> Store Comparison
          </span>
          <button
            onClick={onOpenAlert}
            onMouseEnter={() => sfx('hover')}
            className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500 border border-green-800/60 px-3 py-1 hover:bg-green-900/30 transition-all"
          >
            <Bell size={12} /> Price Alert
          </button>
        </div>
        <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">
          {results.deals.map((d, i) => (
            <button
              key={i}
              onClick={() => { sfx('click'); onSelectStore(d); }}
              onMouseEnter={() => sfx('hover')}
              className={`w-full flex justify-between items-center p-5 bg-black/60 border rounded-lg transition-all group ${
                i === 0
                  ? 'border-green-500 bg-green-950/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]'
                  : 'border-green-900/30 hover:border-green-500/50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`font-black uppercase ${i === 0 ? 'text-white' : 'text-green-700'}`}>
                  {d.store}
                </span>
                {i === 0 && (
                  <span className="bg-yellow-500 text-black px-3 py-1 rounded font-black text-[10px] uppercase shadow-lg">
                    BEST PRICE 🏆
                  </span>
                )}
              </div>
              <span className={`font-black text-xl ${i === 0 ? 'text-green-400' : 'text-green-800'}`}>
                ${d.price.toFixed(2)}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
