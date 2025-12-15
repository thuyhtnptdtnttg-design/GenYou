
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EQ_QUESTIONS, getEQClassification } from '../constants';
import GenYouBot from './GenYouBot';
import { StudentResult } from '../types';
import { saveResult } from '../services/storageService';

interface Props {
  studentName: string;
  studentId: string;
  onComplete: (result: StudentResult) => void;
  onCancel: () => void;
}

// Custom SVG Face Component (Reusing the style from Holland Test)
const EQFace = ({ index }: { index: number }) => {
  // Common Face Circle (The "yolk")
  const FaceBase = ({ color }: { color: string }) => (
    <circle cx="50" cy="50" r="35" fill={color} stroke="#b45309" strokeWidth="2" />
  );
  
  switch (index) {
    case 0: // Angry - Pink Ring (Value 1: Hoàn toàn không đúng)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#fce7f3" stroke="#f472b6" strokeWidth="2" />
          <FaceBase color="#fb923c" />
          <path d="M35 45 L 45 50" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M65 45 L 55 50" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <circle cx="40" cy="55" r="4" fill="#4a0404" />
          <circle cx="60" cy="55" r="4" fill="#4a0404" />
          <path d="M40 70 Q 50 65 60 70" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 1: // Sad - Peach Ring (Value 2: Không đúng)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#ffedd5" stroke="#fb923c" strokeWidth="2" />
          <FaceBase color="#fdba74" />
          <circle cx="38" cy="52" r="5" fill="#4a0404" />
          <circle cx="62" cy="52" r="5" fill="#4a0404" />
          <circle cx="40" cy="50" r="2" fill="white" />
          <circle cx="64" cy="50" r="2" fill="white" />
          <path d="M40 72 Q 50 65 60 72" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M35 40 Q 40 35 45 42" fill="none" stroke="#4a0404" strokeWidth="2" strokeLinecap="round" />
          <path d="M65 40 Q 60 35 55 42" fill="none" stroke="#4a0404" strokeWidth="2" strokeLinecap="round" />
        </svg>
      );
    case 2: // Neutral - Yellow Ring (Value 3: Bình thường)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#fef9c3" stroke="#facc15" strokeWidth="2" />
          <FaceBase color="#fde047" />
          <circle cx="38" cy="50" r="4" fill="#4a0404" />
          <circle cx="62" cy="50" r="4" fill="#4a0404" />
          <circle cx="38" cy="50" r="1.5" fill="white" />
          <circle cx="62" cy="50" r="1.5" fill="white" />
          <line x1="42" y1="70" x2="58" y2="70" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );
    case 3: // Happy - Blue Ring (Value 4: Đúng)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#dbeafe" stroke="#60a5fa" strokeWidth="2" />
          <FaceBase color="#fde047" />
          <path d="M35 50 Q 40 45 45 50" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M55 50 Q 60 45 65 50" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <path d="M35 65 Q 50 80 65 65" fill="none" stroke="#4a0404" strokeWidth="3" strokeLinecap="round" />
          <circle cx="30" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
          <circle cx="70" cy="62" r="5" fill="#fca5a5" opacity="0.6" />
        </svg>
      );
    case 4: // Love - Green Ring (Value 5: Hoàn toàn đúng)
      return (
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
          <circle cx="50" cy="50" r="48" fill="#dcfce7" stroke="#4ade80" strokeWidth="2" />
          <FaceBase color="#fde047" />
          <path d="M32 50 C 32 45, 40 45, 40 50 C 40 45, 48 45, 48 50 C 48 58, 40 62, 40 62 C 40 62, 32 58, 32 50" fill="#ef4444" />
          <path d="M52 50 C 52 45, 60 45, 60 50 C 60 45, 68 45, 68 50 C 68 58, 60 62, 60 62 C 60 62, 52 58, 52 50" fill="#ef4444" />
          <path d="M35 70 Q 50 85 65 70 Z" fill="#4a0404" />
          <path d="M42 76 Q 50 80 58 76" fill="#ef4444" />
        </svg>
      );
    default: return null;
  }
}

const EQQuizScreen: React.FC<Props> = ({ studentName, studentId, onComplete, onCancel }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [exitDirection, setExitDirection] = useState(0); 
  
  const [skillScores, setSkillScores] = useState<Record<string, number>>({
    SelfAwareness: 0,
    SelfManagement: 0,
    SocialAwareness: 0,
    RelationshipSkills: 0,
    SelfMotivation: 0
  });

  const bgColors = ['bg-pink-50', 'bg-rose-50', 'bg-fuchsia-50', 'bg-purple-50', 'bg-red-50'];
  const currentColor = bgColors[currentIdx % bgColors.length];

  const handleAnswer = (score: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(score);
    setExitDirection(Math.random() > 0.5 ? 1 : -1); 

    setTimeout(() => {
        const currentQ = EQ_QUESTIONS[currentIdx];
        const newSkillScores = {
            ...skillScores,
            [currentQ.category]: (skillScores[currentQ.category] || 0) + score
        };
        setSkillScores(newSkillScores);

        if (currentIdx < EQ_QUESTIONS.length - 1) {
            setCurrentIdx(currentIdx + 1);
            setSelectedOption(null);
        } else {
            finishQuiz(newSkillScores);
        }
    }, 400); 
  };

  const finishQuiz = (finalSkills: Record<string, number>) => {
    const totalScore = Object.values(finalSkills).reduce((a: number, b: number) => a + b, 0);
    const classification = getEQClassification(totalScore);

    const result: StudentResult = {
        id: Date.now().toString(),
        name: studentName,
        studentId,
        type: 'EQ',
        eqScore: totalScore,
        eqClassification: classification.label,
        eqSkills: finalSkills as any,
        timestamp: Date.now()
    };

    saveResult(result);
    onComplete(result);
  };

  const currentQ = EQ_QUESTIONS[currentIdx];
  const progress = ((currentIdx + 1) / EQ_QUESTIONS.length) * 100;

  const options = [
    { val: 1, label: "Hoàn toàn không đúng" },
    { val: 2, label: "Không đúng" },
    { val: 3, label: "Bình thường" },
    { val: 4, label: "Đúng" },
    { val: 5, label: "Hoàn toàn đúng" },
  ];

  const cardVariants = {
    initial: { scale: 0.8, y: 50, opacity: 0 },
    animate: { scale: 1, y: 0, opacity: 1, rotate: 0 },
    exit: (custom: number) => ({
      x: custom * 500,
      y: 100,
      rotate: custom * 45,
      opacity: 0,
      transition: { duration: 0.4 }
    })
  };

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
                background: `repeating-linear-gradient(45deg, #f472b6, #f472b6 10px, #ec4899 10px, #ec4899 20px)` 
                }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
            />
           </div>
           <p className="text-center text-xs font-bold mt-1 text-pink-700">Câu hỏi EQ {currentIdx + 1}/{EQ_QUESTIONS.length}</p>
        </div>
      </div>

      {/* Main Card Stack Area */}
      <div className="flex-1 flex flex-col justify-center items-center relative z-10 w-full max-w-4xl mx-auto perspective-1000">
        <GenYouBot mood="happy" className="relative -mb-10 z-20 w-24 h-24" />

        <div className="relative w-full flex justify-center items-center h-[500px]">
             {/* Fake Card Behind (The "Deck") */}
            <div className="absolute w-full max-w-2xl bg-white border-4 border-gray-300 rounded-3xl h-[420px] transform rotate-3 translate-y-4 -z-10 shadow-sm opacity-50"></div>
            <div className="absolute w-full max-w-2xl bg-white border-4 border-gray-300 rounded-3xl h-[420px] transform -rotate-2 translate-y-2 -z-10 shadow-sm opacity-70"></div>

            <AnimatePresence mode='popLayout' custom={exitDirection}>
                <motion.div
                    key={currentIdx}
                    custom={exitDirection}
                    variants={cardVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    className="w-full max-w-2xl absolute"
                >
                    <div className="bg-white border-4 border-black shadow-comic rounded-3xl p-6 md:p-10 min-h-[420px] flex flex-col justify-center items-center text-center relative z-10">
                        {/* Tag */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pink-100 text-pink-700 px-4 py-1 rounded-full text-sm font-black border-4 border-black shadow-sm z-20">
                            {currentQ.category}
                        </div>

                        <span className="absolute top-4 right-4 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-xs font-bold border-2 border-pink-200">
                            EQ Card #{currentIdx + 1}
                        </span>

                        <h2 className="text-2xl md:text-3xl font-black text-gray-800 mb-12 mt-8 leading-snug">
                            "{currentQ.text}"
                        </h2>

                        {/* Horizontal Options */}
                        <div className="w-full">
                           <div className="flex justify-between items-start gap-2 md:gap-4 overflow-x-auto pb-4 px-2">
                              {options.map((opt) => (
                                <div key={opt.val} className="flex flex-col items-center gap-2 flex-1 min-w-[60px] group">
                                    <motion.button 
                                      onClick={() => handleAnswer(opt.val)}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.9 }}
                                      animate={selectedOption === opt.val ? { scale: 1.25, y: -5 } : { scale: 1, y: 0 }}
                                      className={`
                                        w-16 h-16 md:w-24 md:h-24 rounded-full bg-transparent
                                        flex items-center justify-center transition-all duration-300 ease-out relative
                                      `}
                                    >
                                       <EQFace index={opt.val - 1} />
                                       
                                       {/* Selection Ring */}
                                       {selectedOption === opt.val && (
                                         <motion.div 
                                            layoutId="outline"
                                            className="absolute inset-[-5px] rounded-full border-4 border-pink-400 opacity-60"
                                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                         />
                                       )}
                                    </motion.button>
                                    <span className={`text-[10px] md:text-xs font-bold text-center leading-tight transition-colors ${selectedOption === opt.val ? 'text-pink-600' : 'text-gray-400 group-hover:text-black'}`}>
                                        {opt.label}
                                    </span>
                                </div>
                              ))}
                           </div>
                           
                           {/* Line connecting options (decoration) */}
                           <div className="h-2 bg-gray-100 w-[90%] mx-auto -mt-10 -z-10 rounded-full border-b-2 border-gray-200"></div>
                        </div>

                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
      </div>

      <div className="mt-4 text-center text-pink-900/50 font-bold text-sm">
         Lắng nghe trái tim mình nhé! ❤️
      </div>
    </div>
  );
};

export default EQQuizScreen;
