import { describe, it, expect } from 'vitest';
import { items, levels } from '../src/data';
import { createSession, applyAnswer, advance } from '../src/game/session';
import { stars, currentStreak, bestStreak, phaseAchievements } from '../src/game/achievements';
import type { SessionState } from '../src/types';
const wrong = (correct: string) => ['white_bag', 'hamper', 'red_bag', 'green_bag', 'black_bag', 'sharps'].filter(d => d !== correct);
// plan[n] = number of wrong attempts before answering item n (3 = missed).
function play(plan: number[]): SessionState {
  let s = createSession(levels[0], items, 'career', [], () => .4);
  for (const errors of plan) {
    const item = items.find(i => i.id === s.itemIds[s.currentIndex])!;
    for (const d of wrong(item.destinationId).slice(0, errors)) s = applyAnswer(s, d, item);
    if (errors < 3) s = applyAnswer(s, item.destinationId, item);
    s = advance(s);
  }
  return s;
}
describe('recompensas cosméticas', () => {
  it.each([[{ passed: false, correct: 5, score: 500 }, 0], [{ passed: true, correct: 6, score: 600 }, 1], [{ passed: true, correct: 8, score: 800 }, 2], [{ passed: true, correct: 10, score: 880 }, 2], [{ passed: true, correct: 10, score: 900 }, 3]] as const)('estrelas de %o = %i', (r, n) => expect(stars(r)).toBe(n));
  it('fase perfeita reúne perfeição e sequência, sem aprendizado com erro', () => {
    const s = play(Array(10).fill(0));
    expect(phaseAchievements(s).map(a => a.id)).toEqual(['perfect', 'streak']);
    expect(bestStreak(s.answers)).toBe(10);
  });
  it('sequência atual zera após erro e aprendizado aparece ao acertar depois de errar', () => {
    const s = play([0, 0, 1, 0, 0, 3, 0, 0, 0, 0]);
    expect(currentStreak(s.answers)).toBe(4); expect(bestStreak(s.answers)).toBe(4);
    expect(phaseAchievements(s).map(a => a.id)).toEqual(['learn']);
  });
  it('tentativa em andamento não quebra a sequência atual', () => {
    let s = play([0, 0]);
    const item = items.find(i => i.id === s.itemIds[s.currentIndex])!;
    s = applyAnswer(s, wrong(item.destinationId)[0], item);
    expect(currentStreak(s.answers)).toBe(2);
  });
});
