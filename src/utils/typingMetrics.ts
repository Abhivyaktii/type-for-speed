// import { TypingMetrics } from '../types/typing';

export function calculateWPM(userInput: string, targetText: string, startTime: number): number {
  const timeElapsed = (Date.now() - startTime) / 1000 / 60; // in minutes
  if (timeElapsed === 0) return 0;

  // Split both texts into words
  const targetWords = targetText.trim().split(/\s+/);
  const userWords = userInput.trim().split(/\s+/);
  
  // Count correct words
  let correctWords = 0;
  for (let i = 0; i < userWords.length; i++) {
    if (i < targetWords.length && userWords[i] === targetWords[i]) {
      correctWords++;
    }
  }

  return Math.round(correctWords / timeElapsed);
}

export function calculateAccuracy(userInput: string, targetText: string): number {
  if (!userInput.length) return 100;
  
  let correctChars = 0;
  const inputLength = userInput.length;
  
  for (let i = 0; i < inputLength; i++) {
    if (userInput[i] === targetText[i]) {
      correctChars++;
    }
  }
  
  return Math.round((correctChars / inputLength) * 100);
}

