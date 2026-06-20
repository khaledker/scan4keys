export function playSound(type, audioCtx) {
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
