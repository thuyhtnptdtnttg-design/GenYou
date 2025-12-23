
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// Added Sparkles to the imports to fix "Cannot find name 'Sparkles'" errors
import { 
  ArrowLeft, Heart, Zap, BookOpen, 
  Wind, Smile, Coffee, Brain, ChevronRight, 
  RefreshCw, Quote, Sun, Sunset, Moon, Timer,
  CheckCircle2, MessageSquare, PenTool, LayoutGrid,
  Play, Pause, Maximize, Volume2, X, PlayCircle, Film, Sparkles
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { recordInteraction } from '../services/storageService';

interface Props {
  onBack: () => void;
}

type ChillState = 'setup' | 'activity' | 'story' | 'reflection' | 'finish';
type Mood = 'Bình thường' | 'Lo lắng' | 'Mệt mỏi' | 'Chán học';
type Period = 'Sáng' | 'Chiều' | 'Tối';

interface RelaxationVideo {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  color: string;
}

const RELAXATION_VIDEOS: RelaxationVideo[] = [
  {
    id: 'vid-1',
    title: 'Mưa Ban Đêm',
    description: 'Tiếng mưa rơi trên cửa kính giúp dễ ngủ và tập trung.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-rain-falling-on-a-window-pane-at-night-2521-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?q=80&w=400&auto=format&fit=crop',
    color: 'bg-indigo-100'
  },
  {
    id: 'vid-2',
    title: 'Sóng Biển Hoàng Hôn',
    description: 'Thả mình vào nhịp vỗ của đại dương và ánh nắng ấm áp.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-waves-coming-to-the-beach-shore-at-sunset-2646-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=400&auto=format&fit=crop',
    color: 'bg-orange-100'
  },
  {
    id: 'vid-3',
    title: 'Rừng Xanh Tĩnh Lặng',
    description: 'Tiếng chim hót và gió luồn qua tán cây đại ngàn.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-pathway-in-the-middle-of-a-forest-with-tall-trees-2495-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=400&auto=format&fit=crop',
    color: 'bg-emerald-100'
  },
  {
    id: 'vid-4',
    title: 'Bầu Trời Đầy Sao',
    description: 'Khám phá sự bao la của vũ trụ để làm dịu tâm trí.',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-starry-night-sky-background-998-large.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1506318137071-a8e063b4b519?q=80&w=400&auto=format&fit=crop',
    color: 'bg-purple-100'
  }
];

const ChillZoneScreen: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<ChillState>('setup');
  const [mood, setMood] = useState<Mood>('Bình thường');
  const [studyTime, setStudyTime] = useState(60);
  const [loading, setLoading] = useState(false);
  const [period, setPeriod] = useState<Period>('Sáng');
  const [activeVideo, setActiveVideo] = useState<RelaxationVideo | null>(null);
  
  // AI Generated Content
  const [aiActivity, setAiActivity] = useState<{
    activity: string;
    guide: string;
    message: string;
    returnSuggestion: string;
  } | null>(null);
  
  const [motivationQuote, setMotivationQuote] = useState('');
  const [story, setStory] = useState('');
  const [reflectionAnswers, setReflectionAnswers] = useState({ q1: '', q2: '', q3: '' });
  const [startTime] = useState(Date.now());

  // Set default period based on local time
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) setPeriod('Sáng');
    else if (hour >= 12 && hour < 18) setPeriod('Chiều');
    else setPeriod('Tối');
  }, []);

  const generateRelaxation = async () => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Bạn là ChillZone – AI hỗ trợ cảm xúc tích cực cho học sinh THPT Việt Nam.
      Học sinh đang: ${mood}, đã học ${studyTime} phút, thời điểm người học chọn: ${period}.
      
      Hãy thực hiện:
      1. Đề xuất MỘT hoạt động thư giãn (2-5p) phù hợp với buổi ${period}.
      2. Hướng dẫn hoạt động đó (ngôn ngữ đơn giản).
      3. Một thông điệp tích cực nhẹ nhàng.
      4. Gợi ý quay lại học tập tự nhiên.

      Trả lời bằng JSON:
      {
        "activity": "Tên hoạt động",
        "guide": "Các bước thực hiện ngắn gọn",
        "message": "Thông điệp yêu thương",
        "returnSuggestion": "Lời gợi ý quay lại học BrainCandy hoặc StudyHub"
      }`;

      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      setAiActivity(JSON.parse(res.text));
      setStep('activity');
    } catch (e) {
      alert("AI đang bận một chút, bạn hãy hít thở sâu nhé!");
    } finally {
      setLoading(false);
    }
  };

  const generateStory = async (topic: string) => {
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Viết một câu chuyện ngắn (150–200 từ) dành cho học sinh THPT về chủ đề: ${topic}. 
      Nhân vật là học sinh, tình huống đời thường, kết thúc tích cực, ngôn ngữ trong sáng.`;
      
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setStory(res.text);
      setStep('story');
    } catch (e) {
      setStory("Có một bạn nhỏ luôn nỗ lực mỗi ngày, và hôm nay bạn ấy nhận ra mình đã đi được một quãng đường rất xa...");
      setStep('story');
    } finally {
      setLoading(false);
    }
  };

  const fetchQuote = async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Tạo một câu nói truyền động lực (1-2 câu) cho học sinh THPT. Nhấn mạnh nỗ lực, không nhấn mạnh thành tích. Gần gũi.`;
      const res = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt
      });
      setMotivationQuote(res.text);
    } catch (e) {
      setMotivationQuote("Mỗi bước đi nhỏ đều đưa em đến gần hơn với ước mơ của mình.");
    }
  };

  useEffect(() => {
    fetchQuote();
  }, []);

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
    <div className="min-h-screen bg-[#FFFDF5] font-hand p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
      {/* Abstract Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>

      <div className="w-full max-w-4xl z-10 space-y-6">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-comic">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-rose-400 rounded-2xl border-2 border-black rotate-[-3deg] shadow-comic-hover">
                <Coffee size={32} className="text-white" />
             </div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none uppercase italic">Chill Zone AI</h1>
                <p className="text-slate-500 font-bold text-sm">Trạm sạc năng lượng tinh thần</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-2xl hover:translate-y-1 transition-all shadow-comic-hover active:scale-95">
            <ArrowLeft size={24} />
          </button>
        </header>

        <AnimatePresence mode="wait">
          {step === 'setup' && (
            <motion.div key="setup" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8 pb-10">
              {/* Daily Quote Card */}
              <div className="bg-amber-100 border-4 border-black p-10 rounded-[3rem] shadow-comic relative overflow-hidden text-center group">
                 <Quote className="absolute top-4 left-6 text-amber-300 opacity-50" size={40} />
                 <h2 className="text-2xl md:text-3xl font-black text-slate-800 italic leading-relaxed">
                   "{motivationQuote || 'Đang tải cảm hứng...'}"
                 </h2>
                 <div className="mt-6 flex justify-center gap-2">
                    <span className="bg-white border-2 border-black px-6 py-1.5 rounded-full text-xs font-black uppercase tracking-widest shadow-sm">Motivation of the Day</span>
                 </div>
              </div>

              {/* Mood Selection */}
              <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic space-y-10">
                 <div className="text-center">
                    <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter leading-none italic">Em đang cảm thấy thế nào?</h3>
                    <p className="text-slate-400 font-bold mt-2">Hãy chia sẻ để ChillZone giúp em nhé!</p>
                 </div>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {(['Bình thường', 'Lo lắng', 'Mệt mỏi', 'Chán học'] as Mood[]).map((m) => (
                      <button 
                        key={m}
                        onClick={() => setMood(m)}
                        className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col items-center gap-3 shadow-comic hover:shadow-none
                          ${mood === m ? 'bg-rose-400 border-black text-white scale-95' : 'bg-white border-slate-200 text-slate-400 hover:border-black'}
                        `}
                      >
                         {m === 'Bình thường' && <Smile size={40} />}
                         {m === 'Lo lắng' && <Wind size={40} />}
                         {m === 'Mệt mỏi' && <Coffee size={40} />}
                         {m === 'Chán học' && <Sparkles size={40} />}
                         <span className="font-black text-base uppercase">{m}</span>
                      </button>
                    ))}
                 </div>

                 <div className="space-y-4">
                    <div className="flex justify-between items-end px-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian học liên tục (phút)</label>
                       <span className="text-3xl font-black text-rose-500">{studyTime}p</span>
                    </div>
                    <input 
                      type="range" min="15" max="180" step="15" 
                      value={studyTime} onChange={(e) => setStudyTime(parseInt(e.target.value))}
                      className="w-full h-4 bg-slate-100 rounded-full appearance-none cursor-pointer accent-rose-400 border-2 border-black"
                    />
                 </div>

                 <div className="flex flex-col md:flex-row gap-6">
                    {/* Period Selector - Improved edition */}
                    <div className="flex-1 bg-blue-50 border-4 border-black p-4 rounded-[2.5rem] flex flex-col gap-3 shadow-comic-hover">
                       <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest px-2 flex items-center gap-2">
                         <Timer size={12}/> THỜI ĐIỂM
                       </p>
                       <div className="flex gap-2">
                          {(['Sáng', 'Chiều', 'Tối'] as Period[]).map((p) => (
                             <button 
                                key={p} 
                                onClick={() => setPeriod(p)}
                                className={`flex-1 flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all group/p
                                  ${period === p ? 'bg-white border-black text-blue-600 scale-95 shadow-inner' : 'bg-white/50 border-transparent text-slate-300 hover:border-blue-200'}
                                `}
                             >
                                <div className="mb-1 transition-transform group-hover/p:rotate-12">
                                  {p === 'Sáng' && <Sun size={20} />}
                                  {p === 'Chiều' && <Sunset size={20} />}
                                  {p === 'Tối' && <Moon size={20} />}
                                </div>
                                <span className="text-[10px] font-black uppercase">{p}</span>
                             </button>
                          ))}
                       </div>
                    </div>
                    
                    <button 
                      onClick={generateRelaxation}
                      disabled={loading}
                      className="flex-[2] bg-black text-white py-6 rounded-[2.5rem] font-black text-3xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50 active:scale-95"
                    >
                      {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={32} />} NHẬN TRỊ LIỆU NHANH
                    </button>
                 </div>
              </div>

              {/* Relaxation Videos Section */}
              <div className="space-y-6">
                 <div className="flex items-center gap-3 px-2">
                    <Film size={24} className="text-purple-500" />
                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Video Thư Giãn</h3>
                    <span className="bg-purple-100 text-purple-600 px-3 py-0.5 rounded-full text-[10px] font-black border border-purple-200 uppercase tracking-widest">Mới</span>
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {RELAXATION_VIDEOS.map((vid) => (
                      <motion.button 
                        key={vid.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setActiveVideo(vid)}
                        className={`group relative ${vid.color} border-4 border-black rounded-[2.5rem] p-5 shadow-comic hover:shadow-none transition-all text-left flex flex-col gap-4 overflow-hidden`}
                      >
                         <div className="relative aspect-video rounded-2xl overflow-hidden border-2 border-black">
                            <img src={vid.thumbnail} alt={vid.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <div className="bg-white p-4 rounded-full border-2 border-black shadow-comic">
                                  <Play fill="black" size={24} />
                               </div>
                            </div>
                         </div>
                         <div>
                            <h4 className="text-xl font-black text-slate-900 leading-tight mb-1">{vid.title}</h4>
                            <p className="text-xs font-bold text-slate-500 leading-relaxed italic">{vid.description}</p>
                         </div>
                         {/* Abstract Decor */}
                         <div className="absolute right-[-10px] bottom-[-10px] opacity-10 rotate-[-15deg] group-hover:rotate-0 transition-transform pointer-events-none">
                            <PlayCircle size={80} />
                         </div>
                      </motion.button>
                    ))}
                 </div>
              </div>

              {/* Story Corner Selector */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                 <StoryEntry 
                    title="Câu chuyện nỗ lực" 
                    color="bg-emerald-100" 
                    onClick={() => generateStory('Nỗ lực học tập')} 
                 />
                 <StoryEntry 
                    title="Vượt qua áp lực" 
                    color="bg-blue-100" 
                    onClick={() => generateStory('Vượt qua áp lực thi cử')} 
                 />
              </div>
            </motion.div>
          )}

          {step === 'activity' && aiActivity && (
            <motion.div key="activity" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="space-y-8">
               <div className="bg-white border-4 border-black rounded-[3rem] p-10 md:p-14 shadow-comic relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-4 bg-rose-400"></div>
                  
                  <div className="flex flex-col items-center text-center space-y-6">
                     <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center border-4 border-black animate-pulse">
                        <Heart size={40} className="text-rose-500" fill="currentColor" />
                     </div>
                     <div>
                        <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase italic">{aiActivity.activity}</h2>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-2">Dành riêng cho em ngay lúc này</p>
                     </div>

                     <div className="bg-slate-50 border-4 border-dashed border-slate-200 p-8 rounded-[2.5rem] w-full text-left">
                        <h4 className="text-sm font-black text-rose-500 uppercase mb-4 flex items-center gap-2">
                           <Zap size={16} /> Hướng dẫn thực hành
                        </h4>
                        <p className="text-xl font-bold text-slate-700 leading-relaxed whitespace-pre-line">
                           {aiActivity.guide}
                        </p>
                     </div>

                     <div className="bg-rose-50 border-4 border-black p-6 rounded-2xl w-full italic font-bold text-rose-900">
                        "{aiActivity.message}"
                     </div>
                  </div>

                  <div className="mt-12 flex flex-col md:flex-row gap-4">
                     <button 
                       onClick={() => setStep('reflection')}
                       className="flex-1 bg-black text-white py-5 rounded-[2rem] font-black text-xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-3"
                     >
                       TIẾP TỤC: TỰ NHÌN LẠI <ChevronRight />
                     </button>
                     <button 
                       onClick={() => setStep('setup')}
                       className="bg-white border-4 border-black px-8 py-5 rounded-[2rem] font-black text-xl shadow-comic hover:shadow-none transition-all"
                     >
                        THỬ LẠI
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'story' && (
            <motion.div key="story" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-2xl mx-auto space-y-8">
               <div className="bg-white border-4 border-black rounded-[3rem] p-10 md:p-14 shadow-comic relative">
                  <div className="absolute -top-6 -left-6 bg-emerald-400 p-4 rounded-2xl border-4 border-black shadow-comic rotate-[-10deg]">
                     <BookOpen className="text-white" size={32} />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 mb-8 uppercase tracking-tighter text-center italic">Góc chữa lành</h2>
                  <div className="prose prose-slate max-w-none">
                     <p className="text-xl font-bold text-slate-700 leading-relaxed italic whitespace-pre-line font-sans">
                        {story}
                     </p>
                  </div>
                  <div className="mt-12 pt-10 border-t-4 border-dashed border-slate-100 flex justify-center">
                     <button 
                        onClick={() => setStep('setup')}
                        className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all"
                     >
                        QUAY LẠI
                     </button>
                  </div>
               </div>
            </motion.div>
          )}

          {step === 'reflection' && (
            <motion.div key="reflection" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
               <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-comic space-y-10">
                  <div className="text-center">
                     <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Phút giây lắng đọng</h2>
                     <p className="text-slate-400 font-bold mt-2 italic">Dành 1 phút để cảm nhận bản thân em nhé...</p>
                  </div>

                  <div className="space-y-8">
                     <ReflectionInput 
                        label="Hôm nay em đã cố gắng điều gì?" 
                        value={reflectionAnswers.q1} 
                        onChange={(v: string) => setReflectionAnswers({...reflectionAnswers, q1: v})} 
                     />
                     <ReflectionInput 
                        label="Điều gì khiến em cảm thấy dễ chịu hơn lúc này?" 
                        value={reflectionAnswers.q2} 
                        onChange={(v: string) => setReflectionAnswers({...reflectionAnswers, q2: v})} 
                     />
                     <ReflectionInput 
                        label="Ngày mai em muốn làm tốt hơn điều gì?" 
                        value={reflectionAnswers.q3} 
                        onChange={(v: string) => setReflectionAnswers({...reflectionAnswers, q3: v})} 
                     />
                  </div>

                  <button 
                     onClick={finishChill}
                     className="w-full bg-rose-400 text-white py-6 rounded-[2.5rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none transition-all"
                  >
                     HOÀN THÀNH CHILLZONE
                  </button>
               </div>
            </motion.div>
          )}

          {step === 'finish' && (
            <motion.div key="finish" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center space-y-10 text-center pb-20">
               <div className="relative">
                  <CheckCircle2 size={120} className="text-emerald-500" />
                  <Sparkles className="absolute -top-4 -right-4 text-yellow-500" size={48} />
               </div>

               <div className="space-y-4">
                  <h2 className="text-5xl font-black text-slate-900 tracking-tighter uppercase leading-none italic">Em tuyệt vời lắm!</h2>
                  <p className="text-2xl font-bold text-slate-500 max-w-lg leading-relaxed font-sans">
                     ChillZone ghi nhận nỗ lực chăm sóc bản thân của em. 
                     Giờ là lúc để quay lại chinh phục kiến thức với một tinh thần rạng rỡ nhất!
                  </p>
               </div>

               <div className="bg-rose-50 border-4 border-dashed border-rose-200 p-8 rounded-[3rem] w-full max-w-xl italic font-bold text-rose-900 text-xl">
                  "{aiActivity?.returnSuggestion || 'Em đã sẵn sàng để tiếp tục học tập chưa nào?'}"
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl">
                  <button 
                    onClick={onBack}
                    className="bg-black text-white py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    <LayoutGrid size={24} /> VỀ TRANG CHỦ
                  </button>
                  <button 
                    onClick={() => {
                        setStep('setup');
                        fetchQuote();
                    }}
                    className="bg-white border-4 border-black py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-3"
                  >
                    <RefreshCw size={24} /> THỨ GIÃN THÊM
                  </button>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
         {activeVideo && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 md:p-10"
            >
               <motion.div 
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="bg-white border-4 border-black rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden relative flex flex-col"
               >
                  <div className="p-4 md:p-6 border-b-4 border-black flex justify-between items-center bg-purple-50">
                     <div className="flex items-center gap-3">
                        <Play size={20} className="text-purple-600" />
                        <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-tight italic">{activeVideo.title}</h3>
                     </div>
                     <button 
                        onClick={() => setActiveVideo(null)}
                        className="bg-white border-2 border-black p-2 rounded-xl hover:bg-red-50 transition-colors shadow-comic-hover"
                     >
                        <X size={20} />
                     </button>
                  </div>
                  
                  <div className="flex-1 bg-black relative aspect-video flex items-center justify-center group/video">
                     <video 
                        src={activeVideo.url} 
                        className="w-full h-full max-h-[70vh]" 
                        controls 
                        autoPlay 
                        loop
                        playsInline
                     />
                  </div>

                  <div className="p-6 md:p-8 bg-white space-y-2">
                     <p className="text-lg md:text-xl font-bold text-slate-700 italic">"{activeVideo.description}"</p>
                     <div className="flex items-center gap-4 pt-4 border-t-2 border-dashed border-slate-100">
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Volume2 size={14} /> TIẾNG ĐỘNG CHỮA LÀNH
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Maximize size={14} /> FULLSCREEN SUPPORTED
                        </div>
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
};

const StoryEntry = ({ title, color, onClick }: any) => (
  <button 
    onClick={onClick}
    className={`${color} border-4 border-black p-8 rounded-[2.5rem] flex items-center justify-between shadow-comic hover:translate-y-1 hover:shadow-none transition-all group`}
  >
     <div className="flex items-center gap-6">
        <div className="bg-white p-4 rounded-2xl border-2 border-black group-hover:rotate-6 transition-transform shadow-sm">
           <PenTool size={32} className="text-slate-800" />
        </div>
        <span className="font-black text-2xl text-slate-800 uppercase tracking-tighter italic">{title}</span>
     </div>
     <ChevronRight className="text-slate-400" size={32} />
  </button>
);

const ReflectionInput = ({ label, value, onChange }: any) => (
  <div className="space-y-3">
     <label className="text-sm font-black text-slate-500 uppercase tracking-widest ml-4 flex items-center gap-2 font-sans">
        <MessageSquare size={14} className="text-rose-400" /> {label}
     </label>
     <input 
        type="text"
        placeholder="..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-slate-50 border-4 border-black rounded-2xl p-5 font-bold text-xl focus:bg-white transition-all outline-none font-sans"
     />
  </div>
);

export default ChillZoneScreen;
