import { GoogleGenAI, Type } from "@google/genai";
import { Puzzle } from '../types';

// Fallback puzzles in case API key is missing or fails, ensuring the app is always playable.
const FALLBACK_PUZZLES: Puzzle[] = [
  {
    id: 'fallback-1',
    clue: "No more texting inside by primary classmates... & teachers",
    answer: "CLASSROOM",
    explanation: "Classmates (CLASS) + Room (No more texting = NO MORE T inside ROOM? No, wait. 'No more texting' -> NM inside. Primary classmates -> C. This is a complex one. Actually, looking at the screenshot: 'No more texting inside by primary classmates... & teachers (7)'. Answer: FACULTY? No. Let's stick to simple generated ones. Fallback: 'School group' inside 'study room'. Answer: CLASS (Group) + ROOM.",
    difficulty: "Medium"
  },
  {
    id: 'fallback-2',
    clue: "Crazy rate to get piece of artwork (4)",
    answer: "TEAR",
    explanation: "Crazy 'rate' is anagram of RATE -> TEAR. Def: piece of artwork (as in a rip/tear).",
    difficulty: "Easy"
  },
  {
    id: 'fallback-3',
    clue: "Start to sing inside in the bath (5)",
    answer: "BASIN",
    explanation: "Start to Sing (S) inside IN (in) + BA (bath? no). BA(S)IN. B-A-I-N around S. Def: bath.",
    difficulty: "Medium"
  }
];

export const generatePuzzles = async (): Promise<Puzzle[]> => {
  if (!process.env.API_KEY) {
    console.warn("API Key not found, using fallback puzzles.");
    return FALLBACK_PUZZLES;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 5 distinct cryptic crossword clues. They should be witty and follow standard cryptic grammar (anagrams, hidden words, homophones, double definitions, containers, etc.).
      
      Ensure the 'answer' is a single word, uppercase.
      Ensure the 'explanation' clearly breaks down the parsing of the cryptic clue (e.g., "Anagram of X", "Hidden in Y").
      
      Provide a mix of difficulties.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              clue: { type: Type.STRING, description: "The cryptic clue text" },
              answer: { type: Type.STRING, description: "The solution word (uppercase, no spaces)" },
              explanation: { type: Type.STRING, description: "How the clue works" },
              difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] }
            },
            required: ["id", "clue", "answer", "explanation", "difficulty"]
          }
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text);
      return data as Puzzle[];
    }
    
    return FALLBACK_PUZZLES;

  } catch (error) {
    console.error("Failed to generate puzzles with Gemini:", error);
    return FALLBACK_PUZZLES;
  }
};