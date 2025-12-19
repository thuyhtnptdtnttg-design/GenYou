
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
  onSelectChill: () => void;
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
        className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 font-bold hover:text-black z-20 text-lg"
      >
        <ArrowLeft size={28} /> Quay lại
      </button>

      <div className="text-center mb-8 z-10 pt-10">
        <GenYouBot mood="happy" className="mx-auto mb-4 w-32 h-32" />
        <h1 className="text-4xl md:text-5xl font-black text-ink mb-2">Chào {studentName}! 👋</h1>
        <p className="text-xl md:text-2xl text-gray-600 font-bold">Bạn muốn thử thách gì hôm nay?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-5xl z-10 px-6 mb-8">
        {/* MBTI Option */}
        <MenuItem 
          onClick={onSelectMBTI}
          color="bg-purple-100"
          iconBg="bg-purple-300"
          hoverIconBg="group-hover:bg-purple-400"
          title="MBTI TEST"
          desc="Khám phá tính cách."
          count="20 câu"
          Icon={DoodleBrain}
        />

        {/* Holland Option */}
        <MenuItem 
          onClick={onSelectHolland}
          color="bg-yellow-100"
          iconBg="bg-yellow-300"
          hoverIconBg="group-hover:bg-yellow-400"
          title="HOLLAND CODE"
          desc="Định hướng nghề nghiệp."
          count="60 câu"
          Icon={DoodleBriefcase}
        />

        {/* IQ Option */}
        <MenuItem 
          onClick={onSelectIQ}
          color="bg-blue-100"
          iconBg="bg-blue-300"
          hoverIconBg="group-hover:bg-blue-400"
          title="IQ TEST"
          desc="Đo lường tư duy logic."
          count="14 câu"
          Icon={DoodleLightbulb}
        />

        {/* EQ Option */}
        <MenuItem 
          onClick={onSelectEQ}
          color="bg-pink-100"
          iconBg="bg-pink-300"
          hoverIconBg="group-hover:bg-pink-400"
          title="EQ TEST"
          desc="Trí tuệ cảm xúc."
          count="14 câu"
          Icon={DoodleHeart}
        />

        {/* DISC Option */}
        <MenuItem 
          onClick={onSelectDISC}
          color="bg-red-100"
          iconBg="bg-red-300"
          hoverIconBg="group-hover:bg-red-400"
          title="DISC TEST"
          desc="Thấu hiểu phong cách hành vi."
          count="21 câu"
          Icon={DoodleTarget}
        />

        {/* Comprehensive Report Button (Occupies 1 slot on grid) */}
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onSelectReport}
            className="w-full bg-black rounded-[2rem] p-2.5 shadow-comic hover:shadow-comic-hover transition-all flex group"
          >
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 w-full rounded-[1.5rem] p-5 flex items-center justify-center gap-4 border-2 border-gray-700 relative overflow-hidden">
                <Sparkles size={32} className="text-yellow-400 animate-pulse shrink-0" />
                <div className="text-left flex-1">
                  <h2 className="text-xl md:text-2xl font-black leading-none uppercase text-yellow-400 mb-1">Báo Cáo Tổng Hợp</h2>
                  <p className="text-xs text-gray-300 font-bold">Phân tích AI từ tất cả kết quả</p>
                </div>
            </div>
         </motion.button>
      </div>

      <div className="mt-2 text-gray-400 text-sm font-bold">GenYou System v2.3</div>
    </div>
  );
};

const MenuItem = ({ onClick, color, iconBg, hoverIconBg, title, desc, count, Icon }: any) => (
  <motion.button
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full bg-black rounded-[2rem] p-2.5 shadow-comic hover:shadow-comic-hover transition-all flex group"
  >
    <div className={`${color} w-full h-full rounded-[1.5rem] p-5 md:p-6 flex items-center gap-5 md:gap-6 border-2 border-black`}>
      <div className={`w-16 h-16 md:w-20 md:h-20 ${iconBg} rounded-full flex items-center justify-center border-[3px] md:border-4 border-black ${hoverIconBg} shrink-0`}>
        <Icon size={32} className="text-black md:w-10 md:h-10" />
      </div>
      <div className="flex flex-col items-start gap-1 md:gap-2 text-left min-w-0 flex-1">
         <h2 className="text-2xl md:text-4xl font-black text-black leading-none uppercase truncate w-full">{title}</h2>
         <p className="text-sm md:text-lg font-bold text-gray-800 leading-tight">{desc}</p>
         <span className="text-xs md:text-sm bg-white border-2 border-black px-3 py-1 rounded-full font-bold w-fit">{count}</span>
      </div>
    </div>
  </motion.button>
);

export default MenuScreen;
