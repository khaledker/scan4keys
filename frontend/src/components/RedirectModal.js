import { ShieldAlert, ArrowLeft, Tag, Monitor, CheckCircle2, Globe, ExternalLink } from 'lucide-react';
import { STORE_DISCOUNTS, TUTORIAL_MAP } from '../utils/constants';

export default function RedirectModal({ redirect, onClose, sfx }) {
  const steps = [
    {
      t: 'AD-BLOCKERS DETECTED',
      d: 'Extensions like AdBlock or uBlock may block the secure redirect to the store. Please disable them if the store page fails to load.',
      icon: <ShieldAlert className="text-red-500" />
    },
    {
      t: '100% AUTHORIZED SELLERS',
      d: 'We only scan official authorized distributors. These are NOT keys from grey-market resellers—your purchase directly supports the developers.',
      icon: <CheckCircle2 className="text-green-500" />
    },
    {
      t: 'REGION & PRICING',
      d: 'Displayed prices are based on the US Region. While global discounts are usually mirrored, your local currency and store price may vary slightly.',
      icon: <Globe className="text-yellow-500" />
    }
  ];

  const discount = STORE_DISCOUNTS[redirect.storeID] || STORE_DISCOUNTS.default;

  return (
    <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-2 md:p-6 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-black border-2 border-green-600/80 flex flex-col animate-in fade-in zoom-in-95 overflow-y-auto rounded-lg shadow-[0_0_40px_rgba(34,197,94,0.3)] custom-scrollbar">
        <header className="bg-green-600 text-black p-4 flex justify-between items-center sticky top-0 z-[110]">
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-5 h-5" />
            <h2 className="text-xs md:text-sm font-black uppercase tracking-widest">Store Redirect</h2>
          </div>
          <button
            onClick={() => { sfx('click'); onClose(); }}
            className="hover:bg-black hover:text-white p-1 md:p-2 rounded transition-all"
          >
            <ArrowLeft size={20} />
          </button>
        </header>
        <div className="p-4 md:p-8 space-y-8">
          <div className="bg-green-950/20 border-2 border-green-600/30 p-5 rounded flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-600 rounded">
                <Tag size={24} className="text-black" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase text-green-500">Discount Code Available</p>
                <p className="text-2xl font-black text-white italic">{discount.code}</p>
              </div>
            </div>
            <div className="bg-green-600 text-black px-6 py-2 rounded-full font-black text-xl italic shadow-lg">
              {discount.percent} OFF
            </div>
          </div>

          <div className="flex flex-col gap-4 items-center bg-green-950/10 border border-green-500/30 p-6 rounded-lg text-center">
            <div className="relative z-10 space-y-1">
              <p className="text-green-400 font-bold uppercase tracking-[0.3em] text-[10px]">Savings Found</p>
              <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-none">
                -${(redirect.retail - redirect.price).toFixed(2)} OFF
              </h3>
              <p className="text-green-500 font-black text-xs uppercase tracking-widest opacity-70">Price Drop Verified</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[10px] font-black uppercase text-green-500 tracking-widest bg-green-950/30 p-2 border-b border-green-500/20">
                <span><Monitor size={12} className="inline mr-1" /> Tutorial video</span>
              </div>
              <div className="aspect-video w-full bg-black border border-green-800 rounded overflow-hidden">
                <iframe
                  className="w-full h-full grayscale"
                  src={`${TUTORIAL_MAP[redirect.storeID] || TUTORIAL_MAP.default}?autoplay=0&rel=0`}
                  allowFullScreen
                  title="Tutorial"
                />
              </div>
            </div>
            <div className="bg-red-950/10 border-2 border-red-600/50 p-6 space-y-6 rounded relative shadow-[0_0_20px_rgba(220,38,38,0.1)]">
              <div className="absolute -top-3 left-4 bg-red-600 px-3 py-0.5 text-[10px] font-black uppercase text-white tracking-widest animate-pulse">
                IMPORTANT: READ BEFORE PROCEEDING
              </div>
              <div className="space-y-5">
                {steps.map((step, i) => (
                  <div key={i} className="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0">
                    <div className="mt-1 flex-shrink-0">{step.icon}</div>
                    <div>
                      <p className="font-black text-white uppercase text-sm mb-1">{step.t}</p>
                      <p className="text-xs text-green-400/80 font-bold leading-relaxed">{step.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <a
            href={redirect.url}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => sfx('hover')}
            className="w-full bg-green-600 text-black py-5 px-4 font-black text-xl md:text-2xl text-center hover:bg-white transition-all rounded shadow-[0_0_30px_rgba(34,197,94,0.3)] uppercase block border-b-4 border-black/20"
          >
            <span className="flex items-center justify-center gap-2">
              Proceed to Official Store <ExternalLink size={24} />
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
