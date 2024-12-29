import React from 'react';
import { codingPhrases, commonPhrases, paragraphs } from '../data/sampleTexts';

type Props = {
  onSelectText: (newText: string) => void;
};

const TextSelector = ({ onSelectText }: Props) => {
  const handleSelection = (category: string) => {
    let text: string;
    switch (category) {
      case 'common':
        text = commonPhrases.length ? commonPhrases[Math.floor(Math.random() * commonPhrases.length)] : 'No common phrases available';
        break;
      case 'coding':
        text = codingPhrases.length ? codingPhrases[Math.floor(Math.random() * codingPhrases.length)] : 'No coding phrases available';
        break;
      case 'paragraph':
        text = paragraphs.length ? paragraphs[Math.floor(Math.random() * paragraphs.length)] : 'No paragraphs available';
        break;
      default:
        text = '';
    }
    onSelectText(text);
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      <button
        onClick={() => handleSelection('common')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Common Phrases
      </button>
      <button
        onClick={() => handleSelection('coding')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Coding Phrases
      </button>
      <button
        onClick={() => handleSelection('paragraph')}
        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
      >
        Paragraphs
      </button>
    </div>
  );
};

export default TextSelector;
