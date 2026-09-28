import { beforeEach, afterEach, it, expect, vi } from 'vitest';

let hidden = false;
let visibility: () => void;
let created = 0, starts = 0, stops = 0;
const param = () => ({ value: 0, setValueAtTime: vi.fn(), linearRampToValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() });
class FakeAudioContext {
  state = 'running'; currentTime = 0; destination = {};
  constructor() { created++; }
  resume() { return Promise.resolve(); }
  createGain() { return { gain: param(), connect: vi.fn(), disconnect: vi.fn() }; }
  createOscillator() { return { frequency: param(), connect: vi.fn(), disconnect: vi.fn(), start: () => { starts++; }, stop: () => { stops++; }, onended: null }; }
}
beforeEach(() => {
  vi.resetModules(); vi.useFakeTimers(); hidden = false; created = starts = stops = 0;
  vi.stubGlobal('AudioContext', FakeAudioContext);
  vi.stubGlobal('document', { get hidden() { return hidden; }, addEventListener: (_: string, cb: () => void) => { visibility = cb; } });
});
afterEach(() => { vi.clearAllTimers(); vi.useRealTimers(); vi.unstubAllGlobals(); });

it('só inicia música após gesto e não multiplica intervalos ou contextos', async () => {
  const audio = await import('../src/ui/audio');
  audio.setMusicEnabled(true); expect(created).toBe(0);
  audio.unlockAudio(); const initial = starts;
  audio.unlockAudio(); audio.setMusicEnabled(true);
  expect(starts).toBe(initial); expect(created).toBe(1); expect(vi.getTimerCount()).toBe(1);
  audio.setMusicEnabled(false); expect(vi.getTimerCount()).toBe(0);
  vi.advanceTimersByTime(1000); expect(starts).toBe(initial);
});
it('interrompe trilha ao pausar ou ocultar e respeita silêncio ao retornar', async () => {
  const audio = await import('../src/ui/audio');
  audio.unlockAudio(); audio.setMusicEnabled(true);
  audio.setAudioPaused(true); const initial = starts;
  vi.advanceTimersByTime(2000); expect(starts).toBe(initial); expect(stops).toBeGreaterThan(0);
  hidden = true; visibility(); audio.setAudioPaused(false); expect(starts).toBe(initial);
  hidden = false; visibility(); expect(starts).toBeGreaterThan(initial);
  audio.setMusicEnabled(false); hidden = true; visibility(); hidden = false; visibility();
  expect(vi.getTimerCount()).toBe(0);
});
it('efeitos independem da trilha e falha de áudio não bloqueia o jogo', async () => {
  const audio = await import('../src/ui/audio');
  audio.setAudioEnabled(false); audio.playCorrect(); expect(starts).toBe(0);
  audio.playSfx('fanfare'); expect(starts).toBe(0);
  audio.setAudioEnabled(true); audio.playCorrect(); const correct = starts; expect(correct).toBeGreaterThan(0);
  audio.playWrong(); expect(starts).toBeGreaterThan(correct); expect(vi.getTimerCount()).toBe(0);
  const before = starts; hidden = true; audio.playCorrect(); audio.playSfx('star'); expect(starts).toBe(before);
});
it('navegador sem AudioContext continua sem lançar erro', async () => {
  vi.stubGlobal('AudioContext', undefined);
  const audio = await import('../src/ui/audio');
  expect(() => { audio.unlockAudio(); audio.setMusicEnabled(true); audio.playCorrect(); }).not.toThrow();
});
it('troca de tema e diálogo não reiniciam contexto nem multiplicam agendadores', async () => {
  const audio = await import('../src/ui/audio');
  audio.unlockAudio(); audio.setMusicEnabled(true);
  audio.setMusicTheme('game'); audio.setMusicDucked(true); audio.setMusicTheme('finale'); audio.setMusicDucked(false);
  expect(created).toBe(1); expect(vi.getTimerCount()).toBe(1);
  audio.setMusicEnabled(false); audio.setMusicTheme('menu'); expect(vi.getTimerCount()).toBe(0);
});
