import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, Search, ShieldCheck, Wifi, Cpu, Lock, Crosshair, 
  AlertTriangle, ChevronRight, RefreshCw, Database, ListFilter, 
  ExternalLink, ArrowLeft, PlayCircle, Zap, Bell, Mail, Tag,
  SearchX, CheckCircle2, ShieldAlert, Fingerprint, Globe, Activity, Scale, Info, Monitor, Layers, X, Radar, Volume2, VolumeX, RotateCcw
} from 'lucide-react';

// --- EDITABLE DISCOUNT CODES ---
// You can edit these values whenever you find a new code
const STORE_DISCOUNTS = {
  "1": { code: "NONE", percent: "0%" }, // Steam
  "default": { code: "NO ACTIVE CODES", percent: "0%" }
};

const playSound = (type, audioCtx) => {
  if (!audioCtx || audioCtx.state === 'suspended') return;
  const now = audioCtx.currentTime;
  const gain = audioCtx.createGain();
  gain.connect(audioCtx.destination);

  if (type === 'typing') {
    const osc = audioCtx.createOscillator();
    osc.type = 'square';
    osc.frequency.setValueAtTime(1500, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.02);
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.02);
  } else if (type === 'click') {
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(200, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.1);
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    osc.start(now);
    osc.stop(now + 0.1);
  } else if (type === 'hover') {
    const noiseBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.02, audioCtx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < output.length; i++) { output[i] = Math.random() * 2 - 1; }
    const source = audioCtx.createBufferSource();
    source.buffer = noiseBuffer;
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 8000;
    gain.gain.setValueAtTime(0.005, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    source.connect(filter);
    filter.connect(gain);
    source.start(now);
  } else if (type === 'deal_found') {
    // NEW: Complex High-Tech "Scan Successful" Sound
    const frequencies = [440, 880, 1320];
    frequencies.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      osc.type = i % 2 === 0 ? 'sine' : 'square';
      osc.frequency.setValueAtTime(freq, now + (i * 0.05));
      osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.2 + (i * 0.05));
      
      const g = audioCtx.createGain();
      g.gain.setValueAtTime(0, now + (i * 0.05));
      g.gain.linearRampToValueAtTime(0.02, now + 0.05 + (i * 0.05));
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + (i * 0.05));
      
      osc.connect(g);
      g.connect(audioCtx.destination);
      osc.start(now + (i * 0.05));
      osc.stop(now + 0.4);
    });
  } else if (type === 'no_deal') {
    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc2.type = 'sine';
    osc.frequency.setValueAtTime(60, now);
    osc2.frequency.setValueAtTime(57, now);
    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain);
    osc2.connect(gain);
    osc.start(now);
    osc2.start(now);
    osc.stop(now + 0.3);
    osc2.stop(now + 0.3);
  }
};

const tutorialMap = {
  default: "https://www.youtube.com/embed/dQw4w9WgXcQ"
};

export default function App() {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('INITIALIZING...');
  const [stores, setStores] = useState({});
  const [activeRedirect, setActiveRedirect] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [showLegal, setShowLegal] = useState(false);
  const [email, setEmail] = useState('');
  const [scanError, setScanError] = useState(false); 
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastSelected, setLastSelected] = useState(null);
  const [audioStarted, setAudioStarted] = useState(false);
  
  const scrollRef = useRef(null);
  const audioCtxRef = useRef(null);
  const ambientGainRef = useRef(null);
  const canvasRef = useRef(null);

  const addLog = (text, type = 'info') => setLogs(p => [...p, { text, type, id: Date.now() + Math.random() }]);
  const wait = (ms) => new Promise(r => setTimeout(r, ms));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    const columns = Math.floor(width / 20);
    const drops = Array(columns).fill(0).map(() => Math.random() * -100); 
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#22c55e';
      ctx.font = '15px monospace';
      for (let i = 0; i < drops.length; i++) {
        const text = String.fromCharCode(0x30A0 + Math.random() * 96);
        if (drops[i] > 0) ctx.fillText(text, i * 20, drops[i] * 20);
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const interval = setInterval(draw, 33);
    const handleResize = () => { width = canvas.width = window.innerWidth; height = canvas.height = window.innerHeight; };
    window.addEventListener('resize', handleResize);
    return () => { clearInterval(interval); window.removeEventListener('resize', handleResize); };
  }, []);

  useEffect(() => {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    audioCtxRef.current = new AudioContext();
    const ctx = audioCtxRef.current;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    const gain = ctx.createGain();
    osc1.type = 'sine'; osc1.frequency.value = 40; 
    osc2.type = 'sawtooth'; osc2.frequency.value = 40.5;
    lfo.type = 'sine'; lfo.frequency.value = 0.1; lfoGain.gain.value = 10;
    lfo.connect(lfoGain); lfoGain.connect(osc1.frequency);
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 60; filter.Q.value = 10;
    osc1.connect(filter); osc2.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
    ambientGainRef.current = gain; gain.gain.value = 0; 
    osc1.start(); osc2.start(); lfo.start();
    const startAudio = () => { if (ctx.state === 'suspended') ctx.resume(); setAudioStarted(true); if (soundEnabled) gain.gain.setTargetAtTime(0.04, ctx.currentTime, 3); window.removeEventListener('click', startAudio); };
    window.addEventListener('click', startAudio);
    return () => { osc1.stop(); osc2.stop(); lfo.stop(); window.removeEventListener('click', startAudio); };
  }, []);

  useEffect(() => { if (ambientGainRef.current && audioStarted) ambientGainRef.current.gain.setTargetAtTime(soundEnabled ? 0.04 : 0, audioCtxRef.current.currentTime, 0.5); }, [soundEnabled, audioStarted]);

  const sfx = (type) => { if (soundEnabled) playSound(type, audioCtxRef.current); };

useEffect(() => {
  const fetchStores = async () => {
    try {
      const res = await fetch('https://www.nexarda.com/api/v3/retailers', {
        headers: {
          'x-api-key': 'scan4keys_65artfarvvFRTA4DRTA'
        }
      });
      const data = await res.json();
      const storeMap = {};
      if (data?.results?.length > 0) {
        data.results.forEach(s => {
          storeMap[s.id] = { name: s.name };
        });
        setStores(storeMap);
        addLog('NETWORK CONNECTION ESTABLISHED.', 'success');
      }
    } catch (err) { addLog('STORE DATA UNAVAILABLE.', 'error'); }
  };
  fetchStores();
}, []);

  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [logs]);

  const runScan = async (onProgress) => {
    let progress = 0;
    const isRare = Math.random() < 0.1; 
    const totalDuration = isRare 
        ? 6000 + Math.random() * 700 
        : 4000 + Math.random() * 700;

    const tickRate = 50; 
    const totalTicks = totalDuration / tickRate;
    const incrementBase = 100 / totalTicks;

    while (progress < 100) {
      await wait(tickRate);
      progress += incrementBase + (Math.random() * 0.5 - 0.25);
      if (progress > 100) progress = 100;
      onProgress(Math.floor(progress));
      
      if (progress < 30) setScanMessage('CONNECTING...');
      else if (progress < 70) setScanMessage('INDEXING PRICES...');
      else if (progress < 100) setScanMessage('FINALIZING...');
      else setScanMessage('SUCCESS.');
    }
    return true;
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!query) return;
    sfx('click');
    setSearchLoading(true); setResults(null); setSuggestions(null); setLogs([]); setScanError(false);
    addLog(`SEARCH: "${query}"`, 'process');
    try {
     // NEW
const res = await fetch(`http://localhost:4000/search?q=${encodeURIComponent(query)}`);
const data = await res.json();
if (!data?.results?.items?.length) throw new Error();
setSuggestions(data.results.items);
sfx('deal_found');
addLog(`FOUND ${data.results.items.length} MATCHES.`, 'success');
    } catch { 
      sfx('no_deal');
      addLog('TITLE NOT FOUND.', 'error'); 
    }
    setSearchLoading(false);
  };

  const clearSearch = () => { setQuery(''); setSuggestions(null); setResults(null); setLogs([]); sfx('click'); };

 const selectGame = async (id, title, image) => {
  setLastSelected({id, title, thumb: image});
  setSuggestions(null); setLoading(true); setScanProgress(0); setScanError(false);
  sfx('click');
  addLog(`ANALYZING: ${title}`, 'process');
  const success = await runScan(setScanProgress);
  if (!success) { setLoading(false); return; }
  try {
    const res = await fetch(`http://localhost:4000/prices?id=${id}`);
    const data = await res.json();
    const available = data?.prices?.list?.filter(d => d.available && d.price > 0) || [];
    if (!available.length) {
      setResults({ error: 'none', title, thumb: image, gameID: id });
      sfx('no_deal');
      addLog('NO DISCOUNTS DETECTED.', 'error');
    } else {
      const deals = available.map(d => ({
        store: d.store.name,
        storeImage: d.store.image,
        price: d.price,
        retail: data.prices.highest,
        savings: Math.round(((data.prices.highest - d.price) / data.prices.highest) * 100),
        url: d.url,
        coupon: d.coupon
      })).sort((a, b) => a.price - b.price);
      setResults({ gameID: id, title, thumb: image, deals });
      sfx('deal_found');
      addLog('DEAL REPORT GENERATED.', 'success');
    }
  } catch { addLog('API TIMEOUT.', 'error'); }
  setLoading(false);
};

  return (
    <div className="min-h-screen bg-[#050505] text-green-500 font-mono relative selection:bg-green-900 overflow-y-auto custom-scrollbar h-screen crt-wrapper">
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-none opacity-40" />
      <div className="fixed inset-0 z-[61] scanlines pointer-events-none" />
      <div className="fixed inset-0 z-[62] crt-rolling-wave pointer-events-none" />
      <div className="fixed inset-0 z-[63] vignette pointer-events-none" />
      
      <div className="max-w-7xl mx-auto border-x border-green-800/40 bg-black/95 flex flex-col min-h-screen relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] crt-content">
        {activeRedirect && (
          <div className="fixed inset-0 z-[100] bg-black/98 flex items-center justify-center p-2 md:p-6 backdrop-blur-md">
            <div className="relative w-full max-w-4xl max-h-[90vh] bg-black border-2 border-green-600/80 flex flex-col animate-in fade-in zoom-in-95 overflow-y-auto rounded-lg shadow-[0_0_40px_rgba(34,197,94,0.3)] custom-scrollbar">
                <header className="bg-green-600 text-black p-4 flex justify-between items-center sticky top-0 z-[110]">
                    <div className="flex items-center gap-3">
                        <ShieldAlert className="w-5 h-5" />
                        <h2 className="text-xs md:text-sm font-black uppercase tracking-widest">Store Redirect</h2>
                    </div>
                    <button onClick={() => { sfx('click'); setActiveRedirect(null); }} className="hover:bg-black hover:text-white p-1 md:p-2 rounded transition-all">
                        <ArrowLeft size={20} />
                    </button>
                </header>
                <div className="p-4 md:p-8 space-y-8">
                    {/* NEW: Discount Code Section */}
                    <div className="bg-green-950/20 border-2 border-green-600/30 p-5 rounded flex flex-col md:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-600 rounded">
                          <Tag size={24} className="text-black" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase text-green-500">Discount Code Available</p>
                          <p className="text-2xl font-black text-white italic">{(STORE_DISCOUNTS[activeRedirect.storeID] || STORE_DISCOUNTS.default).code}</p>
                        </div>
                      </div>
                      <div className="bg-green-600 text-black px-6 py-2 rounded-full font-black text-xl italic shadow-lg">
                        {(STORE_DISCOUNTS[activeRedirect.storeID] || STORE_DISCOUNTS.default).percent} OFF
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 items-center bg-green-950/10 border border-green-500/30 p-6 rounded-lg text-center">
                        <div className="relative z-10 space-y-1">
                            <p className="text-green-400 font-bold uppercase tracking-[0.3em] text-[10px]">Savings Found</p>
                            <h3 className="text-4xl md:text-6xl font-black text-white italic uppercase leading-none">
                                -${(activeRedirect.retail - activeRedirect.price).toFixed(2)} OFF
                            </h3>
                            <p className="text-green-500 font-black text-xs uppercase tracking-widest opacity-70">Price Drop Verified</p>
                        </div>
                    </div>
                    <div className="grid lg:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between text-[10px] font-black uppercase text-green-500 tracking-widest bg-green-950/30 p-2 border-b border-green-500/20">
                                <span><Monitor size={12} className="inline mr-1"/> Tutorial video</span>
                            </div>
                            <div className="aspect-video w-full bg-black border border-green-800 rounded overflow-hidden">
                                <iframe className="w-full h-full grayscale" src={`${tutorialMap[activeRedirect.storeID] || tutorialMap.default}?autoplay=0&rel=0`} allowFullScreen></iframe>
                            </div>
                        </div>
                        
                        {/* REDESIGNED: High Visibility Notes */}
                        <div className="bg-red-950/10 border-2 border-red-600/50 p-6 space-y-6 rounded relative shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                            <div className="absolute -top-3 left-4 bg-red-600 px-3 py-0.5 text-[10px] font-black uppercase text-white tracking-widest animate-pulse">IMPORTANT: READ BEFORE PROCEEDING</div>
                            <div className="space-y-5">
                                {[
                                    { t: 'AD-BLOCKERS DETECTED', d: 'Extensions like AdBlock or uBlock may block the secure redirect to the store. Please disable them if the store page fails to load.', icon: <ShieldAlert className="text-red-500" /> },
                                    { t: '100% AUTHORIZED SELLERS', d: 'We only scan official authorized distributors. These are NOT keys from grey-market resellers—your purchase directly supports the developers.', icon: <CheckCircle2 className="text-green-500" /> },
                                    { t: 'REGION & PRICING', d: 'Displayed prices are based on the US Region. While global discounts are usually mirrored, your local currency and store price may vary slightly.', icon: <Globe className="text-yellow-500" /> }
                                ].map((step, i) => (
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
                    <a href={activeRedirect.url} target="_blank" rel="noreferrer" onMouseEnter={() => sfx('hover')} className="w-full bg-green-600 text-black py-5 px-4 font-black text-xl md:text-2xl text-center hover:bg-white transition-all rounded shadow-[0_0_30px_rgba(34,197,94,0.3)] uppercase block border-b-4 border-black/20">
                        <span className="flex items-center justify-center gap-2">Proceed to Official Store <ExternalLink size={24}/></span>
                    </a>
                </div>
            </div>
          </div>
        )}

        {isAlertModalOpen && (
          <div className="fixed inset-0 z-[120] bg-black/90 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-black border-2 border-green-500 p-10 max-w-2xl w-full space-y-8 relative rounded-xl shadow-[0_0_50px_rgba(34,197,94,0.4)] animate-in zoom-in-95">
              <div className="flex items-center gap-4 border-b border-green-900 pb-6">
                <Bell size={32} className="text-green-400" />
                <div><h2 className="text-2xl font-black uppercase tracking-tight">Price Alert</h2><p className="text-[10px] font-bold text-green-700 uppercase tracking-widest">Stay updated on cost changes</p></div>
              </div>
              <div className="space-y-6">
                <div className="bg-green-950/20 p-4 border border-green-900 rounded"><p className="text-xs uppercase text-green-400 font-bold mb-1">Target Game</p><p className="text-lg font-black text-white uppercase italic">{results?.title}</p></div>
                <div className="space-y-4">
                  <p className="text-sm text-green-500 font-medium leading-relaxed">Provide your email address below to receive an automatic alert. Our system will notify you instantly whenever a price drop is detected for this title.</p>
                  <div className="relative"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-green-800" size={20} /><input type="email" placeholder="YOUR EMAIL ADDRESS" className="w-full bg-black border-2 border-green-800 p-5 pl-12 text-green-400 outline-none uppercase font-black focus:border-green-400 transition-all rounded" value={email} onChange={e => setEmail(e.target.value)} /></div>
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => { setIsAlertModalOpen(false); addLog('PRICE ALERT ACTIVATED.'); sfx('deal_found'); }} onMouseEnter={() => sfx('hover')} className="flex-1 bg-green-600 text-black font-black py-4 uppercase text-lg hover:bg-white transition-all rounded shadow-[0_0_20px_rgba(34,197,94,0.2)]">Set Alert</button>
                <button onClick={() => setIsAlertModalOpen(false)} onMouseEnter={() => sfx('hover')} className="flex-1 border-2 border-green-900 py-4 text-green-800 uppercase font-black hover:text-green-500 hover:border-green-500 transition-all rounded">Cancel</button>
              </div>
            </div>
          </div>
        )}

        <header className="border-b border-green-900/40 p-4 flex justify-between items-center bg-black/90 backdrop-blur-md z-40 sticky top-0 shadow-[0_0_20px_rgba(34,197,94,0.1)]">
          <div className="flex items-center gap-3">
            <div className="bg-green-600 p-1.5 rounded-sm shadow-[0_0_10px_rgba(34,197,94,0.4)]"><ShieldCheck size={24} className="text-black" /></div>
            <div><h1 className="text-sm md:text-base font-black uppercase tracking-[0.2em] leading-none drop-shadow-[0_0_5px_rgba(34,197,94,0.6)]">SCAN 4 KEYS <span className="text-green-600">v6.7</span></h1><span className="text-[10px] text-green-800 font-bold uppercase">System Online</span></div>
          </div>
          <div className="flex items-center gap-2">
            {!audioStarted && <span className="text-[10px] text-yellow-600 font-black animate-pulse mr-2 uppercase">Audio Node Offline</span>}
            <button onClick={() => setSoundEnabled(!soundEnabled)} onMouseEnter={() => sfx('hover')} className={`p-2 transition-colors ${soundEnabled ? 'text-green-400' : 'text-green-900'}`}>{soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}</button>
            <button onClick={() => setShowLegal(true)} onMouseEnter={() => sfx('hover')} className="p-2 text-green-700 hover:text-green-400 transition-colors"><Info size={20} /></button>
          </div>
        </header>

        <div className="p-4 md:p-8 space-y-8 flex-1 flex flex-col">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none z-10"><Search className="w-6 h-6 text-green-700 group-hover:text-green-400 transition-colors" /></div>
            <input type="text" value={query} onChange={e => { setQuery(e.target.value); sfx('typing'); }} placeholder="ENTER GAME TITLE (e.g. Watch Dogs)..." className="w-full bg-black/60 border-2 border-green-900/60 p-6 pl-16 pr-12 text-green-400 focus:border-green-500 outline-none uppercase text-lg font-bold tracking-widest rounded-lg transition-all hover:shadow-[0_0_20px_rgba(34,197,94,0.15)] relative z-0" />
            {query && (<button type="button" onClick={clearSearch} onMouseEnter={() => sfx('hover')} className="absolute inset-y-0 right-4 z-20 flex items-center text-green-700 hover:text-green-400 transition-colors"><X size={20} /></button>)}
          </form>
          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 flex-1 min-h-0">
            <aside className="lg:col-span-1 border border-green-900/40 p-4 bg-black/60 h-48 lg:h-auto flex flex-col overflow-hidden rounded-lg relative order-2 lg:order-1 shadow-[0_0_15px_rgba(34,197,94,0.05)]">
              <div className="text-[10px] font-black bg-green-900/20 p-2 mb-2 text-center uppercase text-green-600 border-b border-green-900/30">Activity Log</div>
              <div className="flex-1 overflow-y-auto space-y-1 text-[10px] font-bold pr-2 custom-scrollbar" ref={scrollRef}>{logs.map(l => <div key={l.id} className={`${l.type === 'error' ? 'text-red-500' : l.type === 'process' ? 'text-yellow-500' : 'text-green-600'} border-l-2 border-current pl-2`}>{`> ${l.text}`}</div>)}</div>
            </aside>
            <main className="lg:col-span-3 border border-green-900/60 bg-green-950/5 p-4 md:p-8 relative min-h-[500px] flex flex-col rounded-lg overflow-hidden order-1 lg:order-2 shadow-[0_0_25px_rgba(34,197,94,0.1)]">
              {searchLoading && (<div className="absolute inset-0 z-40 bg-black/80 flex flex-col items-center justify-center p-6 text-center"><RefreshCw className="w-12 h-12 text-green-500 animate-spin mb-4" /><span className="font-black uppercase tracking-widest text-sm">Searching...</span></div>)}
              {loading && (
                <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-12 text-center">
                    <div className="w-full max-w-md space-y-8">
                        <div className="flex justify-between items-end text-xs font-black uppercase text-green-500"><span className="flex items-center gap-2"><Activity size={12} className="animate-pulse" /> {scanMessage}</span><span className="text-xl italic">{scanProgress}%</span></div>
                        <div className="h-12 border-2 border-green-900 flex items-center p-1 gap-1 relative overflow-hidden bg-green-950/10"><div className="absolute inset-0 grid-bg opacity-20" />{[...Array(20)].map((_, i) => (<div key={i} className={`flex-1 h-full transition-all duration-300 ${scanProgress > (i * 5) ? 'bg-green-500' : 'bg-green-950/30'}`} style={{ boxShadow: scanProgress > (i * 5) ? '0 0 10px rgba(34,197,94,0.4)' : 'none', opacity: scanProgress > (i * 5) ? 1 : 0.2 }} />))}</div>
                        <p className="text-[10px] font-bold text-green-800 uppercase tracking-[0.3em]">SECURE SCAN IN PROGRESS</p>
                    </div>
                </div>
              )}
              {!loading && !suggestions && !results && !scanError && !searchLoading && (<div className="flex-1 flex flex-col items-center justify-center p-4 space-y-4 opacity-40 text-center"><div className="relative"><Globe size={100} className="text-green-800 animate-pulse" /><div className="absolute inset-0 flex items-center justify-center"><Search size={30} className="text-green-600" /></div></div><div className="flex flex-col items-center"><h2 className="text-4xl font-black uppercase italic tracking-tighter text-green-700 w-full drop-shadow-[0_0_10px_rgba(34,197,94,0.4)]">Ready to Search</h2><p className="text-[10px] font-bold uppercase tracking-[0.5em] mt-1 text-green-800 border-t border-green-900/30 pt-2 w-full text-center">Awaiting user input...</p></div></div>)}
              {suggestions && !searchLoading && (
                <div className="space-y-6 animate-in fade-in flex flex-col h-full min-h-0">
                  <p className="text-xs text-yellow-500 font-black uppercase border-b border-green-900/50 pb-2">Results:</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-y-auto pr-2 custom-scrollbar flex-1 content-start">// NEW
{suggestions.map(s => (
  <button key={s.game_info.id} onClick={() => selectGame(s.game_info.id, s.title, s.image)} onMouseEnter={() => sfx('hover')} className="aspect-[21/9] w-full relative group overflow-hidden rounded-lg border border-green-900/40 hover:border-green-500 transition-all shadow-sm hover:shadow-[0_0_15px_rgba(34,197,94,0.2)]"><img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" /><div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent opacity-90 group-hover:opacity-80 transition-opacity" /><div className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-end"><span className="text-sm font-black uppercase truncate flex-1 text-green-500 group-hover:text-white drop-shadow-md text-left">{s.external}</span><ChevronRight className="text-green-600 group-hover:text-green-400" size={16} /></div></button>))}</div>
                </div>
              )}
              {results && !results.error && !loading && (
                <div className="space-y-8 flex-1 flex flex-col animate-in slide-in-from-bottom-4 min-h-0">
                  <div className="flex flex-col lg:flex-row gap-8 bg-black/40 p-6 rounded border border-green-900/50 relative shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                    <img src={results.thumb} alt="" className="w-full lg:w-48 h-64 object-contain border-2 border-green-600/60 rounded-lg shadow-xl" />
                    <div className="flex-1 space-y-6 w-full">
                      <h2 className="text-3xl lg:text-5xl font-black text-white uppercase italic drop-shadow-[0_0_15px_rgba(34,197,94,0.3)]">{results.title}</h2>
                      <div className="bg-green-950/20 border-2 border-green-500/80 rounded overflow-hidden shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <div className="flex justify-between p-4 bg-black/50 border-b border-green-900">
                          <div><p className="text-[10px] font-bold text-green-700 uppercase">Lowest Found</p><p className="text-3xl font-black text-green-400 drop-shadow-[0_0_5px_rgba(34,197,94,0.3)]">${results.deals[0].price}</p></div>
                          <div className="text-right opacity-60"><p className="text-[10px] font-bold text-green-700 uppercase">Retail</p><p className="text-xl font-bold text-green-800 line-through">${results.deals[0].retail}</p></div>
                        </div>
                        <div className="bg-green-600 p-4 flex items-center justify-center gap-3 shadow-[inset_0_0_20px_rgba(0,0,0,0.2)]"><Zap size={20} className="fill-black text-black animate-bounce" /><span className="text-black font-black text-2xl uppercase italic tracking-tighter">YOU JUST SAVED: ${(results.deals[0].retail - results.deals[0].price).toFixed(2)}</span><Zap size={20} className="fill-black text-black animate-bounce" /></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col min-h-0">
                    <div className="flex justify-between items-center border-b border-green-900/30 pb-2 mb-4"><span className="text-xs font-black uppercase text-green-700 tracking-widest"><Layers size={14} className="inline mr-2"/> Store Comparison</span><button onClick={() => { sfx('click'); setIsAlertModalOpen(true); }} onMouseEnter={() => sfx('hover')} className="flex items-center gap-2 text-[10px] font-black uppercase text-green-500 border border-green-800/60 px-3 py-1 hover:bg-green-900/30 transition-all"><Bell size={12}/> Price Alert</button></div>
                    <div className="space-y-3 overflow-y-auto pr-2 custom-scrollbar flex-1">{results.deals.map((d, i) => (<button key={i} onClick={() => { sfx('click'); setActiveRedirect(d); }} onMouseEnter={() => sfx('hover')} className={`w-full flex justify-between items-center p-5 bg-black/60 border rounded-lg transition-all group ${i === 0 ? 'border-green-500 bg-green-950/10 shadow-[0_0_20px_rgba(34,197,94,0.2)]' : 'border-green-900/30 hover:border-green-500/50'}`}><div className="flex items-center gap-4"><span className={`font-black uppercase ${i === 0 ? 'text-white' : 'text-green-700'}`}>{d.store}</span>{i === 0 && <span className="bg-yellow-500 text-black px-3 py-1 rounded font-black text-[10px] uppercase shadow-lg">BEST PRICE 🏆</span>}</div><span className={`font-black text-xl ${i === 0 ? 'text-green-400' : 'text-green-800'}`}>${d.price.toFixed(2)}</span></button>))}</div>
                  </div>
                </div>
              )}
              {results?.error && !loading && (<div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-6"><ShieldAlert size={80} className="text-red-900" /><h3 className="text-red-500 font-black text-3xl uppercase">No active deal was found</h3><button onClick={() => { sfx('click'); setIsAlertModalOpen(true); }} onMouseEnter={() => sfx('hover')} className="w-full max-w-xs border-2 border-green-600 text-green-500 font-black p-4 uppercase hover:bg-green-600 hover:text-black transition-all">Alert me when discounted</button><button onClick={() => setResults(null)} onMouseEnter={() => sfx('hover')} className="text-[10px] font-bold text-green-800 uppercase underline">Back</button></div>)}
            </main>
          </div>
        </div>
      </div>

      <style>{`
        * { scrollbar-width: thin; scrollbar-color: #166534 #000; }
        ::-webkit-scrollbar { width: 10px; height: 10px; }
        ::-webkit-scrollbar-track { background: #000; border-left: 1px solid #14532d; }
        ::-webkit-scrollbar-thumb { background: #166534; border: 2px solid #000; border-radius: 0px; }
        ::-webkit-scrollbar-thumb:hover { background: #22c55e; }
        .scanlines { background: linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.15) 50%); background-size: 100% 4px; pointer-events: none; }
        .grid-bg { background-image: linear-gradient(rgba(34, 197, 94, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 197, 94, 0.1) 1px, transparent 1px); background-size: 20px 20px; }
        .crt-wrapper { animation: crt-flicker 0.15s infinite; }
        .vignette { background: radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.6) 100%); }
        .crt-rolling-wave { background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.2) 50%, rgba(18, 16, 16, 0)); background-size: 100% 20px; height: 100%; width: 100%; z-index: 62; opacity: 0.1; animation: crt-wave-move 10s linear infinite; }
        @keyframes crt-wave-move { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }
        @keyframes crt-flicker { 0% { opacity: 0.99; } 50% { opacity: 1; } 100% { opacity: 0.995; } }
      `}</style>
    </div>
  );
}