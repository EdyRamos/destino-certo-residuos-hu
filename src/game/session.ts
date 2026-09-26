import type { Answer, Level, PhaseResult, SessionState, WasteItem } from '../types';
import { PASS_CORRECT, scoreForAttempt } from './scoring';
export function shuffle<T>(input: T[], rng = Math.random): T[] {
  const out = [...input];
  for (let i = out.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); [out[i], out[j]] = [out[j], out[i]]; }
  return out;
}
// Round-robin destinations preserves breadth. Previously seen items are deferred.
export function selectItems(pool: WasteItem[], count: number, seen: string[] = [], rng = Math.random): string[] {
  const available = shuffle(pool.filter(i => i.enabled), rng);
  const selected: WasteItem[] = [];
  for (const candidates of [available.filter(i => !seen.includes(i.id)), available.filter(i => seen.includes(i.id))]) {
    const groups = new Map<string, WasteItem[]>();
    candidates.forEach(i => groups.set(i.destinationId, [...(groups.get(i.destinationId) ?? []), i]));
    while ([...groups.values()].some(g => g.length) && selected.length < count) {
      for (const key of shuffle([...groups.keys()], rng)) {
        const item = groups.get(key)!.pop();
        if (item && selected.length < count) selected.push(item);
      }
    }
  }
  if (selected.length < count) throw new Error('Conteúdo insuficiente para iniciar a fase.');
  return selected.map(i => i.id);
}
export function createSession(level: Level, items: WasteItem[], mode: SessionState['mode'], seen: string[] = [], rng = Math.random): SessionState {
  const pool = items.filter(i => i.enabled && level.pool.includes(i.id));
  let anchors: string[] = [];
  if (level.id === 'nivel_2') {
    // Keep both members of these contrasts in the same session, even after shuffling.
    anchors = [['white_13', 'black_05'], ['hamper_03', 'hamper_04']]
      .filter(pair => pair.every(id => pool.some(i => i.id === id))).flat();
  }
  if (level.id === 'nivel_3') {
    const advanced = pool.filter(i => i.difficulty === 3);
    anchors = selectItems(advanced, Math.min(4, advanced.length), seen, rng);
  }
  const rest = selectItems(pool.filter(i => !anchors.includes(i.id)), level.questionCount - anchors.length, seen, rng);
  const itemIds = shuffle([...anchors, ...rest], rng);
  return { levelId: level.id, mode, itemIds, currentIndex: 0, answers: [], finished: false };
}
export function currentAnswer(state: SessionState): Answer | undefined { return state.answers[state.currentIndex]; }
export function applyAnswer(state: SessionState, destinationId: string, item: WasteItem): SessionState {
  if (state.finished || state.itemIds[state.currentIndex] !== item.id) return state;
  const previous = currentAnswer(state);
  if (previous?.completed || previous?.tried.includes(destinationId)) return state;
  const tried = [...(previous?.tried ?? []), destinationId];
  const correct = destinationId === item.destinationId;
  const answer: Answer = { itemId: item.id, tried, correct, completed: correct || tried.length === 3, points: correct ? scoreForAttempt(tried.length) : 0 };
  const answers = [...state.answers]; answers[state.currentIndex] = answer;
  return { ...state, answers };
}
export function advance(state: SessionState): SessionState {
  if (state.finished || !currentAnswer(state)?.completed) return state;
  const currentIndex = state.currentIndex + 1;
  return { ...state, currentIndex, finished: currentIndex === state.itemIds.length };
}
export function summarize(state: SessionState): PhaseResult {
  const correct = state.answers.filter(a => a.correct).length;
  return { levelId: state.levelId, correct, score: state.answers.reduce((n, a) => n + a.points, 0), firstTry: state.answers.filter(a => a.correct && a.tried.length === 1).length, itemIds: [...state.itemIds], passed: state.finished && correct >= PASS_CORRECT };
}
