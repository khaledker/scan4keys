import { useState, useEffect, useCallback } from 'react';
import { fetchStores } from './utils/api';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { useSfx } from './hooks/useSfx';
import { useSearch } from './hooks/useSearch';
import { useScan } from './hooks/useScan';
import MatrixRain from './components/MatrixRain';
import CrtEffects from './components/CrtEffects';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import ActivityLog from './components/ActivityLog';
import SearchLoading from './components/SearchLoading';
import ScanProgress from './components/ScanProgress';
import GameGrid from './components/GameGrid';
import PriceComparison from './components/PriceComparison';
import ReadyState from './components/ReadyState';
import NoDeal from './components/NoDeal';
import PriceAlertModal from './components/PriceAlertModal';
import RedirectModal from './components/RedirectModal';

export default function App() {
  const [logs, setLogs] = useState([]);
  const [activeRedirect, setActiveRedirect] = useState(null);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = useCallback((text, type = 'info') => {
    setLogs(p => [...p, { text, type, id: Date.now() + Math.random() }]);
  }, []);

  const { audioCtxRef, audioStarted, soundEnabled, setSoundEnabled } = useAmbientAudio();
  const { sfx } = useSfx(audioCtxRef, soundEnabled);
  const {
    query, setQuery, suggestions,
    results, setResults, searchLoading,
    handleSearch: rawHandleSearch, clearSearch, selectGame
  } = useSearch();
  const { scanProgress, scanMessage, isScanning, startScan } = useScan();

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchStores();
        if (data?.results?.length > 0) {
          addLog('NETWORK CONNECTION ESTABLISHED.', 'success');
        }
      } catch {
        addLog('STORE DATA UNAVAILABLE.', 'error');
      }
    })();
  }, [addLog]);

  const handleSearch = useCallback((e) => {
    if (e) e.preventDefault();
    rawHandleSearch(sfx, addLog);
  }, [rawHandleSearch, sfx, addLog]);

  const handleClear = useCallback(() => {
    clearSearch(sfx);
    setResults(null);
    setLogs([]);
  }, [clearSearch, sfx, setResults]);

  const handleSelectGame = useCallback(async (id, title, image) => {
    setIsLoading(true);
    await selectGame(id, title, image, sfx, addLog, () => startScan((p) => {}));
    setIsLoading(false);
  }, [selectGame, sfx, addLog, startScan]);

  const handleSelectStore = useCallback((deal) => {
    setActiveRedirect(deal);
  }, []);

  const handleOpenAlert = useCallback(() => {
    setIsAlertModalOpen(true);
  }, []);

  const handleCloseAlert = useCallback(() => {
    setIsAlertModalOpen(false);
    addLog('PRICE ALERT ACTIVATED.');
  }, [addLog]);

  const handleBack = useCallback(() => {
    setResults(null);
    sfx('click');
  }, [sfx, setResults]);

  const showContent = !suggestions && !results && !isLoading;
  const showScan = isScanning || isLoading;

  return (
    <div className="min-h-screen bg-[#050505] text-green-500 font-mono relative selection:bg-green-900 overflow-y-auto custom-scrollbar h-screen crt-wrapper">
      <MatrixRain />
      <CrtEffects />

      <div className="max-w-7xl mx-auto border-x border-green-800/40 bg-black/95 flex flex-col min-h-screen relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)] crt-content">
        {activeRedirect && (
          <RedirectModal redirect={activeRedirect} onClose={() => setActiveRedirect(null)} sfx={sfx} />
        )}

        {isAlertModalOpen && (
          <PriceAlertModal results={results} onClose={handleCloseAlert} sfx={sfx} />
        )}

        <Header
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          audioStarted={audioStarted}
          sfx={sfx}
          onLegalClick={() => {}}
        />

        <div className="p-4 md:p-8 space-y-8 flex-1 flex flex-col">
          <SearchBar query={query} setQuery={setQuery} onSubmit={handleSearch} onClear={handleClear} sfx={sfx} />

          <div className="flex flex-col lg:grid lg:grid-cols-4 gap-8 flex-1 min-h-0">
            <ActivityLog logs={logs} />

            <main className="lg:col-span-3 border border-green-900/60 bg-green-950/5 p-4 md:p-8 relative min-h-[500px] flex flex-col rounded-lg overflow-hidden order-1 lg:order-2 shadow-[0_0_25px_rgba(34,197,94,0.1)]">
              {searchLoading && <SearchLoading />}
              {showScan && <ScanProgress scanProgress={scanProgress} scanMessage={scanMessage} />}
              {showContent && <ReadyState />}
              {suggestions && !searchLoading && !isScanning && (
                <GameGrid suggestions={suggestions} onSelect={handleSelectGame} sfx={sfx} />
              )}
              {results && !results.error && !isScanning && !isLoading && (
                <PriceComparison
                  results={results}
                  onSelectStore={handleSelectStore}
                  onOpenAlert={handleOpenAlert}
                  sfx={sfx}
                />
              )}
              {results?.error && !isScanning && !isLoading && (
                <NoDeal results={results} onOpenAlert={handleOpenAlert} onBack={handleBack} sfx={sfx} />
              )}
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
