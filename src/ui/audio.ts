// Original procedural soundtrack and effects: Web Audio only, no files, no network, no autoplay.
export type Theme = 'menu' | 'game' | 'finale';
export type Sfx = 'click' | 'pickup' | 'star' | 'badge' | 'fanfare' | 'soft' | 'count' | 'whoosh';
type Song = { bpm: number; chords: number[][]; bass: number[]; lead: number[]; arp: number[]; drums: boolean };

let effects = true, music = false, unlocked = false, paused = false, ducked = false;
let context: AudioContext | null = null;
let musicBus: GainNode | null = null;
let noise: AudioBuffer | null | undefined;
let timer: ReturnType<typeof setInterval> | undefined;
let theme: Theme = 'menu', step = 0, nextTime = 0, lastCount = 0;
const active = new Set<AudioScheduledSourceNode>();
const hz = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

// Eight-note steps; every song loops over four bars (32 steps). 0 = rest.
const songs: Record<Theme, Song> = {
  menu: { bpm: 84, drums: false,
    chords: [[60, 64, 67], [57, 60, 64], [53, 57, 60], [55, 59, 62]],
    bass: [48, 0, 0, 0, 55, 0, 0, 0, 45, 0, 0, 0, 52, 0, 0, 0, 41, 0, 0, 0, 48, 0, 0, 0, 43, 0, 0, 0, 50, 0, 0, 0],
    lead: [76, 0, 0, 74, 72, 0, 74, 0, 72, 0, 0, 69, 67, 0, 0, 0, 69, 0, 72, 0, 77, 0, 76, 0, 74, 0, 0, 72, 71, 0, 0, 0],
    arp: [0, 1, 2, 3, 2, 1, 0, 1] },
  game: { bpm: 100, drums: true,
    chords: [[53, 57, 60], [50, 53, 57], [46, 50, 53], [48, 52, 55]],
    bass: [41, 0, 41, 48, 41, 0, 48, 0, 38, 0, 38, 45, 38, 0, 45, 0, 46, 0, 46, 53, 46, 0, 53, 0, 48, 0, 48, 55, 48, 0, 52, 0],
    lead: [72, 0, 74, 0, 77, 0, 74, 0, 74, 0, 72, 0, 69, 0, 0, 0, 70, 0, 72, 0, 74, 0, 77, 0, 76, 0, 0, 0, 72, 0, 0, 0],
    arp: [0, 2, 1, 3, 0, 2, 1, 2] },
  finale: { bpm: 112, drums: true,
    chords: [[60, 64, 67], [55, 59, 62], [57, 60, 64], [53, 57, 60]],
    bass: [48, 0, 48, 0, 55, 0, 55, 0, 43, 0, 43, 0, 50, 0, 50, 0, 45, 0, 45, 0, 52, 0, 52, 0, 41, 0, 41, 0, 48, 0, 53, 0],
    lead: [67, 0, 72, 0, 76, 0, 79, 0, 79, 0, 76, 0, 74, 0, 0, 0, 72, 0, 76, 0, 81, 0, 79, 0, 77, 0, 76, 0, 74, 0, 72, 0],
    arp: [0, 1, 2, 3, 0, 1, 2, 3] }
};

function ready() {
  try {
    context ??= new AudioContext();
    if (context.state === 'suspended') void context.resume().catch(() => {});
    return context;
  } catch { return null; }
}
function note(ctx: AudioContext, frequency: number, duration: number, volume: number, bus: AudioNode, at = ctx.currentTime, type: OscillatorType = 'sine', track = false, glideTo = 0) {
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = type; osc.frequency.value = frequency;
  if (glideTo) osc.frequency.exponentialRampToValueAtTime?.(glideTo, at + duration);
  gain.gain.setValueAtTime(0, at);
  gain.gain.linearRampToValueAtTime(volume, at + .015);
  gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
  osc.connect(gain); gain.connect(bus);
  if (track) active.add(osc);
  osc.onended = () => { active.delete(osc); osc.disconnect(); gain.disconnect(); };
  osc.start(at); osc.stop(at + duration + .02);
}
function hiss(ctx: AudioContext, at: number, duration: number, volume: number, bus: AudioNode, track = false) {
  if (noise === undefined) {
    try {
      noise = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
      const data = noise.getChannelData(0);
      for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    } catch { noise = null; }
  }
  if (!noise) return;
  try {
    const source = ctx.createBufferSource(), gain = ctx.createGain(), filter = ctx.createBiquadFilter();
    source.buffer = noise; filter.type = 'highpass'; filter.frequency.value = 6500;
    gain.gain.setValueAtTime(volume, at); gain.gain.exponentialRampToValueAtTime(.0001, at + duration);
    source.connect(filter); filter.connect(gain); gain.connect(bus);
    if (track) active.add(source);
    source.onended = () => { active.delete(source); source.disconnect(); gain.disconnect(); };
    source.start(at); source.stop(at + duration);
  } catch { /* Percussion is decorative. */ }
}
function playStep(ctx: AudioContext, song: Song, n: number, at: number, beat: number) {
  const bus = musicBus!, chord = song.chords[Math.floor(n / 8) % song.chords.length];
  if (n % 8 === 0) chord.forEach(m => note(ctx, hz(m), beat * 8, .011, bus, at, 'triangle', true));
  const tones = [...chord, chord[0] + 12];
  note(ctx, hz(tones[song.arp[n % 8]] + 12), beat * 1.6, song.drums ? .012 : .014, bus, at, 'sine', true);
  if (song.bass[n]) note(ctx, hz(song.bass[n]), beat * 1.8, .03, bus, at, 'triangle', true);
  if (song.lead[n]) note(ctx, hz(song.lead[n]), beat * 2.4, .02, bus, at, 'sine', true);
  if (song.drums) {
    if (n % 4 === 0) note(ctx, 120, .22, .07, bus, at, 'sine', true, 45);
    if (n % 2 === 1) hiss(ctx, at, .05, .018, bus, true);
  }
}
function schedule() {
  const ctx = context; if (!ctx || !musicBus) return;
  const song = songs[theme], beat = 60 / song.bpm / 2;
  while (nextTime < ctx.currentTime + .3) {
    playStep(ctx, song, step, nextTime, beat);
    nextTime += beat; step = (step + 1) % song.lead.length;
  }
}
function silence() {
  for (const node of active) { try { node.stop(); } catch { /* already ended */ } }
  active.clear();
}
function stopMusic() {
  clearInterval(timer); timer = undefined;
  silence();
  if (context && musicBus) musicBus.gain.setValueAtTime(0, context.currentTime);
}
function level() { return ducked ? .22 : .6; }
function syncMusic() {
  if (!music || !unlocked || paused || document.hidden) { stopMusic(); return; }
  if (timer) return;
  const ctx = ready(); if (!ctx) return;
  if (!musicBus) { musicBus = ctx.createGain(); musicBus.connect(ctx.destination); }
  musicBus.gain.setValueAtTime(level(), ctx.currentTime);
  nextTime = ctx.currentTime + .06;
  schedule(); timer = setInterval(schedule, 100);
}
export function unlockAudio() { unlocked = true; syncMusic(); }
export function setAudioEnabled(value: boolean) { effects = value; }
export function setMusicEnabled(value: boolean) { music = value; syncMusic(); }
export function setAudioPaused(value: boolean) { paused = value; syncMusic(); }
/** Lowers the soundtrack while feedback dialogs are open, without stopping it. */
export function setMusicDucked(value: boolean) {
  ducked = value;
  if (context && musicBus) musicBus.gain.setTargetAtTime?.(level(), context.currentTime, .12);
}
export function setMusicTheme(next: Theme) {
  if (next === theme) return;
  theme = next; step = 0;
  if (timer && context) { silence(); nextTime = context.currentTime + .08; schedule(); }
}
function sfxContext() { return effects && !document.hidden ? ready() : null; }
export function playCorrect() {
  const ctx = sfxContext(); if (!ctx) return;
  const t = ctx.currentTime;
  [72, 76, 79, 84].forEach((m, i) => note(ctx, hz(m + 12), .22, .045, ctx.destination, t + i * .07));
}
export function playWrong() {
  const ctx = sfxContext(); if (!ctx) return;
  const t = ctx.currentTime;
  note(ctx, hz(63), .16, .035, ctx.destination, t, 'triangle');
  note(ctx, hz(58), .26, .035, ctx.destination, t + .13, 'triangle');
}
export function playSfx(name: Sfx) {
  const ctx = sfxContext(); if (!ctx) return;
  const t = ctx.currentTime, out = ctx.destination;
  switch (name) {
    case 'click': note(ctx, 1400, .05, .02, out, t, 'triangle'); break;
    case 'pickup': note(ctx, 520, .12, .03, out, t, 'sine', false, 900); break;
    case 'whoosh': hiss(ctx, t, .25, .03, out); note(ctx, 700, .22, .012, out, t, 'sine', false, 260); break;
    case 'star': note(ctx, hz(88), .35, .04, out, t); note(ctx, hz(95), .3, .018, out, t + .02); break;
    case 'count':
      if (t - lastCount < .05) return;
      lastCount = t; note(ctx, 1900, .03, .008, out, t, 'square'); break;
    case 'badge': [79, 83, 86, 91, 95].forEach((m, i) => note(ctx, hz(m), .4, .03, out, t + i * .06)); break;
    case 'fanfare': [[67, 0], [72, .14], [76, .28], [79, .42], [84, .62]].forEach(([m, d], i) => note(ctx, hz(m), i === 4 ? .7 : .2, .045, out, t + d, 'triangle')); break;
    case 'soft': [[72, 0], [67, .18], [69, .36]].forEach(([m, d]) => note(ctx, hz(m), .45, .03, out, t + d, 'sine')); break;
  }
}
document.addEventListener('visibilitychange', syncMusic);
