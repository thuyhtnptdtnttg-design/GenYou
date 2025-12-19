
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Zap, BookOpen, Wind, 
  Send, RefreshCw, CheckCircle2, ShieldAlert,
  Sparkles, Coffee, LayoutGrid, MessageCircleHeart
} from 'lucide-react';
import GenYouBot from './GenYouBot';
import { getSOSMoodResponse } from '../services/geminiService';
// Fix: recordInteraction is the intended exported member for logging activity
import { recordInteraction } from '../services/storageService';

interface Props {
  onBack: () => void;
  onGoToResources: () => void;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SOSMoodScreen: React.FC<Props> = ({ onBack, onGoToResources }) => {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Chào em, mình là SOSMood đây. Mình ở đây không phải để đánh giá, mà chỉ để lắng nghe và đồng hành cùng em thôi. Hôm nay em thấy thế nào? Có chuyện gì đang làm em bận lòng không, kể mình nghe với..." }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [startTime] = useState(Date.now());
  const chatEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);

    const response = await getSOSMoodResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  // Fix: Replaced saveSOSMoodLog with recordInteraction and mapped internal state to PostState
  const handleFinish = () => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    // Logic ẩn để đánh giá trạng thái cảm xúc tổng hợp (Aggregate)
    // Mapping to PostState: 'Tích cực' | 'Bình thường' | 'Cần nghỉ ngơi'
    let state: 'Tích cực' | 'Bình thường' | 'Cần nghỉ ngơi' = 'Tích cực';
    
    if (messages.length > 8) {
      state = 'Cần nghỉ ngơi';
    } else if (messages.length > 4) {
      state = 'Bình thường';
    }

    recordInteraction({
      timestamp: Date.now(),
      module: 'SOSMood',
      activityType: 'Tự nhìn lại',
      duration: durationSec,
      status: 'Hoàn thành',
      state: state
    });

    setIsFinished(true);
  };

  return (
    <div className="min-h-screen bg-[#FFF5F7] flex flex-col font-sans overflow-hidden relative">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      {/* Header */}
      <header className="z-20 bg-white/90 backdrop-blur-md border-b-4 border-black p-4 flex justify-between items-center px-6 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="bg-pink-500 p-2.5 rounded-2xl border-2 border-black shadow-comic-hover rotate-[-3deg]">
            <MessageCircleHeart size={26} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 leading-none">SOS Mood</h2>
            <p className="text-[10px] font-black text-pink-400 uppercase tracking-[0.2em] mt-1">Lắng nghe & Thấu cảm</p>
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={onGoToResources} className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-white border-2 border-black rounded-xl font-black text-xs shadow-comic-hover hover:translate-y-0.5 transition-all">
            <BookOpen size={14} /> TÀI LIỆU HỖ TRỢ
          </button>
          <button onClick={onBack} className="p-2.5 bg-white border-2 border-black rounded-xl hover:bg-slate-50 transition-all shadow-comic-hover">
            <ArrowLeft size={20} />
          </button>
        </div>
      </header>

      {/* Main Chat Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-8 custom-scrollbar relative z-10">
        <AnimatePresence initial={false}>
          {messages.map((m, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-4 max-w-[90%] md:max-w-[75%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <div className="shrink-0 mt-1">
                  {m.role === 'model' ? (
                    <div className="w-12 h-12 bg-white rounded-2xl border-2 border-pink-200 flex items-center justify-center shadow-sm">
                       <GenYouBot mood="happy" className="w-9 h-9" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-black rounded-2xl border-2 border-white flex items-center justify-center text-white font-black text-xs shadow-md">EM</div>
                  )}
                </div>
                <div className={`p-5 md:p-7 rounded-[2.2rem] border-2 border-black font-bold text-lg shadow-comic-hover leading-relaxed
                  ${m.role === 'user' ? 'bg-pink-100 rounded-tr-none' : 'bg-white rounded-tl-none'}
                `}>
                  {m.text}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <div className="flex justify-start gap-4">
             <div className="shrink-0"><div className="w-12 h-12 bg-white rounded-2xl border-2 border-pink-200 flex items-center justify-center shadow-sm"><GenYouBot mood="thinking" className="w-9 h-9" /></div></div>
             <div className="bg-white border-2 border-black rounded-full px-8 py-4 flex items-center gap-3 shadow-sm">
                <RefreshCw size={16} className="animate-spin text-pink-500" />
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest italic">Mình đang lắng nghe...</span>
             </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </main>

      {/* Input or Finish Screen */}
      <footer className="p-6 md:p-10 bg-white border-t-4 border-black z-20 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
        {!isFinished ? (
          <div className="max-w-4xl mx-auto space-y-6">
             <div className="flex gap-4 items-center bg-slate-50 border-4 border-black p-3 rounded-[2.5rem] focus-within:ring-8 ring-pink-100/50 transition-all shadow-inner">
                <input 
                  type="text" 
                  placeholder="Em cứ chia sẻ nhé, mình đang nghe đây..."
                  className="flex-1 bg-transparent border-none outline-none font-bold text-xl px-6 py-2 placeholder:text-slate-300"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                />
                <button 
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="bg-pink-500 text-white p-5 rounded-full border-2 border-black shadow-comic-hover hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
                >
                  <Send size={22} />
                </button>
             </div>
             <div className="flex justify-center">
                <button 
                  onClick={handleFinish}
                  className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] hover:text-pink-600 transition-colors py-2 group flex items-center gap-2"
                >
                  <RefreshCw size={12} className="group-hover:rotate-180 transition-transform duration-700" />
                  Kết thúc trò chuyện
                </button>
             </div>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto text-center space-y-8 py-4">
            <div className="bg-white border-4 border-black p-10 md:p-14 rounded-[4rem] shadow-comic space-y-6 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-3 bg-pink-500"></div>
               <div className="flex justify-center"><CheckCircle2 size={64} className="text-emerald-500" /></div>
               <h3 className="text-3xl font-black text-slate-900 uppercase tracking-tighter">Cảm ơn em đã tin tưởng mình</h3>
               <p className="text-xl font-bold text-slate-600 italic leading-relaxed">
                  "Sức mạnh lớn nhất của một người là khi họ dám đối diện với cảm xúc của chính mình." <br/>
                  Mình ghi nhận sự nỗ lực của em ngày hôm nay. Em làm tốt lắm!
               </p>
               <div className="bg-amber-50 border-4 border-dashed border-amber-200 p-6 rounded-3xl flex items-center gap-4 text-left">
                  <ShieldAlert className="text-amber-500 shrink-0" size={32} />
                  <p className="text-sm font-bold text-amber-800 leading-tight">
                    <span className="block uppercase font-black mb-1">Lời nhắc an toàn:</span>
                    Mọi chuyện rồi sẽ ổn thôi, nhưng nếu em thấy mọi thứ quá sức, đừng giữ một mình. Hãy tìm đến thầy cô hoặc ba mẹ để có thêm một điểm tựa vững chắc nhé!
                  </p>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <button onClick={() => window.location.reload()} className="bg-black text-white py-6 rounded-[2.5rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 group">
                  <Coffee size={24} className="group-hover:rotate-12 transition-transform" /> THƯ GIÃN CHÚT ĐÃ
               </button>
               <button onClick={onBack} className="bg-white border-4 border-black py-6 rounded-[2.5rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 group">
                  <LayoutGrid size={24} className="group-hover:scale-110 transition-transform" /> QUAY LẠI HỌC TẬP
               </button>
            </div>
          </motion.div>
        )}
      </footer>
    </div>
  );
};

export default SOSMoodScreen;
