let enabled = true;
let context: AudioContext | null = null;
export function setAudioEnabled(value: boolean) { enabled = value; }
export function getAudioEnabled() { return enabled; }
function tone(freq: number, ms: number, delay = 0) {
  if (!enabled) return;
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume().catch(() => {});
    const osc = context.createOscillator(), gain = context.createGain(), start = context.currentTime + delay;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.045, start);
    gain.gain.exponentialRampToValueAtTime(0.001, start + ms / 1000);
    osc.connect(gain); gain.connect(context.destination);
    osc.onended = () => { osc.disconnect(); gain.disconnect(); };
    osc.start(start); osc.stop(start + ms / 1000);
  } catch { /* Sound is optional, classification must still work. */ }
}
export function playCorrect() { tone(660, 110); tone(880, 140, .1); }
export function playWrong() { tone(180, 160); }
