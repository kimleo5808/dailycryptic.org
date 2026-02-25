import React from 'react';

interface PuzzleGridProps {
  length: number;
  currentGuess: string;
  status: 'idle' | 'correct' | 'incorrect';
}

export const PuzzleGrid: React.FC<PuzzleGridProps> = ({ length, currentGuess, status }) => {
  const slots = Array.from({ length });

  return (
    <div className={`flex justify-center gap-2 mb-8 ${status === 'incorrect' ? 'wiggle' : ''}`}>
      {slots.map((_, index) => {
        const char = currentGuess[index] || '';
        const isFilled = char.length > 0;
        
        let borderColor = 'border-black';
        let bgColor = 'bg-white';
        let textColor = 'text-black';

        if (status === 'correct') {
          borderColor = 'border-brand-success';
          bgColor = 'bg-green-100';
          textColor = 'text-green-800';
        } else if (status === 'incorrect' && isFilled) {
           // We only show red border momentarily via parent animation, 
           // but we can tint the cells if fully filled
           if (currentGuess.length === length) {
              borderColor = 'border-brand-error';
              bgColor = 'bg-red-50';
           }
        }

        return (
          <div
            key={index}
            className={`
              w-10 h-12 sm:w-12 sm:h-14 md:w-14 md:h-16
              border-2 ${borderColor}
              ${bgColor}
              rounded-md
              flex items-center justify-center
              text-2xl sm:text-3xl font-bold ${textColor}
              transition-all duration-200
              ${status === 'correct' ? 'pop' : ''}
              shadow-hard-sm
            `}
            style={{
                transitionDelay: `${index * 50}ms`
            }}
          >
            {char}
          </div>
        );
      })}
    </div>
  );
};