import { useCallback } from 'react';
import { playSound } from '../utils/sound';

export function useSfx(audioCtxRef, soundEnabled) {
  const sfx = useCallback((type) => {
    if (soundEnabled) playSound(type, audioCtxRef.current);
  }, [audioCtxRef, soundEnabled]);

  return { sfx };
}
