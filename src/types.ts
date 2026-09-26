export type Destination = { id: string; name: string; shortName: string; colorToken: string; symbol: string; feedback: string };
export type WasteItem = {
  id: string; name: string; destinationId: string; emoji: string; image: string | null;
  source: { file: string; page: number }; explanation: string; contentStatus: string;
  requiresInstitutionalValidation: boolean; condition: string; hint: string;
  difficulty: number; commonConfusion: boolean; enabled: boolean; technicalReference: string;
  reviewNote: string; originalName: string; originalDestinationId: string;
};
export type Level = { id: string; name: string; description: string; questionCount: number; pool: string[] };
export type Answer = { itemId: string; tried: string[]; correct: boolean; completed: boolean; points: number };
export type SessionState = { levelId: string; mode: 'career' | 'practice'; itemIds: string[]; currentIndex: number; answers: Answer[]; finished: boolean };
export type PhaseResult = { levelId: string; score: number; correct: number; firstTry: number; itemIds: string[]; passed: boolean };
export type Career = { id: string; results: PhaseResult[]; session: SessionState | null; submitted: boolean; completedAt: string | null };
export type RankingEntry = { id: string; name: string; score: number; firstTry: number; endedAt: string };
export type Preferences = { sound: boolean; reducedMotion: boolean };
