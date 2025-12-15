
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IQ_QUESTIONS, getIQClassification } from '../constants';
import GenYouBot from './GenYouBot';
import { StudentResult } from '../types';
import { saveResult } from '../services/storageService';

interface Props {
  studentName: string;
  studentId: string;
  onComplete: (result: StudentResult) => void;
  onCancel: () => void;
}

const IQQuizScreen: React.FC<Props> = ({ studentName, studentId, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  
  const currentQ = IQ_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / IQ_QUESTIONS.length) * 100;

  // Background colors loop
  const bgColors = ['bg-blue-50', 'bg-cyan-50', 'bg-sky-50', 'bg-indigo-50', 'bg-violet-50'];
  const currentColor = bgColors[currentIdx % bgColors.length];

  const handleAnswer = (option: string) => {
    if (selectedOption) return; // Prevent double clicks
    setSelectedOption(option);

    const isCorrect = option === currentQ.correctAnswer;
    const newScore = isCorrect ? score + 1 : score;
    setScore(newScore);

    // Delay for animation
    setTimeout(() => {
        if (currentIdx < IQ_QUESTIONS.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
        } else {
            finishQuiz(newScore);
        }
    }, 500);
  };

  const finishQuiz = (finalScore: number) => {
    const classification = getIQClassification(finalScore);

    const result: StudentResult = {
        id: Date.now().toString(),
        name: studentName,
        studentId,
        type: 'IQ',
        iqScore: finalScore,
        iqClassification: classification.label,
        timestamp: Date.now()
    };
    saveResult(result);
    onComplete(result);
  };

  // Distinct colors for 4 options
  const optionColors = [
    'bg-cyan-100 border-cyan-300 hover:bg-cyan-200',
    'bg-emerald-100 border-emerald-300 hover:bg-emerald-200',
    'bg-purple-100 border-purple-300 hover:bg-purple-200',
    'bg-rose-100 border-rose-300 hover:bg-rose-200',
  ];

  return (
    <div className={`w-full h-screen flex flex-col p-4 relative font-hand overflow-hidden transition-colors duration-500 ${currentColor}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10">
        <button onClick={onCancel} className="text-black font-bold border-2 border-black bg-white px-3 py-1 rounded-lg hover:bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ❌ Thoát
        </button>
        <div className="flex-1 mx-4">
           <div className="h-6 bg-white border-2 border-black rounded-full overflow-hidden relative">
            <motion.div 
                className="h-full bg-stripes-teal"
                style={{ 
                  background: `repeating-linear-gradient(45deg, #60a5fa, #60a5fa 10px, #3b82f6 10px, #3b82f6 20px)` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
           </div>
           <p className="text-center text-xs font-bold mt-1 text-blue-800">Câu hỏi {currentIdx + 1}/{IQ_QUESTIONS.length}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-2xl mx-auto">
        <GenYouBot mood="thinking" className="relative -mb-10 z-20 w-24 h-24" />

        <AnimatePresence mode='wait'>
            <motion.div
                key={currentIdx}
                initial={{ x: 200, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -200, opacity: 0 }}
                className="w-full"
            >
                <div className="bg-white border-4 border-black shadow-comic rounded-3xl p-6 min-h-[400px] flex flex-col relative justify-between">
                    {/* Category Tag */}
                    <span className="absolute top-4 right-4 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-200">
                        {currentQ.category}
                    </span>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 mt-8 text-center leading-snug">
                        {currentQ.text}
                    </h2>

                    {/* 2x2 Grid for Options */}
                    <div className="grid grid-cols-2 gap-4 w-full">
                        {currentQ.options.map((opt, idx) => {
                            const isSelected = selectedOption === opt;
                            // Default distinct pastel style
                            let btnClass = `${optionColors[idx % 4]} text-gray-800`;
                            
                            if (isSelected) {
                                // Selected style overrides color
                                btnClass = "bg-blue-600 text-white border-blue-800 scale-95 ring-4 ring-blue-200";
                            }

                            return (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={selectedOption !== null}
                                    className={`
                                        w-full py-6 rounded-xl border-4 text-xl font-bold transition-all duration-200
                                        ${btnClass} shadow-sm active:shadow-none
                                        ${selectedOption === null ? 'border-black hover:-translate-y-1 hover:shadow-comic' : ''}
                                    `}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
      </div>
      
      <div className="mt-4 text-center text-blue-900/50 font-bold text-sm">
        Tập trung cao độ nha! 🧠
      </div>
    </div>
  );
};

export default IQQuizScreen;
