import React, { useState, useEffect, useCallback } from 'react';
import { generatePuzzles } from './services/geminiService';
import { Puzzle, GameState, FeedbackStatus } from './types';
import { VirtualKeyboard } from './components/VirtualKeyboard';
import { PuzzleGrid } from './components/PuzzleGrid';
import { Info, ArrowLeft, HelpCircle, Check, Loader2, Lightbulb } from 'lucide-react';

export default function App() {
  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [gameState, setGameState] = useState<GameState>({
    currentPuzzleIndex: 0,
    guesses: {},
    solvedStatus: {},
    hintsUsed: {},
    loading: true,
    error: null,
  });
  const [feedback, setFeedback] = useState<FeedbackStatus>('idle');
  const [showExplanation, setShowExplanation] = useState(false);

  // Initial Load
  useEffect(() => {
    const loadGame = async () => {
      const data = await generatePuzzles();
      setPuzzles(data);
      setGameState(prev => ({ ...prev, loading: false }));
    };
    loadGame();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const currentPuzzle = puzzles[gameState.currentPuzzleIndex];
  const currentGuess = gameState.guesses[gameState.currentPuzzleIndex] || '';
  const isSolved = gameState.solvedStatus[gameState.currentPuzzleIndex];
  const hintUsed = gameState.hintsUsed[gameState.currentPuzzleIndex];

  // Logic to handle input
  const handleInput = useCallback((char: string) => {
    if (isSolved || !currentPuzzle) return;

    setFeedback('idle');
    const maxLength = currentPuzzle.answer.length;
    
    setGameState(prev => {
      const currentVal = prev.guesses[prev.currentPuzzleIndex] || '';
      if (currentVal.length >= maxLength) return prev;
      
      return {
        ...prev,
        guesses: {
          ...prev.guesses,
          [prev.currentPuzzleIndex]: currentVal + char
        }
      };
    });
  }, [currentPuzzle, isSolved]);

  const handleDelete = useCallback(() => {
    if (isSolved) return;
    setFeedback('idle');
    setGameState(prev => {
      const currentVal = prev.guesses[prev.currentPuzzleIndex] || '';
      return {
        ...prev,
        guesses: {
          ...prev.guesses,
          [prev.currentPuzzleIndex]: currentVal.slice(0, -1)
        }
      };
    });
  }, [isSolved]);

  // Physical Keyboard listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        handleDelete();
      } else if (/^[a-zA-Z]$/.test(e.key)) {
        handleInput(e.key.toUpperCase());
      } else if (e.key === 'Enter') {
        checkAnswer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleInput, handleDelete]); // Added dependencies to fix lint warning, though relying on functional updates is safer

  const checkAnswer = () => {
    if (!currentPuzzle || isSolved) return;

    if (currentGuess === currentPuzzle.answer) {
      setFeedback('correct');
      setGameState(prev => ({
        ...prev,
        solvedStatus: { ...prev.solvedStatus, [prev.currentPuzzleIndex]: true }
      }));
      setShowExplanation(true);
    } else {
      setFeedback('incorrect');
      setTimeout(() => setFeedback('idle'), 500);
    }
  };

  const revealHint = () => {
    if (!currentPuzzle || isSolved) return;
    
    // Reveal first letter or random unrevealed letter? Let's do first unrevealed.
    const answer = currentPuzzle.answer;
    let nextCharIndex = 0;
    while(nextCharIndex < answer.length && currentGuess[nextCharIndex] === answer[nextCharIndex]) {
        nextCharIndex++;
    }

    if (nextCharIndex < answer.length) {
        const charToReveal = answer[nextCharIndex];
        // Construct new guess preserving correct prefix
        const newGuess = answer.slice(0, nextCharIndex + 1);
        
        setGameState(prev => ({
            ...prev,
            guesses: { ...prev.guesses, [prev.currentPuzzleIndex]: newGuess },
            hintsUsed: { ...prev.hintsUsed, [prev.currentPuzzleIndex]: true }
        }));
    }
  };

  const nextPuzzle = () => {
    if (gameState.currentPuzzleIndex < puzzles.length - 1) {
      setGameState(prev => ({
        ...prev,
        currentPuzzleIndex: prev.currentPuzzleIndex + 1
      }));
      setFeedback('idle');
      setShowExplanation(false);
    }
  };
  
  const prevPuzzle = () => {
    if (gameState.currentPuzzleIndex > 0) {
      setGameState(prev => ({
        ...prev,
        currentPuzzleIndex: prev.currentPuzzleIndex - 1
      }));
      setFeedback('idle');
      setShowExplanation(false);
    }
  };

  if (gameState.loading) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col items-center justify-center text-brand-text">
        <Loader2 className="animate-spin mb-4 text-brand-text" size={48} />
        <h2 className="text-xl font-serif">Generating Cryptics...</h2>
        <p className="text-sm opacity-60 mt-2">Consulting the AI setter</p>
      </div>
    );
  }

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text font-sans selection:bg-brand-accent selection:text-black flex flex-col">
      
      {/* Header */}
      <header className="p-4 flex items-center justify-between max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-4">
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="font-bold text-sm sm:text-base leading-tight">{dateStr}</h1>
            <p className="text-xs opacity-70">By Gemini AI</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button className="p-2 hover:bg-white/20 rounded-full transition-colors">
            <Info size={24} />
          </button>
          <div className="w-8 h-8 bg-black text-white flex items-center justify-center font-serif font-bold rounded text-lg">
            M
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center max-w-2xl mx-auto w-full px-4 pt-4 sm:pt-10">
        
        {/* Clue Card */}
        <div className="w-full bg-brand-card rounded-xl shadow-hard p-6 sm:p-8 mb-8 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-purple-500" />
          
          <h2 className="text-xl sm:text-2xl font-serif leading-relaxed mb-2">
            {currentPuzzle?.clue} ({currentPuzzle?.answer.length})
          </h2>
          
          {isSolved && showExplanation && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-blue-800 animate-in fade-in slide-in-from-top-2">
              <span className="font-bold block mb-1 flex items-center gap-2">
                <Lightbulb size={16} /> Parsing:
              </span>
              {currentPuzzle?.explanation}
            </div>
          )}
        </div>

        {/* Answer Grid */}
        <PuzzleGrid 
            length={currentPuzzle?.answer.length || 0}
            currentGuess={currentGuess}
            status={feedback}
        />

        {/* Progress Dots */}
        <div className="flex gap-2 mb-2">
          {puzzles.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setGameState(prev => ({ ...prev, currentPuzzleIndex: idx }));
                setShowExplanation(false);
                setFeedback('idle');
              }}
              className={`
                w-3 h-3 rounded-full transition-all
                ${idx === gameState.currentPuzzleIndex 
                  ? 'bg-black scale-125' 
                  : gameState.solvedStatus[idx] 
                    ? 'bg-brand-success' 
                    : 'bg-white/50 hover:bg-white/80'}
              `}
            />
          ))}
        </div>
        <div className="text-xs font-bold italic opacity-60 mb-8">
            par {gameState.currentPuzzleIndex + 1} of {puzzles.length}
        </div>

        {/* Controls */}
        <div className="flex gap-4 mb-auto">
            {!isSolved ? (
                <>
                <button 
                    onClick={revealHint}
                    className="
                        bg-brand-accent text-black font-bold py-3 px-8 rounded-full 
                        shadow-hard border-2 border-black
                        hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none
                        transition-all flex items-center gap-2
                    "
                >
                    <HelpCircle size={18} /> hints
                </button>
                <button 
                    onClick={checkAnswer}
                    className="
                        bg-brand-primary text-white font-bold py-3 px-8 rounded-full 
                        shadow-hard border-2 border-black
                        hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none
                        transition-all flex items-center gap-2
                    "
                >
                    <Check size={18} /> check
                </button>
                </>
            ) : (
                <button 
                    onClick={nextPuzzle}
                    disabled={gameState.currentPuzzleIndex >= puzzles.length - 1}
                    className="
                        bg-black text-white font-bold py-3 px-12 rounded-full 
                        shadow-hard border-2 border-transparent
                        hover:translate-y-0.5 hover:shadow-hard-sm active:translate-y-1 active:shadow-none
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-all
                    "
                >
                    Next Puzzle
                </button>
            )}
        </div>

        {/* Keyboard */}
        <div className="w-full mt-4">
            <VirtualKeyboard onKeyPress={handleInput} onDelete={handleDelete} />
        </div>

      </main>
    </div>
  );
}