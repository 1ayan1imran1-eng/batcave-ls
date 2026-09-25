let ctx: AudioContext | null = null;
let gain: GainNode | null = null;
let started = false;

export async function setRainAudio(on: boolean) {
  if (typeof window === "undefined") return;
  if (!on) {
    if (gain && ctx) {
      gain.gain.setTargetAtTime(0, ctx.currentTime, 0.2);
    }
    return;
  }
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    ctx = new AC();
    const bufferSize = 2 * ctx.sampleRate;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.5;
    }
    const src = ctx.createBufferSource();
    src.buffer = buffer;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 900;
    gain = ctx.createGain();
    gain.gain.value = 0;
    src.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    src.start();
    started = true;
  }
  if (ctx.state === "suspended") await ctx.resume();
  if (gain && started) {
    gain.gain.setTargetAtTime(0.08, ctx.currentTime, 0.25);
  }
}
