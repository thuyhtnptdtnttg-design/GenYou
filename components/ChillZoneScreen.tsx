
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Zap, Sparkles, BookOpen, 
  Wind, Smile, Coffee, Brain, ChevronRight, 
  RefreshCw, Quote, Sun, Sunset, Moon, Timer,
  CheckCircle2, MessageSquare, PenTool, LayoutGrid
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { recordInteraction } from '../services/storageService';

interface Props {
  onBack: () => void;
}

type ChillState = 'setup' | 'activity' | 'story' | 'reflection' | 'finish';
type Mood = 'Bình thường' | 'Lo lắng' | 'Mệt mỏi' | 'Chán học';

const ChillZoneScreen: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<ChillState>('setup');
  const [mood, setMood] = useState<Mood>('Bình thường');
  const [studyTime, setStudyTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const [aiActivity, setAiActivity] = useState<any>(null);
  const [motivationQuote, setMotivationQuote] = useState('');
  const [story, setStory] = useState('');
  const [reflectionAnswers, setReflectionAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [startTime] = useState(Date.now());

  const generateRelaxation = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Bạn là ChillZone – AI hỗ trợ cảm xúc. Học sinh đang: ${mood}, đã học ${studyTime} phút. Trả lời JSON: { activity: string, guide: string, message: string, returnSuggestion: string }`;
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      setAiActivity(JSON.parse(res.text));
      setStep('activity');
    } catch (e) {
      alert("Hít thở sâu nào...");
      setStep('setup');
    } finally {
      setLoading(false);
    }
  };

  const finishChill = () => {
    const duration = Math.floor((Date.now() - startTime) / 1000);
    recordInteraction({
      timestamp: Date.now(),
      module: 'ChillZone',
      activityType: 'Thư giãn',
      duration,
      status: 'Hoàn thành',
      state: 'Tích cực'
    });
    setStep('finish');
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-hand p-4 md:p-8 flex flex-col items-center relative overflow-x-hidden">
      <div className="w-full max-w-4xl z-10 space-y-6">
        
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-comic">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-400 rounded-2xl border-2 border-black rotate-[-3deg] shadow-comic-hover text-white">
                <Coffee size={32} />
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none">Chill Zone AI</h1>
                <p className="text-slate-500 font-bold text-sm italic">Trạm sạc năng lượng tinh thần</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-2xl shadow-comic-hover active:scale-95 transition-all">
            <ArrowLeft size={24} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
              <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-10 shadow-comic space-y-8 text-center">
                 <h3 className="text-3xl font-black text-slate-900 uppercase">Em đang cảm thấy thế nào?</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['Bình thường', 'Lo lắng', 'Mệt mỏi', 'Chán học'] as Mood[]).map((m) => (
                      <button 
                        key={m} onClick={() => setMood(m)}
                        className={`p-6 rounded-[2rem] border-4 transition-all flex flex-col items-center gap-3 shadow-comic hover:shadow-none
                          ${mood === m ? 'bg-rose-400 border-black text-white scale-95' : 'bg-white border-slate-200 text-slate-400 hover:border-black'}
                        `}
                      >
                         {m === 'Bình thường' && <Smile size={32} />}
                         {m === 'Lo lắng' && <Wind size={32} />}
                         {m === 'Mệt mỏi' && <Coffee size={32} />}
                         {m === 'Chán học' && <Sparkles size={32} />}
                         <span className="font-black text-sm uppercase">{m}</span>
                      </button>
                    ))}
                 </div>
                 <button 
                   onClick={generateRelaxation} disabled={loading}
                   className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                 >
                   {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />} NHẬN TRỊ LIỆU NHANH
                 </button>
              </div>
            </motion.div>
          )}

          {step === 'activity' && (
             <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white border-4 border-black rounded-[3rem] p-10 md:p-14 shadow-comic text-center space-y-8">
                <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center border-4 border-black mx-auto">
                   <Heart size={40} className="text-rose-500" fill="currentColor" />
                </div>
                <h2 className="text-4xl font-black uppercase text-slate-900 leading-tight">{aiActivity.activity}</h2>
                <div className="bg-slate-50 border-4 border-dashed border-slate-200 p-8 rounded-[2.5rem] text-left">
                   <p className="text-xl font-bold text-slate-700 leading-relaxed whitespace-pre-line">{aiActivity.guide}</p>
                </div>
                <button onClick={() => setStep('reflection')} className="w-full bg-black text-white py-6 rounded-[2rem] font-black text-xl shadow-comic hover:shadow-none transition-all uppercase">Tiếp tục: Tự nhìn lại</button>
             </motion.div>
          )}

          {step === 'reflection' && (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-comic space-y-10">
                <div className="text-center">
                   <h2 className="text-4xl font-black text-slate-900 uppercase">Phút giây lắng đọng</h2>
                </div>
                <div className="space-y-8">
                   <ReflectionInput label="Hôm nay em đã cố gắng điều gì?" value={reflectionAnswers.q1} onChange={(v: string) => setReflectionAnswers({...reflectionAnswers, q1: v})} />
                   <ReflectionInput label="Điều gì khiến em cảm thấy dễ chịu hơn lúc này?" value={reflectionAnswers.q2} onChange={(v: string) => setReflectionAnswers({...reflectionAnswers, q2: v})} />
                </div>
                <button onClick={finishChill} className="w-full bg-rose-400 text-white py-6 rounded-[2.5rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none transition-all uppercase">Hoàn thành ChillZone</button>
             </motion.div>
          )}

          {step === 'finish' && (
            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-10 text-center">
               <CheckCircle2 size={120} className="text-emerald-500" />
               <h2 className="text-5xl font-black uppercase text-slate-900">Em tuyệt vời lắm!</h2>
               <div className="bg-rose-50 border-4 border-dashed border-rose-200 p-8 rounded-[3rem] w-full max-w-xl italic font-bold text-rose-900 text-xl">
                  "{aiActivity?.returnSuggestion || 'Em đã sẵn sàng để tiếp tục chưa?'}"
               </div>
               <button onClick={onBack} className="bg-black text-white py-5 px-12 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all">VỀ TRANG CHỦ</button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};

const ReflectionInput = ({ label, value, onChange }: any) => (
  <div className="space-y-3">
     <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2">
        <MessageSquare size={14} className="text-rose-400" /> {label}
     </label>
     <input type="text" placeholder="..." value={value} onChange={(e) => onChange(e.target.value)} className="w-full bg-slate-50 border-4 border-black rounded-2xl p-4 font-bold text-lg focus:bg-white transition-all outline-none" />
  </div>
);

export default ChillZoneScreen;
