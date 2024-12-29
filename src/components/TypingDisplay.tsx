import { useRef, useEffect, useState } from 'react';

interface TypingDisplayProps {
  text: string;
  userInput: string;
  isPasting: boolean;
}

export default function TypingDisplay({ text, userInput, isPasting }: TypingDisplayProps) {
  const [displayText, setDisplayText] = useState(text);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCharRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    setDisplayText(text); // Update displayText whenever 'text' prop changes
  }, [text]);

  useEffect(() => {
    if (activeCharRef.current && containerRef.current) {
      const container = containerRef.current;
      const activeChar = activeCharRef.current;
      const containerRect = container.getBoundingClientRect();
      const charRect = activeChar.getBoundingClientRect();

      if (charRect.top < containerRect.top || charRect.bottom > containerRect.bottom) {
        activeChar.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }
    }
  }, [userInput]);

  const handlePaste = (event: React.ClipboardEvent) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData('text');
    // Append the pasted text to existing text if not finished
    if (!isPasting) {
      setDisplayText((prevText) => prevText + pastedText);
    }
  };

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className="bg-white shadow-md p-6 rounded-lg mb-4 h-40 overflow-y-auto border border-gray-300 
                   text-xl font-mono leading-relaxed tracking-wide relative space-y-2"
        onPaste={handlePaste}
      >
        <p>
          {displayText.split('').map((char, index) => {
            let className =
              'inline-block px-0.5 transition-all duration-150 ease-in-out transform ';
            if (index < userInput.length) {
              className += userInput[index] === char
                ? 'text-green-600 font-semibold scale-110'
                : 'text-red-600 font-semibold underline decoration-red-400';
            } else {
              className += 'text-gray-600';
            }
            if (index === userInput.length) {
              className +=
                ' typing-cursor border-b-2 border-indigo-600 animate-pulse';
            }
            return (
              <span
                key={index}
                ref={index === userInput.length ? activeCharRef : null}
                className={className}
              >
                {char}
              </span>
            );
          })}
        </p>
      </div>
      {isPasting && (
        <div
          className="absolute top-0 left-0 right-0 bg-red-500/90 text-white px-4 py-2 rounded-t-lg text-center 
                     font-medium shadow-lg animate-fade-in-out"
        >
          🚫 Pasting is not allowed
        </div>
      )}
    </div>
  );
}
