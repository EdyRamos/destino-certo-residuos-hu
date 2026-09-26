import type { Career, PhaseResult, RankingEntry } from '../types';
export function newCareer(): Career { return { id: crypto.randomUUID(), results: [], session: null, submitted: false, completedAt: null }; }
export function completePhase(career: Career, result: PhaseResult): Career {
  if (!result.passed || career.results.some(r => r.levelId === result.levelId)) return { ...career, session: null };
  const results = [...career.results, result];
  return { ...career, results, session: null, completedAt: results.length === 3 ? new Date().toISOString() : null };
}
export function careerEntry(c: Career, name = 'Participante'): RankingEntry {
  return { id: c.id, name: name.trim().slice(0, 24) || 'Participante', score: c.results.reduce((n, r) => n + r.score, 0), firstTry: c.results.reduce((n, r) => n + r.firstTry, 0), endedAt: c.completedAt! };
}
export function sortRanking(entries: RankingEntry[]): RankingEntry[] {
  return [...entries].sort((a, b) => b.score - a.score || b.firstTry - a.firstTry || a.endedAt.localeCompare(b.endedAt));
}
export function addRanking(entries: RankingEntry[], candidate: RankingEntry): RankingEntry[] {
  if (entries.some(e => e.id === candidate.id)) return entries;
  return sortRanking([...entries, candidate]).slice(0, 20);
}
export function qualifies(entries: RankingEntry[], candidate: RankingEntry): boolean { return addRanking(entries, candidate).some(e => e.id === candidate.id); }
