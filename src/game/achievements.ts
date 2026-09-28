import type { Answer, PhaseResult, SessionState } from '../types';
// Cosmetic rewards only: they never change points, approval or ranking.
export type AchievementId = 'perfect' | 'streak' | 'learn';
export type Achievement = { id: AchievementId; title: string; description: string };

/** 1 star when approved, 2 with 8+ correct items, 3 with all 10 correct and 900+ points. */
export function stars(result: Pick<PhaseResult, 'correct' | 'score' | 'passed'>): 0 | 1 | 2 | 3 {
  if (!result.passed) return 0;
  if (result.correct === 10 && result.score >= 900) return 3;
  return result.correct >= 8 ? 2 : 1;
}
const firstTry = (a: Answer) => a.completed && a.correct && a.tried.length === 1;
/** Consecutive first-try hits ending at the last completed question. */
export function currentStreak(answers: Answer[]): number {
  let n = 0;
  for (const a of answers.filter(a => a.completed).reverse()) { if (!firstTry(a)) break; n++; }
  return n;
}
export function bestStreak(answers: Answer[]): number {
  let best = 0, run = 0;
  for (const a of answers) { run = firstTry(a) ? run + 1 : 0; best = Math.max(best, run); }
  return best;
}
export function phaseAchievements(session: SessionState): Achievement[] {
  const answers = session.answers, list: Achievement[] = [];
  if (answers.length === session.itemIds.length && answers.every(firstTry))
    list.push({ id: 'perfect', title: 'Fase perfeita', description: 'Todos os itens certos na primeira tentativa.' });
  const best = bestStreak(answers);
  if (best >= 5) list.push({ id: 'streak', title: 'Sequência de primeira', description: `${best} acertos seguidos na primeira tentativa.` });
  if (answers.some(a => a.correct && a.tried.length > 1))
    list.push({ id: 'learn', title: 'Aprendeu com o erro', description: 'Usou a dica e encontrou o destino certo.' });
  return list;
}
