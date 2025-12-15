
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DISC_QUESTIONS } from '../constants';
import GenYouBot from './GenYouBot';
import { StudentResult } from '../types';
import { saveResult } from '../services/storageService';

interface Props {
  studentName: string;
  studentId: string;
  onComplete: (result: StudentResult) => void;
  onCancel: () => void;
}

const DISCQuizScreen: React.FC<Props> = ({ studentName, studentId, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ D: 0, I: 0, S: 0, C: 0 });
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  // Background colors loop
  const bgColors = ['bg-orange-50', 'bg-red-50', 'bg-amber-50', 'bg-yellow-50', 'bg-rose-50'];
  const currentColor = bgColors[currentIdx % bgColors.length];

  const handleAnswer = (type: 'A'|'B'|'C'|'D') => {
    if (selectedOption !== null) return;
    setSelectedOption(type);

    // Map A->D, B->I, C->S, D->C
    const map = { A: 'D', B: 'I', C: 'S', D: 'C' };
    const discType = map[type] as 'D' | 'I' | 'S' | 'C';

    setTimeout(() => {
        const newScores = { ...scores, [discType]: (scores[discType] || 0) + 1 };
        setScores(newScores);

        if (currentIdx < DISC_QUESTIONS.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
        } else {
            finishQuiz(newScores);
        }
    }, 400);
  };

  const finishQuiz = (finalScores: Record<string, number>) => {
    // Find dominant type
    const entries = Object.entries(finalScores);
    // Sort descending by score
    entries.sort((a, b) => b[1] - a[1]);
    const dominantType = entries[0][0]; // 'D', 'I', 'S', or 'C'

    const result: StudentResult = {
        id: Date.now().toString(),
        name: studentName,
        studentId,
        type: 'DISC',
        discType: dominantType,
        discScores: finalScores as any,
        timestamp: Date.now()
    };

    saveResult(result);
    onComplete(result);
  };

  const currentQ = DISC_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / DISC_QUESTIONS.length) * 100;

  // Use persistent colors for options
  const options = [
    { key: 'A', text: currentQ.options.A, color: 'bg-red-100 border-red-300 hover:bg-red-200' },
    { key: 'B', text: currentQ.options.B, color: 'bg-yellow-100 border-yellow-300 hover:bg-yellow-200' },
    { key: 'C', text: currentQ.options.C, color: 'bg-green-100 border-green-300 hover:bg-green-200' },
    { key: 'D', text: currentQ.options.D, color: 'bg-blue-100 border-blue-300 hover:bg-blue-200' },
  ];

  return (
    <div className={`w-full h-screen flex flex-col p-4 relative font-hand overflow-hidden transition-colors duration-500 ${currentColor}`}>
       {/* Header */}
       <div className="flex justify-between items-center mb-2 z-10">
        <button onClick={onCancel} className="text-black font-bold border-2 border-black bg-white px-3 py-1 rounded-lg hover:bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ❌ Thoát
        </button>
        <div className="flex-1 mx-4">
           <div className="h-6 bg-white border-2 border-black rounded-full overflow-hidden relative">
            <motion.div 
                className="h-full bg-stripes-teal"
                style={{ 
                    background: `repeating-linear-gradient(45deg, #f87171, #f87171 10px, #ef4444 10px, #ef4444 20px)` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
           </div>
           <p className="text-center text-xs font-bold mt-1 text-red-700">Câu hỏi {currentIdx + 1}/{DISC_QUESTIONS.length}</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-2xl mx-auto">
        <GenYouBot mood="thinking" className="relative -mb-10 z-20 w-24 h-24" />

        <AnimatePresence mode='wait'>
            <motion.div
                key={currentIdx}
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-full"
            >
                <div className="bg-white border-4 border-black shadow-comic rounded-3xl p-6 min-h-[450px] flex flex-col justify-center items-center text-center relative">
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-orange-200">
                        DISC Assessment
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 mt-8 text-center leading-snug">
                        "{currentQ.text}"
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        {options.map((opt) => (
                             <button
                                key={opt.key}
                                onClick={() => handleAnswer(opt.key as any)}
                                disabled={selectedOption !== null}
                                className={`
                                    w-full p-4 rounded-2xl border-4 text-left font-bold transition-all relative overflow-hidden group
                                    ${opt.color} shadow-sm
                                    ${selectedOption === opt.key ? 'ring-4 ring-black scale-95 border-black' : 'border-gray-300 hover:-translate-y-1 hover:shadow-comic border-black'}
                                    ${selectedOption !== null && selectedOption !== opt.key ? 'opacity-50' : 'opacity-100'}
                                `}
                            >
                                <div className="flex items-center justify-center gap-3 relative z-10 text-center w-full">
                                    <span className="text-sm md:text-base leading-tight text-gray-900">{opt.text}</span>
                                </div>
                             </button>
                        ))}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center text-red-900/50 font-bold text-sm">
         Chọn đáp án giống bạn nhất nhé!
      </div>
    </div>
  );
};

export default DISCQuizScreen;
