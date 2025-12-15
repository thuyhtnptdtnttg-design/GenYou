import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, UserCheck, Settings, PenTool } from 'lucide-react';
import GenYouBot from './GenYouBot';

interface Props {
  onStart: (name: string, studentId: string) => void;
  onAdmin: () => void;
}

const WelcomeScreen: React.FC<Props> = ({ onStart, onAdmin }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      // Auto-generate a fun ID if not provided since we want "instant start"
      const autoId = `GEN-${Math.floor(Math.random() * 10000)}`;
      onStart(name, autoId);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center font-hand relative overflow-hidden">
      {/* Decorative scribbles background */}
      <div className="absolute top-10 left-10 w-20 h-20 border-4 border-yellow-400 rounded-full opacity-50 -z-10 animate-pulse"></div>
      <div className="absolute bottom-10 right-10 w-32 h-32 bg-pink-200 rotate-12 -z-10"></div>
      <div className="absolute top-1/2 left-5 text-6xl text-purple-200 -z-10 font-bold rotate-[-15deg]">?</div>
      <div className="absolute top-1/3 right-5 text-6xl text-teal-200 -z-10 font-bold rotate-[15deg]">!</div>

      <GenYouBot mood="excited" className="mb-4 w-40 h-40" />
      
      <motion.div 
        initial={{ scale: 0.5, rotate: -10 }}
        animate={{ scale: 1, rotate: 0 }}
        className="bg-white border-4 border-black shadow-comic p-4 px-8 mb-6 rotate-[-2deg]"
      >
        <h1 className="text-5xl md:text-6xl font-black text-ink uppercase tracking-tighter">
          GenYou
        </h1>
      </motion.div>

      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="bg-paper p-8 border-4 border-black shadow-comic rounded-2xl w-full max-w-sm relative"
      >
        {/* Tape effect */}
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-8 bg-yellow-200/80 rotate-2"></div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="text-left">
            <label className="block text-ink font-bold text-2xl mb-2 ml-1 flex items-center gap-2">
              <PenTool size={24} /> Biệt danh của bạn:
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-lg border-4 border-black focus:outline-none focus:border-purple-500 transition-colors bg-white font-bold text-xl font-sans"
              placeholder="Gõ tên vào đây nè..."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="mt-2 bg-yellow-300 hover:bg-yellow-400 text-black border-4 border-black font-black text-2xl py-4 rounded-xl shadow-comic hover:shadow-comic-hover transform active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
          >
            LÀM LUÔN! <Play size={28} fill="black" />
          </button>
        </form>
      </motion.div>
      
      <div className="mt-12">
        <button onClick={onAdmin} className="text-gray-500 font-bold hover:text-black underline font-sans text-sm">
          Khu vực Giáo viên (Admin)
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;