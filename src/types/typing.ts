export interface TypingMetrics {
  wpm: number;
  accuracy: number;
}

export interface TypingStats {
  text: string;
  userInput: string;
  startTime: number | null;
  isFinished: boolean;
}