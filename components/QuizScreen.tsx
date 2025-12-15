
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QUESTIONS, getCategoryByindex } from '../constants';
import GenYouBot from './GenYouBot';
import { StudentResult } from '../types';
import { saveResult } from '../services/storageService';

interface Props {
  studentName: string;
  studentId: string;
  onComplete: (result: StudentResult) => void;
  onCancel: () => void;
}

const QuizScreen: React.FC<Props> = ({ studentName, studentId, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [direction, setDirection] = useState(0);

  const handleAnswer = (choice: 'A' | 'B' | 'N') => {
    const newAnswers = [...answers, choice];
    setDirection(1);
    
    if (currentIdx < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setTimeout(() => setCurrentIdx(currentIdx + 1), 150);
    } else {
      calculateAndFinish(newAnswers);
    }
  };

  const calculateAndFinish = (finalAnswers: string[]) => {
    let scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };

    finalAnswers.forEach((ans, idx) => {
      const category = getCategoryByindex(idx); 
      
      const addScore = (type1: keyof typeof scores, type2: keyof typeof scores) => {
        if (ans === 'A') scores[type1] += 1;
        else if (ans === 'B') scores[type2] += 1;
        else {
          // Neutral adds 0.5 to both, or 0. Since we want a result, let's add 0.5 to keep balance
          scores[type1] += 0.5;
          scores[type2] += 0.5;
        }
      };

      if (category === 'EI') addScore('E', 'I');
      else if (category === 'SN') addScore('S', 'N');
      else if (category === 'TF') addScore('T', 'F');
      else if (category === 'JP') addScore('J', 'P');
    });

    const mbti = [
      scores.E >= scores.I ? 'E' : 'I',
      scores.S >= scores.N ? 'S' : 'N',
      scores.T >= scores.F ? 'T' : 'F',
      scores.J >= scores.P ? 'J' : 'P'
    ].join('');

    const result: StudentResult = {
      id: Date.now().toString(),
      name: studentName,
      studentId,
      type: 'MBTI',
      mbtiType: mbti,
      mbtiScores: scores,
      timestamp: Date.now()
    };

    saveResult(result);
    onComplete(result);
  };

  const currentQ = QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / QUESTIONS.length) * 100;
  
  // Colors for dynamic styling
  const colors = ['bg-pink-100', 'bg-blue-100', 'bg-green-100', 'bg-yellow-100'];
  const currentColor = colors[currentIdx % colors.length];

  return (
    <div className={`w-full h-screen flex flex-col p-4 relative font-hand overflow-hidden ${currentColor} transition-colors duration-500`}>
       {/* Header */}
      <div className="flex justify-between items-center mb-4 z-10">
        <button onClick={onCancel} className="text-black font-bold border-2 border-black bg-white px-3 py-1 rounded-lg hover:bg-red-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          ❌ Thoát
        </button>
        <div className="flex-1 mx-4 h-6 bg-white border-2 border-black rounded-full overflow-hidden relative">
          <motion.div 
            className="h-full bg-stripes-teal"
            style={{ 
              background: `repeating-linear-gradient(45deg, #4fd1c5, #4fd1c5 10px, #38b2ac 10px, #38b2ac 20px)` 
            }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
          />
        </div>
        <span className="font-black text-xl text-black">{currentIdx + 1}/{QUESTIONS.length}</span>
      </div>

      {/* Question Card */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 max-w-md mx-auto w-full">
        <GenYouBot mood="thinking" className="absolute -top-8 z-20" />
        
        <AnimatePresence mode='wait' custom={direction}>
          <motion.div
            key={currentIdx}
            initial={{ x: 300, rotate: 5, opacity: 0 }}
            animate={{ x: 0, rotate: 0, opacity: 1 }}
            exit={{ x: -300, rotate: -5, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full"
          >
            <div className="bg-white border-4 border-black shadow-comic rounded-3xl p-6 min-h-[420px] flex flex-col justify-center items-center relative">
               {/* Staple decoration */}
               <div className="absolute top-2 left-1/2 -translate-x-1/2 w-4 h-8 border-l-2 border-r-2 border-gray-400 opacity-50"></div>

              <h2 className="text-3xl md:text-4xl font-black text-black text-center mb-8 uppercase tracking-tight leading-tight">
                {/* Short question Text A vs Text B */}
                <span className="text-teal-600 block">{currentQ.textA}</span>
                <span className="text-sm text-gray-400 my-1">hay</span>
                <span className="text-purple-600 block">{currentQ.textB}</span>
                <span className="text-3xl">?</span>
              </h2>

              <div className="grid gap-4 w-full">
                <button 
                  onClick={() => handleAnswer('A')}
                  className="w-full py-4 bg-teal-100 hover:bg-teal-200 border-4 border-black rounded-xl text-2xl font-bold text-black shadow-comic active:translate-y-1 active:shadow-none transition-all"
                >
                  {currentQ.textA}
                </button>

                <div className="flex justify-center -my-2">
                   <button 
                    onClick={() => handleAnswer('N')}
                    className="text-xs font-bold text-gray-500 bg-gray-100 px-4 py-2 rounded-full border-2 border-gray-300 hover:bg-gray-200 hover:border-gray-400"
                   >
                     Khó chọn quá (Trung lập)
                   </button>
                </div>

                <button 
                  onClick={() => handleAnswer('B')}
                  className="w-full py-4 bg-purple-100 hover:bg-purple-200 border-4 border-black rounded-xl text-2xl font-bold text-black shadow-comic active:translate-y-1 active:shadow-none transition-all"
                >
                  {currentQ.textB}
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center text-gray-600 font-hand text-lg font-bold">
        Đừng nghĩ nhiều, chọn cái đầu tiên nảy ra trong đầu á!
      </div>
      
      {/* Background decoration */}
      <div className="absolute bottom-0 left-0 w-full h-20 bg-repeat-x opacity-20" style={{ backgroundImage: 'radial-gradient(circle, #000 2px, transparent 2px)', backgroundSize: '10px 10px' }}></div>
    </div>
  );
};

export default QuizScreen;
