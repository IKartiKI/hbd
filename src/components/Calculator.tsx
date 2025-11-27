import { useState, useEffect } from 'react';

export function Calculator({ onClose }: { onClose: () => void }) {
  // Close the calculator when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.calculator-container')) {
        onClose();
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);
  const [input, setInput] = useState('');
  const [result, setResult] = useState('0');

  const handleClick = (value: string) => {
    if (value === '=') {
      try {
        if (!input) return;
        // Replace × with * and ÷ with / for evaluation
        const expr = input.replace(/×/g, '*').replace(/÷/g, '/');
        // eslint-disable-next-line no-eval
        const calculated = eval(expr).toString();
        setResult(calculated);
        setInput(calculated);
      } catch {
        setResult('Error');
        setInput('');
      }
    } else if (value === 'C') {
      setInput('');
      setResult('0');
    } else if (value === '⌫') {
      setInput(prev => {
        const newInput = prev.slice(0, -1);
        if (!newInput) setResult('0');
        return newInput;
      });
    } else {
      // Prevent multiple decimal points in a number
      if (value === '.' && input.split(/[+\-×÷]/).pop()?.includes('.')) {
        return;
      }
      // Prevent multiple operators in a row
      const lastChar = input.slice(-1);
      if (['+', '-', '×', '÷'].includes(value) && ['+', '-', '×', '÷', ''].includes(lastChar)) {
        return;
      }
      setInput(prev => prev + value);
    }
  };

  const buttons = [
    'C', '⌫', '%', '÷',
    '7', '8', '9', '×',
    '4', '5', '6', '-',
    '1', '2', '3', '+',
    '0', '.', '='
  ] as const;

  return (
    <div className="calculator-container absolute right-0 bottom-20 w-48 bg-black/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 shadow-2xl z-50">
      <div className="flex justify-between items-center mb-2">
        <div className="text-xs text-white/70">Calculator</div>
        <button 
          onClick={onClose}
          className="text-white/70 hover:text-white text-xs"
          aria-label="Close calculator"
        >
          ✕
        </button>
      </div>
      <div className="bg-black/50 rounded p-2 text-right mb-2">
        <div className="text-xs text-gray-400 h-4 overflow-x-auto whitespace-nowrap">{input || '0'}</div>
        <div className="text-xl font-mono overflow-x-auto whitespace-nowrap">{result}</div>
      </div>
      <div className="grid grid-cols-4 gap-1 text-sm">
        {buttons.map(btn => {
          // Special styling for different button types
          let buttonClass = 'p-2 rounded-md ';
          if (btn === '=') {
            buttonClass += 'bg-blue-500 hover:bg-blue-600';
          } else if (btn === 'C') {
            buttonClass += 'bg-red-500/90 hover:bg-red-600';
          } else if (isNaN(Number(btn)) && !['.', '⌫'].includes(btn)) {
            buttonClass += 'bg-white/10 hover:bg-white/20';
          } else {
            buttonClass += 'bg-white/5 hover:bg-white/10';
          }
          
          return (
            <button
              key={btn}
              onClick={() => handleClick(btn)}
              className={buttonClass}
            >
              {btn === '×' ? '×' : btn === '÷' ? '÷' : btn}
            </button>
          );
        })}
      </div>
    </div>
  );
}
