import { useState } from 'react';
import { Bell, Mail } from 'lucide-react';

export default function PriceAlertModal({ results, onClose, sfx }) {
  const [email, setEmail] = useState('');

  const handleSetAlert = () => {
    onClose();
    sfx('deal_found');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-black border-2 border-green-500 p-10 max-w-2xl w-full space-y-8 relative rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-in zoom-in-95">
        <div className="flex items-center gap-4 border-b border-green-900 pb-6">
          <Bell size={32} className="text-green-400" />
          <div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Price Alert</h2>
            <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Stay updated on cost changes</p>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-green-950/20 p-4 border border-green-900 rounded">
            <p className="text-xs uppercase text-green-400 font-bold mb-1">Target Game</p>
            <p className="text-lg font-black text-white uppercase italic">{results?.title}</p>
          </div>
          <div className="space-y-4">
            <p className="text-sm text-green-500 font-medium leading-relaxed">
              Provide your email address below to receive an automatic alert. Our system will notify you instantly
              whenever a price drop is detected for this title.
            </p>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-800" size={20} />
              <input
                type="email"
                placeholder="YOUR EMAIL ADDRESS"
                className="w-full bg-black border-2 border-green-800 p-5 pl-12 text-green-400 outline-none uppercase font-black focus:border-green-400 transition-all rounded"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSetAlert}
            onMouseEnter={() => sfx('hover')}
            className="flex-1 bg-green-600 text-black font-black py-4 uppercase text-lg hover:bg-white transition-all rounded shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          >
            Set Alert
          </button>
          <button
            onClick={onClose}
            onMouseEnter={() => sfx('hover')}
            className="flex-1 border-2 border-green-900 py-4 text-green-800 uppercase font-black hover:text-green-500 hover:border-green-500 transition-all rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
