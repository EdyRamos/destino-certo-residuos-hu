import type { Career, Preferences, RankingEntry, SessionState, PhaseResult } from '../types';
import { itemMap, destinations, levels } from '../data';
import version from '../data/version.json';
const prefix = 'destino-certo-v2:' + version.content + ':' + version.rules + ':';
let unavailable = false;
export function storageFailed() { return unavailable; }
function read(key: string): unknown {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : null; }
  catch { unavailable = true; return null; }
}
export function save(key: 'career' | 'ranking' | 'preferences', value: unknown): boolean {
  try { localStorage.setItem(key === 'preferences' ? 'destino-certo-preferences-v2' : prefix + key, JSON.stringify(value)); return true; }
  catch { unavailable = true; return false; }
}
const obj = (x: unknown): x is Record<string, any> => !!x && typeof x === 'object' && !Array.isArray(x);
const integer = (x: unknown, max: number) => Number.isInteger(x) && Number(x) >= 0 && Number(x) <= max;
function validSession(x: unknown): x is SessionState {
  if (!obj(x) || !levels.some(l => l.id === x.levelId) || x.mode !== 'career' || !Array.isArray(x.itemIds) || x.itemIds.length !== 10 || new Set(x.itemIds).size !== 10 || !x.itemIds.every((id: unknown) => typeof id === 'string' && itemMap.get(id)?.enabled) || !integer(x.currentIndex, 10) || typeof x.finished !== 'boolean' || x.finished !== (x.currentIndex === 10) || !Array.isArray(x.answers)) return false;
  if (x.answers.length < x.currentIndex || x.answers.length > Math.min(10, x.currentIndex + 1)) return false;
  return x.answers.every((a: unknown, n: number) => {
    if (!obj(a) || a.itemId !== x.itemIds[n] || !Array.isArray(a.tried) || a.tried.length < 1 || a.tried.length > 3 || new Set(a.tried).size !== a.tried.length || !a.tried.every((id: unknown) => destinations.some(d => d.id === id))) return false;
    const correctId = itemMap.get(a.itemId)!.destinationId;
    const correct = a.tried.at(-1) === correctId;
    return !a.tried.slice(0, -1).includes(correctId) && a.correct === correct && a.completed === (correct || a.tried.length === 3) && a.points === (correct ? [100, 60, 30][a.tried.length - 1] : 0) && (n >= x.currentIndex || a.completed);
  });
}
function validResult(x: unknown, n: number): x is PhaseResult {
  return obj(x) && x.levelId === levels[n]?.id && x.passed === true && integer(x.score, 1000) && integer(x.correct, 10) && x.correct >= 6 && integer(x.firstTry, x.correct) && Array.isArray(x.itemIds) && x.itemIds.length === 10 && new Set(x.itemIds).size === 10 && x.itemIds.every((id: string) => itemMap.has(id));
}
export function loadCareer(): Career | null {
  const x = read(prefix + 'career');
  if (x === null) return null;
  if (!obj(x) || typeof x.id !== 'string' || !Array.isArray(x.results) || x.results.length > 3 || !x.results.every(validResult) || typeof x.submitted !== 'boolean' || !(x.completedAt === null || (typeof x.completedAt === 'string' && Number.isFinite(Date.parse(x.completedAt)))) || (x.results.length === 3) !== (x.completedAt !== null) || (x.submitted && x.results.length !== 3) || !(x.session === null || validSession(x.session)) || (x.session && x.session.levelId !== levels[x.results.length]?.id)) { unavailable = true; return null; }
  return x as Career;
}
export function loadRanking(): RankingEntry[] {
  const x = read(prefix + 'ranking');
  if (x === null) return [];
  if (!Array.isArray(x) || x.length > 20 || new Set(x.map(e => e?.id)).size !== x.length || !x.every(e => obj(e) && typeof e.id === 'string' && typeof e.name === 'string' && e.name.length <= 24 && integer(e.score, 3000) && integer(e.firstTry, 30) && typeof e.endedAt === 'string' && Number.isFinite(Date.parse(e.endedAt)))) { unavailable = true; return []; }
  return x;
}
export function loadPreferences(): Preferences {
  const x = read('destino-certo-preferences-v2');
  return obj(x) && typeof x.sound === 'boolean' && typeof x.reducedMotion === 'boolean' ? x as Preferences : { sound: true, reducedMotion: false };
}
