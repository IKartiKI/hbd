import { useState } from 'react';

export function Calculator({ onClose }: { onClose: () => void }) {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');

  const handleClick = (value: string) => {
    if (value === '=') {
      try {
        // Replace × with * and ÷ with / for evaluation
        const expr = input.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        setResult(eval(expr));
        setInput(eval(expr));
      } catch {
        setResult('Error');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === '⌫') {
      setInput(prev => prev.slice(0, -1));
    } else {
      setInput(prev => prev + value);
    }
  };

  const buttons = [
    'C', '⌫', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ];

  return (
    <div className="absolute right-0 bottom-20 w-48 bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 shadow-2xl z-50">
      <div className="bg-black/50 rounded p-2 text-right mb-2">
        <div className="text-xs text-gray-400 h-4">{input || '0'}</div>
        <div className="text-xl">{result}</div>
      </div>
      <div className="grid grid-cols-4 gap-1">
        {buttons.map(btn => (
          <button
            key={btn}
            onClick={() => handleClick(btn)}
            className={`p-2 rounded-md ${
              btn === '=' ? 'bg-blue-500' : 
              isNaN(Number(btn)) ? 'bg-white/10' : 'bg-white/5'
            } hover:bg-white/20`}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
}
