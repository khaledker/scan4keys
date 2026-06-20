import { useState, useCallback, useRef } from 'react';

export function useScan() {
  const [scanProgress, setScanProgress] = useState(0);
  const [scanMessage, setScanMessage] = useState('INITIALIZING...');
  const [isScanning, setIsScanning] = useState(false);
  const cancelledRef = useRef(false);

  const runScan = useCallback(async (onProgress) => {
    let progress = 0;
    const isRare = Math.random() < 0.1;
    const totalDuration = isRare ? 6000 + Math.random() * 700 : 4000 + Math.random() * 700;
    const tickRate = 50;
    const totalTicks = totalDuration / tickRate;
    const incrementBase = 100 / totalTicks;

    cancelledRef.current = false;

    while (progress < 100) {
      await new Promise(r => setTimeout(r, tickRate));
      if (cancelledRef.current) return false;
      progress += incrementBase + (Math.random() * 0.5 - 0.25);
      if (progress > 100) progress = 100;
      onProgress(Math.floor(progress));
      if (progress < 30) setScanMessage('CONNECTING...');
      else if (progress < 70) setScanMessage('INDEXING PRICES...');
      else if (progress < 100) setScanMessage('FINALIZING...');
      else setScanMessage('SUCCESS.');
    }
    return true;
  }, []);

  const startScan = useCallback(async (onProgress) => {
    setIsScanning(true);
    setScanProgress(0);
    setScanMessage('INITIALIZING...');
    const success = await runScan(onProgress);
    setIsScanning(false);
    return success;
  }, [runScan]);

  const cancelScan = useCallback(() => {
    cancelledRef.current = true;
    setIsScanning(false);
  }, []);

  return { scanProgress, scanMessage, isScanning, startScan, cancelScan, setScanProgress, setScanMessage };
}
