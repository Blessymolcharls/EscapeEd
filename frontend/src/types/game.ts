export type ScreenState = 'landing' | 'playing' | 'escaped';

export type InteractiveObjectId = 'clue_tome' | 'puzzle_terminal' | 'exit_door' | 'bookshelf';

export interface InteractiveObjectInfo {
  id: InteractiveObjectId;
  name: string;
  description: string;
}

export interface PuzzleInfo {
  id: string;
  title: string;
  room_name: string;
  instruction: string;
  code: string;
  hint: string;
  interactive_clue_object: string;
}

export interface VerificationResult {
  correct: boolean;
  message: string;
  unlocked: boolean;
  hint?: string | null;
}

export interface GameProgress {
  clueDiscovered: boolean;
  puzzleSolved: boolean;
  exitUnlocked: boolean;
  attemptsCount: number;
  startTime: number | null;
  completionTime: number | null;
}
