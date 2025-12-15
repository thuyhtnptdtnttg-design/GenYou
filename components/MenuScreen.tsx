
import React from 'react';
import { motion } from 'framer-motion';
import GenYouBot from './GenYouBot';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { DoodleBrain, DoodleBriefcase, DoodleLightbulb, DoodleHeart, DoodleTarget } from './HandDrawnIcons';

interface Props {
  studentName: string;
  onSelectMBTI: () => void;
  onSelectHolland: () => void;
  onSelectIQ: () => void;
  onSelectEQ: () => void;
  onSelectDISC: () => void;
  onSelectReport: () => void;
  onBack: () => void;
}

const MenuScreen: React.FC<Props> = ({ studentName, onSelectMBTI, onSelectHolland, onSelectIQ, onSelectEQ, onSelectDISC, onSelectReport, onBack }) => {
  return (
    <div className="min-h-screen bg-paper p-4 flex flex-col items-center justify-center font-hand relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-yellow-200 via-transparent to-transparent"></div>
      
      <button 
        onClick={onBack}
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 font-bold hover:text-black z-20"
      >
        <ArrowLeft size={24} /> Quay lại
      </button>

      <div className="text-center mb-6 z-10 pt-10">
        <GenYouBot mood="happy" className="mx-auto mb-2 w-28 h-28" />
        <h1 className="text-3xl font-black text-ink mb-1">Chào {studentName}! 👋</h1>
        <p className="text-lg text-gray-600 font-bold">Bạn muốn thử thách gì hôm nay?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl z-10 px-6">
        {/* MBTI Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectMBTI}
          className="bg-purple-100 border-4 border-black rounded-3xl p-5 shadow-comic hover:shadow-comic-hover transition-all flex items-center text-left gap-4 group"
        >
          <div className="w-14 h-14 bg-purple-300 rounded-full flex items-center justify-center border-4 border-black group-hover:bg-purple-400 shrink-0">
            <DoodleBrain size={28} className="text-black" />
          </div>
          <div className="flex flex-col items-start gap-1">
             <h2 className="text-xl font-black text-black leading-none">MBTI TEST</h2>
             <p className="text-xs text-gray-700 font-bold">Khám phá tính cách.</p>
             <span className="text-[10px] bg-white border border-black px-2 py-0.5 rounded-full font-bold">20 câu</span>
          </div>
        </motion.button>

        {/* Holland Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectHolland}
          className="bg-yellow-100 border-4 border-black rounded-3xl p-5 shadow-comic hover:shadow-comic-hover transition-all flex items-center text-left gap-4 group"
        >
          <div className="w-14 h-14 bg-yellow-300 rounded-full flex items-center justify-center border-4 border-black group-hover:bg-yellow-400 shrink-0">
            <DoodleBriefcase size={28} className="text-black" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-black text-black leading-none">HOLLAND CODE</h2>
            <p className="text-xs text-gray-700 font-bold">Định hướng nghề nghiệp.</p>
            <span className="text-[10px] bg-white border border-black px-2 py-0.5 rounded-full font-bold">60 câu</span>
          </div>
        </motion.button>

        {/* IQ Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectIQ}
          className="bg-blue-100 border-4 border-black rounded-3xl p-5 shadow-comic hover:shadow-comic-hover transition-all flex items-center text-left gap-4 group"
        >
          <div className="w-14 h-14 bg-blue-300 rounded-full flex items-center justify-center border-4 border-black group-hover:bg-blue-400 shrink-0">
            <DoodleLightbulb size={28} className="text-black" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-black text-black leading-none">IQ TEST</h2>
            <p className="text-xs text-gray-700 font-bold">Đo lường tư duy logic.</p>
            <span className="text-[10px] bg-white border border-black px-2 py-0.5 rounded-full font-bold">14 câu</span>
          </div>
        </motion.button>

        {/* EQ Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectEQ}
          className="bg-pink-100 border-4 border-black rounded-3xl p-5 shadow-comic hover:shadow-comic-hover transition-all flex items-center text-left gap-4 group"
        >
          <div className="w-14 h-14 bg-pink-300 rounded-full flex items-center justify-center border-4 border-black group-hover:bg-pink-400 shrink-0">
            <DoodleHeart size={28} className="text-black" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-black text-black leading-none">EQ TEST</h2>
            <p className="text-xs text-gray-700 font-bold">Trí tuệ cảm xúc.</p>
            <span className="text-[10px] bg-white border border-black px-2 py-0.5 rounded-full font-bold">14 câu</span>
          </div>
        </motion.button>

        {/* DISC Option */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onSelectDISC}
          className="bg-red-100 border-4 border-black rounded-3xl p-5 shadow-comic hover:shadow-comic-hover transition-all flex items-center text-left gap-4 group md:col-span-2 lg:col-span-2 justify-center"
        >
          <div className="w-14 h-14 bg-red-300 rounded-full flex items-center justify-center border-4 border-black group-hover:bg-red-400 shrink-0">
            <DoodleTarget size={28} className="text-black" />
          </div>
          <div className="flex flex-col items-start gap-1">
            <h2 className="text-xl font-black text-black leading-none">DISC TEST</h2>
            <p className="text-xs text-gray-700 font-bold">Thấu hiểu phong cách hành vi.</p>
            <span className="text-[10px] bg-white border border-black px-2 py-0.5 rounded-full font-bold">21 câu</span>
          </div>
        </motion.button>
      </div>

      {/* Comprehensive Report Button - The "Grand Finale" */}
      <div className="w-full max-w-4xl px-6 mt-6 pb-8 z-10">
         <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectReport}
            className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white border-4 border-black rounded-2xl p-4 shadow-comic hover:shadow-comic-hover transition-all flex items-center justify-center gap-3 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity"></div>
            <Sparkles size={24} className="text-yellow-400 animate-pulse" />
            <div className="text-left">
              <h2 className="text-xl font-black leading-none uppercase text-yellow-400">Xem Báo Cáo Tổng Hợp</h2>
              <p className="text-xs text-gray-400 font-bold">Phân tích AI từ tất cả kết quả của bạn</p>
            </div>
            <Sparkles size={24} className="text-yellow-400 animate-pulse" />
         </motion.button>
      </div>

      <div className="mt-2 text-gray-400 text-xs font-bold">GenYou System v2.2</div>
    </div>
  );
};

export default MenuScreen;