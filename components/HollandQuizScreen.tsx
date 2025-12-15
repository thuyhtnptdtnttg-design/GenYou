
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HOLLAND_QUESTIONS } from '../constants';
import GenYouBot from './GenYouBot';
import { StudentResult } from '../types';
import { saveResult } from '../services/storageService';

interface Props {
  studentName: string;
  studentId: string;
  onComplete: (result: StudentResult) => void;
  onCancel: () => void;
}

// Custom SVG Face Component to match the reference image
const HollandFace = ({ index }: { index: number }) => {
  // Common Face Circle (The "yolk")
  const FaceBase = ({ color }: { color: string }) => (
    <circle cx="50" cy="50" r="35" fill={color} stroke="#b45309" strokeWidth="2" />
  );
  
  switch (index) {
    case 0: // Angry - Pink Ring
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#fce7f3" stroke="#f472b6" strokeWidth="2" /> {/* Ring */}
          <FaceBase color="#fb923c" /> {/* Darker orange face */}
          {/* Eyebrows */}
          <path d="M35 45 L 45 50" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 45 L 55 50" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          {/* Eyes */}
          <circle cx="40" cy="55" r="4" fill="#4a0404" />
          <circle cx="60" cy="55" r="4" fill="#4a0404" />
          {/* Mouth */}
          <path d="M40 70 Q 50 65 60 70" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 1: // Sad - Peach Ring
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#ffedd5" stroke="#fb923c" strokeWidth="2" />
          <FaceBase color="#fdba74" />
           {/* Eyes (Puppy) */}
          <circle cx="38" cy="52" r="5" fill="#4a0404" />
          <circle cx="62" cy="52" r="5" fill="#4a0404" />
          <circle cx="40" cy="50" r="2" fill="white" />
          <circle cx="64" cy="50" r="2" fill="white" />
          {/* Mouth */}
          <path d="M40 72 Q 50 65 60 72" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          {/* Eyebrows */}
           <path d="M35 40 Q 40 35 45 42" fill="none" stroke="#4a0404" strokeWidth="2" strokeLinecap="round" />
           <path d="M65 40 Q 60 35 55 42" fill="none" stroke="#4a0404" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2: // Neutral - Yellow Ring
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#fef9c3" stroke="#facc15" strokeWidth="2" />
          <FaceBase color="#fde047" />
          {/* Eyes */}
          <circle cx="38" cy="50" r="4" fill="#4a0404" />
          <circle cx="62" cy="50" r="4" fill="#4a0404" />
          <circle cx="38" cy="50" r="1.5" fill="white" />
          <circle cx="62" cy="50" r="1.5" fill="white" />
           {/* Mouth */}
          <line x1="42" y1="70" x2="58" y2="70" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 3: // Happy - Blue Ring
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
          <FaceBase color="#fde047" />
           {/* Eyes (Arches) */}
          <path d="M35 50 Q 40 45 45 50" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M55 50 Q 60 45 65 50" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          {/* Mouth */}
          <path d="M35 65 Q 50 80 65 65" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          {/* Cheeks */}
          <circle cx="30" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
          <circle cx="70" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
        </svg>
      );
    case 4: // Love - Green Ring
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#dcfce7" stroke="#4ade80" strokeWidth="2" />
          <FaceBase color="#fde047" />
          {/* Heart Eyes */}
          <path d="M32 50 C 32 45, 40 45, 40 50 C 40 45, 48 45, 48 50 C 48 58, 40 62, 40 62 C 40 62, 32 58, 32 50" fill="#ef4444" />
          <path d="M52 50 C 52 45, 60 45, 60 50 C 60 45, 68 45, 68 50 C 68 58, 60 62, 60 62 C 60 62, 52 58, 52 50" fill="#ef4444" />
          {/* Mouth */}
          <path d="M35 70 Q 50 85 65 70 Z" fill="#4a0404" />
          <path d="M42 76 Q 50 80 58 76" fill="#ef4444" /> {/* Tongue */}
        </svg>
      );
    default: return null;
  }
}

const HollandQuizScreen: React.FC<Props> = ({ studentName, studentId, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 });
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  
  // Background colors loop
  const bgColors = ['bg-red-50', 'bg-blue-50', 'bg-purple-50', 'bg-orange-50', 'bg-yellow-50', 'bg-teal-50'];
  const currentColor = bgColors[Math.floor(currentIdx / 10) % bgColors.length];

  const handleAnswer = (points: number) => {
    if (selectedOption !== null) return; // Prevent double clicking
    setSelectedOption(points);

    // Add a small delay for the animation to play
    setTimeout(() => {
      const currentQ = HOLLAND_QUESTIONS[currentIdx];
      
      // Calculate new scores locally to ensure accuracy for the final step
      const newScores = {
        ...scores,
        [currentQ.category]: scores[currentQ.category] + points
      };
      
      setScores(newScores);
  
      // Next question or finish
      if (currentIdx < HOLLAND_QUESTIONS.length - 1) {
        setCurrentIdx(currentIdx + 1);
        setSelectedOption(null);
      } else {
        finishQuiz(newScores); 
      }
    }, 400);
  };

  const finishQuiz = (finalScores: Record<string, number>) => {
    // Sort categories by score
    const sortedCategories = Object.entries(finalScores)
      .sort(([, a], [, b]) => b - a)
      .map(([cat]) => cat);

    // Top 3 create the code (e.g., RIA)
    const hollandCode = sortedCategories.slice(0, 3).join('');

    const result: StudentResult = {
      id: Date.now().toString(),
      name: studentName,
      studentId,
      type: 'HOLLAND',
      hollandCode,
      hollandScores: finalScores as any,
      timestamp: Date.now()
    };

    saveResult(result);
    onComplete(result);
  };

  const currentQ = HOLLAND_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / HOLLAND_QUESTIONS.length) * 100;

  const emojiOptions = [
    { score: 0, label: 'Không thích' },
    { score: 1, label: '' },
    { score: 2, label: 'Bình thường' },
    { score: 3, label: '' },
    { score: 4, label: 'Rất thích' },
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
                background: `repeating-linear-gradient(45deg, #fbbf24, #fbbf24 10px, #f59e0b 10px, #f59e0b 20px)` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
           </div>
           <p className="text-center text-xs font-bold mt-1">Nhóm {currentQ.category} - Câu {currentIdx + 1}/60</p>
        </div>
      </div>

      {/* Main Card */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-2xl mx-auto">
        <GenYouBot mood="happy" className="relative -mb-10 z-20 w-24 h-24" />

        <AnimatePresence mode='wait'>
            <motion.div
                key={currentIdx}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="w-full"
            >
                <div className="bg-white/90 backdrop-blur-sm border-2 border-white shadow-xl rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center items-center text-center relative ring-4 ring-white/50">
                    {/* Badge */}
                    <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-400 to-purple-400 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                        Holland Code
                    </div>

                    <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-8 leading-snug min-h-[80px] flex items-center justify-center">
                        "{currentQ.text}"
                    </h2>

                    <p className="text-gray-500 font-bold mb-6">Vui lòng đánh giá mức độ yêu thích của bạn:</p>

                    {/* Scale Container */}
                    <div className="w-full border-2 border-dashed border-blue-400 rounded-3xl p-4 md:p-6 bg-blue-50/30">
                       <div className="flex justify-between text-xs font-bold text-gray-400 px-2 mb-2 uppercase tracking-wide">
                          <span>Không thích</span>
                          <span>Bình thường</span>
                          <span>Rất thích</span>
                       </div>
                       
                       <div className="flex justify-between items-center gap-2 md:gap-4 px-2">
                          {emojiOptions.map((opt) => (
                            <motion.button 
                              key={opt.score}
                              onClick={() => handleAnswer(opt.score)}
                              whileHover={{ scale: 1.15 }}
                              whileTap={{ scale: 0.9 }}
                              animate={selectedOption === opt.score ? { scale: 1.25, y: -5 } : { scale: 1, y: 0 }}
                              className="relative group w-12 h-12 md:w-20 md:h-20 bg-transparent flex items-center justify-center transition-all duration-300 ease-out"
                            >
                               <HollandFace index={opt.score} />
                               
                               {/* Selection ring effect */}
                               {selectedOption === opt.score && (
                                 <motion.div 
                                    layoutId="outline"
                                    className="absolute inset-[-5px] rounded-full border-4 border-blue-400 opacity-60"
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                 />
                               )}
                            </motion.button>
                          ))}
                       </div>
                    </div>

                </div>
            </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-4 text-center text-gray-500 font-bold text-sm">
         Cứ trả lời thật lòng nha, không có đúng sai đâu!
      </div>
    </div>
  );
};

export default HollandQuizScreen;
