
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Sparkles, Target, Zap, 
  RefreshCw, Award, Calendar, Heart, Layers,
  Compass, Map, Info, Star
} from 'lucide-react';
import { getInteractions } from '../services/storageService';
import { analyzePassportJourney } from '../services/geminiService';
import { PassportReflection, InteractionRecord } from '../types';

interface Props {
  studentName: string;
  onBack: () => void;
}

const LearningPassportReflection: React.FC<Props> = ({ studentName, onBack }) => {
  const [reflection, setReflection] = useState<PassportReflection | null>(null);
  const [loading, setLoading] = useState(true);
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const logs = getInteractions();
      setInteractions(logs);
      if (logs.length > 0) {
        const result = await analyzePassportJourney(studentName, logs);
        setReflection(result);
      }
      setLoading(false);
    };
    fetchData();
  }, [studentName]);

  return (
    <div className="min-h-screen bg-[#FDFCF7] p-4 md:p-8 font-sans flex flex-col items-center overflow-x-hidden relative">
      {/* Background patterns */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-4xl z-10 space-y-8">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-comic">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-violet-600 rounded-2xl shadow-sm text-white rotate-[-3deg] border-2 border-black">
               <Compass size={28} />
             </div>
             <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight leading-none italic">Passport AI</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Ghi nhận hành trình nỗ lực</p>
             </div>
           </div>
           <button onClick={onBack} className="bg-slate-50 border-2 border-slate-200 hover:border-black p-3 rounded-2xl transition-all active:scale-95">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
             <div className="w-20 h-20 bg-violet-100 rounded-full flex items-center justify-center border-4 border-black animate-bounce">
                <RefreshCw size={40} className="animate-spin text-violet-600" />
             </div>
             <p className="text-xl font-black text-slate-400 uppercase tracking-widest italic animate-pulse">AI đang kết nối hành trình của bạn...</p>
          </div>
        ) : reflection ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 pb-20">
             
             {/* 1. Title / Milestone Badge */}
             <div className="bg-gradient-to-br from-violet-600 to-indigo-600 border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic relative overflow-hidden text-center text-white">
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/grid.png')]"></div>
                <div className="relative z-10 space-y-6">
                   <div className="inline-block p-6 bg-white rounded-full border-4 border-black shadow-xl rotate-[-5deg]">
                      <Award size={80} className="text-yellow-500" fill="currentColor" />
                   </div>
                   <div>
                      <span className="text-[10px] font-black uppercase tracking-[0.4em] opacity-80 block mb-2">Awarded Title</span>
                      <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter italic leading-none">{reflection.awardedTitle.name}</h2>
                      <p className="text-lg font-bold italic opacity-90 mt-4 max-w-xl mx-auto">"{reflection.awardedTitle.description}"</p>
                   </div>
                   <div className="bg-black/20 p-4 rounded-2xl border border-white/20 text-sm font-bold max-w-lg mx-auto">
                      <span className="text-yellow-300 uppercase text-[10px] block mb-1">Tại sao bạn nhận được?</span>
                      {reflection.awardedTitle.reason}
                   </div>
                </div>
                <div className="absolute top-[-20px] right-[-20px] text-white opacity-10 rotate-[20deg]"><Sparkles size={180} /></div>
             </div>

             {/* 2. Journey Stats Grid */}
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard icon={<Calendar size={20}/>} label="Ngày học tập" value={`${reflection.learningStreak} ngày`} color="bg-emerald-50 text-emerald-600" />
                <StatCard icon={<Zap size={20}/>} label="Thói quen" value={reflection.habitConsistency} color="bg-amber-50 text-amber-600" />
                <StatCard icon={<Heart size={20}/>} label="Điểm cân bằng" value={`${reflection.balanceScore}%`} color="bg-rose-50 text-rose-600" />
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* 3. Timeline Highlights */}
                <div className="lg:col-span-7 bg-white border-4 border-black rounded-[3rem] p-8 md:p-10 shadow-comic space-y-8">
                   <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-3">
                      <Layers className="text-violet-500" /> Dấu ấn hành trình
                   </h3>
                   <div className="space-y-6 relative pl-6">
                      <div className="absolute left-1 top-0 bottom-0 w-1 bg-slate-100 rounded-full"></div>
                      {reflection.timelineHighlights.map((hl, i) => (
                        <div key={i} className="relative group">
                           <div className="absolute -left-[23px] top-1 w-4 h-4 bg-white border-4 border-violet-500 rounded-full z-10 group-hover:scale-125 transition-transform"></div>
                           <div className="bg-slate-50 p-4 rounded-2xl border-2 border-slate-100 hover:border-violet-200 transition-all">
                              <p className="font-bold text-slate-700">{hl}</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>

                {/* 4. AI Message */}
                <div className="lg:col-span-5 space-y-6">
                   <div className="bg-amber-100 border-4 border-black rounded-[3rem] p-8 shadow-comic relative group">
                      <Star className="absolute top-4 right-4 text-amber-400 opacity-50 group-hover:rotate-45 transition-transform" size={40} fill="currentColor" />
                      <h4 className="text-sm font-black text-amber-600 uppercase tracking-widest mb-4">Lời nhắn từ GenYou AI</h4>
                      <p className="text-xl font-black text-slate-800 italic leading-relaxed font-hand">
                        "{reflection.aiEncouragement}"
                      </p>
                   </div>
                   
                   <div className="bg-white border-2 border-dashed border-slate-300 p-6 rounded-[2rem] text-center text-xs font-bold text-slate-400">
                      Hộ chiếu của bạn được cập nhật tự động dựa trên nỗ lực thay vì điểm số. Hãy tự hào về sự kiên trì của mình!
                   </div>
                </div>
             </div>

          </motion.div>
        ) : (
          <div className="bg-white border-4 border-black border-dashed rounded-[3rem] p-20 text-center flex flex-col items-center gap-6">
             <Map size={80} className="text-slate-100" />
             <div className="space-y-2">
                <h3 className="text-2xl font-black text-slate-300 uppercase italic">Bạn chưa có tương tác nào</h3>
                <p className="text-sm font-bold text-slate-300 max-w-xs mx-auto">Hãy tham gia học tập tại BrainCandy hoặc StudyHub để AI bắt đầu ghi nhận hành trình của bạn nhé!</p>
             </div>
             <button onClick={onBack} className="mt-4 px-8 py-3 bg-black text-white font-black rounded-xl border-2 border-black shadow-comic-hover">KHÁM PHÁ NGAY</button>
          </div>
        )}

      </div>
      
      <footer className="mt-auto py-10 text-slate-400 font-black text-[10px] uppercase tracking-[0.5em]">
        Learning Passport AI System v1.0 • Effort Oriented
      </footer>
    </div>
  );
};

const StatCard = ({ icon, label, value, color }: any) => (
  <div className={`${color} border-4 border-black p-6 rounded-[2.5rem] shadow-comic-hover flex items-center gap-5`}>
     <div className="bg-white p-3 rounded-xl border-2 border-black/10 shadow-sm">{icon}</div>
     <div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60 block">{label}</span>
        <span className="text-2xl font-black uppercase tracking-tighter leading-none">{value}</span>
     </div>
  </div>
);

export default LearningPassportReflection;
