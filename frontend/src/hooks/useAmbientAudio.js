import { useEffect, useRef, useState } from 'react';

export function useAmbientAudio() {
  const [audioStarted, setAudioStarted] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const ambientGainRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
  }, [soundEnabled]);

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
    const startAudio = () => {
      if (ctx.state === 'suspended') ctx.resume();
      setAudioStarted(true);
      if (soundEnabledRef.current) gain.gain.setTargetAtTime(0.04, ctx.currentTime, 3);
      window.removeEventListener('click', startAudio);
    };
    window.addEventListener('click', startAudio);
    return () => { osc1.stop(); osc2.stop(); lfo.stop(); window.removeEventListener('click', startAudio); };
  }, []);

  useEffect(() => {
    if (ambientGainRef.current && audioStarted) {
      ambientGainRef.current.gain.setTargetAtTime(
        soundEnabled ? 0.04 : 0,
        audioCtxRef.current.currentTime,
        0.5
      );
    }
  }, [soundEnabled, audioStarted]);

  return { audioCtxRef, audioStarted, soundEnabled, setSoundEnabled };
}
