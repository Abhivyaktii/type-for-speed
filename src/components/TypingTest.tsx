import React, { useState, useEffect, useCallback } from 'react';
import { Timer, RefreshCw, BarChart2, Keyboard, Trophy, X, Sun, Moon } from 'lucide-react'; // Import Sun and Moon icons for theme toggle
import TextSelector from './TextSelector';
import TypingDisplay from './TypingDisplay';
import { commonPhrases } from '../data/sampleTexts';
import { calculateAccuracy } from '../utils/typingMetrics';
import type { TypingMetrics } from '../types/typing';
import ProgressBar from './ProgressBar';

export default function TypingTest() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [metrics, setMetrics] = useState<TypingMetrics>({ wpm: 0, accuracy: 100 });
  const [isFinished, setIsFinished] = useState(false);
  const [isPasting, setIsPasting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark'); 

  const generateNewText = useCallback(() => {
    const randomText = commonPhrases[Math.floor(Math.random() * commonPhrases.length)];
    setText(randomText);
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setMetrics({ wpm: 0, accuracy: 100 });
    setProgress(0);
  }, []);

  useEffect(() => {
    generateNewText();
  }, [generateNewText]);

  const calculateWPM = (userInput: string, startTime: number): number => {
    const elapsedTimeInMinutes = (Date.now() - startTime) / 60000; // Convert milliseconds to minutes
    const wordsTyped = userInput.length / 5; // Approximate word count (5 chars per word)
    return elapsedTimeInMinutes > 0 ? Math.round(wordsTyped / elapsedTimeInMinutes) : 0;
  };

  const updateMetrics = useCallback(() => {
    if (startTime) {
      const wpm = calculateWPM(userInput, startTime);
      const accuracy = calculateAccuracy(userInput, text);
      setMetrics({ wpm, accuracy });

      // Update progress based on the length of typed text
      setProgress((userInput.length / text.length) * 100);
    }
  }, [startTime, userInput, text]);

  useEffect(() => {
    if (startTime && userInput.length > 0) {
      const intervalId = setInterval(updateMetrics, 500);
      return () => clearInterval(intervalId);
    }
  }, [userInput, updateMetrics]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserInput(value);

    if (!startTime && value.length === 1) {
      setStartTime(Date.now());
    }

    // Test completion logic: check if text matches exactly
    if (value === text) {
      setIsFinished(true);
      updateMetrics();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    setIsPasting(true);
    setTimeout(() => setIsPasting(false), 1500);
  };

  const handleTextSelect = (newText: string) => {
    setText(newText);
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setMetrics({ wpm: 0, accuracy: 100 });
    setProgress(0);
  };

  const handleClearText = () => {
    setText('');
    setUserInput('');
    setStartTime(null);
    setIsFinished(false);
    setMetrics({ wpm: 0, accuracy: 100 });
    setProgress(0);
  };

  // Toggle theme function
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gradient-to-br from-indigo-50 to-purple-50' : 'bg-gray-800'} py-12`}>
      <div className="max-w-2xl mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between mb-8 animate-slide-in">
          <div className="flex items-center gap-3">
            <Keyboard className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-gray-800">Typing Practice</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={generateNewText}
              title="Refresh"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              title="Clear"
              onClick={handleClearText}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              <X className="w-4 h-4" />
            </button>
            {/* Theme Toggle Button */}
            <button
            title='theme'
              onClick={toggleTheme}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all hover:scale-105 active:scale-95 shadow-md"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <TextSelector onSelectText={handleTextSelect} />

        <div className="bg-white p-6 rounded-xl shadow-lg space-y-4 animate-fade-in">
          <div className="flex justify-between mb-4">
            <div className="flex items-center gap-2 text-gray-600">
              <Timer className="w-5 h-5 text-indigo-600" />
              <span title="Typing speed" className="font-medium text-lg">{metrics.wpm} WPM</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <BarChart2 className="w-5 h-5 text-indigo-600" />
              <span title="Accuracy" className="font-medium text-lg">{metrics.accuracy}%</span>
            </div>
          </div>

          <ProgressBar progress={progress} />

          <TypingDisplay text={text} userInput={userInput} isPasting={isPasting} />

          <input
            type="text"
            value={userInput}
            onChange={handleInputChange}
            onPaste={handlePaste}
            disabled={isFinished}
            className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 transition-all"
            placeholder="Start typing..."
            autoFocus
          />
        </div>

        {isFinished && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-200 rounded-xl shadow-lg relative animate-fade-in">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-green-600 animate-pulse-once" />
              <div>
                <p className="text-xl font-bold text-green-800">Excellent work! 🎉</p>
                <p className="text-green-700">
                  You achieved {metrics.wpm} WPM with {metrics.accuracy}% accuracy.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
