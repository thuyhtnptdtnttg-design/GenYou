
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, Mic, PenTool, Brain, Sparkles } from 'lucide-react';

interface Props {
  onBack: () => void;
  onSelectTool: (tool: 'flashcards' | 'speaking' | 'writing' | 'summary') => void;
}

const StudyHubScreen: React.FC<Props> = ({ onBack, onSelectTool }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] font-hand p-4 md:p-8 flex flex-col items-center relative overflow-hidden">
      {/* Light & Airy Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full opacity-40 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px]"></div>
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute -top-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-[100px]"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 12, repeat: Infinity }}
          className="absolute -bottom-20 -right-20 w-[30rem] h-[30rem] bg-purple-100 rounded-full blur-[120px]"
        />
      </div>

      <div className="w-full max-w-4xl z-10">
        <header className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <motion.div initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}>
            <h1 className="text-5xl font-black text-slate-900 mb-1 tracking-tight">StudyHub</h1>
            <div className="flex items-center gap-2 text-slate-500 font-bold bg-white px-4 py-1.5 rounded-full border border-slate-200 shadow-sm w-fit">
              Trợ lý học tập thông minh <Sparkles size={16} className="text-amber-500" />
            </div>
          </motion.div>
          <button 
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95 text-lg"
          >
            <ArrowLeft size={20} /> Quay lại
          </button>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
          <StudyToolCard 
            onClick={() => onSelectTool('flashcards')}
            title="Học Từ Vựng"
            desc="Thẻ Flashcard phong cách Quizlet, lặp lại ngắt quãng."
            icon={<Book size={28} className="text-rose-500" />}
            iconBg="bg-rose-50"
            index={0}
          />
          <StudyToolCard 
            onClick={() => onSelectTool('writing')}
            title="Chấm Bài Viết"
            desc="Sửa lỗi ngữ pháp & từ vựng theo chuẩn thi cử."
            icon={<PenTool size={28} className="text-sky-500" />}
            iconBg="bg-sky-50"
            index={1}
          />
          <StudyToolCard 
            onClick={() => onSelectTool('speaking')}
            title="Luyện Nói AI"
            desc="Giao tiếp trực tiếp để chuẩn hóa phát âm."
            icon={<Mic size={28} className="text-emerald-500" />}
            iconBg="bg-emerald-50"
            index={2}
          />
          <StudyToolCard 
            onClick={() => onSelectTool('summary')}
            title="Tóm Tắt & Mindmap"
            desc="Biến tài liệu dài thành sơ đồ tư duy cô đọng."
            icon={<Brain size={28} className="text-violet-500" />}
            iconBg="bg-violet-50"
            index={3}
          />
        </div>
      </div>
    </div>
  );
};

const StudyToolCard = ({ onClick, title, desc, icon, iconBg, index }: any) => (
  <motion.button
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ delay: index * 0.1 }}
    whileHover={{ y: -6, boxShadow: "0px 8px 0px 0px rgba(15, 23, 42, 1)" }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="bg-white border-2 border-slate-900 rounded-[2rem] p-6 md:p-8 shadow-comic transition-all text-left flex flex-col gap-4 group h-full relative overflow-hidden"
  >
    <div className={`w-14 h-14 ${iconBg} rounded-xl flex items-center justify-center border-2 border-slate-900 shadow-sm group-hover:rotate-6 transition-transform`}>
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-black text-slate-900 mb-2 leading-tight">{title}</h3>
      <p className="text-slate-500 font-bold leading-snug text-lg">{desc}</p>
    </div>
  </motion.button>
);

export default StudyHubScreen;
