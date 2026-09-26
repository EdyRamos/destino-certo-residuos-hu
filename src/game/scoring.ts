export const POINTS = [100, 60, 30] as const;
export const PASS_CORRECT = 6;
export function scoreForAttempt(attempt: number): number { return POINTS[attempt - 1] ?? 0; }
