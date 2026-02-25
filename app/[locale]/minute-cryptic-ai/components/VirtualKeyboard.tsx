import React from 'react';
import { Delete } from 'lucide-react';

interface VirtualKeyboardProps {
  onKeyPress: (key: string) => void;
  onDelete: () => void;
}

const KEYS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ onKeyPress, onDelete }) => {
  return (
    <div className="w-full max-w-2xl mx-auto p-2 pb-6 select-none">
      <div className="flex flex-col gap-2">
        {KEYS.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center gap-1.5">
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                className="
                  h-12 w-8 sm:w-10 md:w-12 
                  bg-white rounded-md shadow-sm border border-gray-200
                  text-lg font-semibold text-gray-700
                  active:bg-gray-100 active:scale-95 transition-transform
                  flex items-center justify-center
                "
              >
                {key}
              </button>
            ))}
            {/* Add Backspace to the last row */}
            {rowIndex === 2 && (
              <button
                onClick={onDelete}
                className="
                  h-12 w-10 sm:w-12 md:w-14
                  bg-gray-100 rounded-md shadow-sm border border-gray-200
                  text-gray-600
                  active:bg-gray-200 active:scale-95 transition-transform
                  flex items-center justify-center
                "
              >
                <Delete size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};