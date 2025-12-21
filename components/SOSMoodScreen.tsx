
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Heart, Zap, BookOpen, Wind, 
  MessageSquare, Book, ChevronRight, Send, RefreshCw
} from 'lucide-react';
import GenYouBot from './GenYouBot';
import { getSOSMoodResponse } from '../services/geminiService';
import { recordInteraction } from '../services/storageService';

interface Props {
  onBack: () => void;
  onGoToResources: () => void;
}

type ChatMode = 'tam-su' | 'dong-luc' | 'mua-thi';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const SOSMoodScreen: React.FC<Props> = ({ onBack, onGoToResources }) => {
  const [mode, setMode] = useState<ChatMode>('tam-su');
  const [showBreathing, setShowBreathing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: "Chào bạn! Mình là SOS Mood. Bạn đang cảm thấy thế nào? Hãy chọn một chế độ trò chuyện bên trái để mình hỗ trợ bạn tốt nhất nhé! 🌿" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
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
    const newMessages = [...messages, { role: 'user', text: userMsg } as Message];
    setMessages(newMessages);
    setLoading(true);

    // Call Gemini for psychological response
    const response = await getSOSMoodResponse(userMsg, messages);
    setMessages(prev => [...prev, { role: 'model', text: response }]);
    setLoading(false);
  };

  const handleFinishSession = () => {
    const durationSec = Math.floor((Date.now() - startTime) / 1000);
    recordInteraction({
      timestamp: Date.now(),
      module: 'SOSMood',
      activityType: 'Tự nhìn lại',
      duration: durationSec,
      status: 'Hoàn thành',
      state: messages.length > 5 ? 'Tích cực' : 'Bình thường'
    });
    onBack();
  };

  return (
    <div className="min-h-screen bg-white flex font-sans overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-[#FFF5F7] border-r border-pink-100 flex flex-col p-6 overflow-y-auto hidden md:flex">
        <div className="flex items-center gap-3 mb-10">
           <div className="bg-[#2DD4BF] p-2 rounded-xl border border-teal-800/20 shadow-sm">
             <MessageSquare className="text-white" size={24} />
           </div>
           <h2 className="text-2xl font-black text-gray-800">SOS Mood</h2>
        </div>

        <div className="space-y-8 flex-1">
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">CHẾ ĐỘ TRÒ CHUYỆN</p>
            <div className="space-y-3">
               <SidebarButton 
                  active={mode === 'tam-su'} 
                  onClick={() => setMode('tam-su')}
                  icon={<Heart size={18} />} 
                  title="Góc Tâm Sự" 
                  desc="Chia sẻ, an ủi và thấu hiểu" 
                  color="text-pink-500"
               />
               <SidebarButton 
                  active={mode === 'dong-luc'} 
                  onClick={() => setMode('dong-luc')}
                  icon={<Zap size={18} />} 
                  title="Góc Động Lực" 
                  desc="Vượt qua trì hoãn & lười biếng" 
                  color="text-yellow-500"
               />
               <SidebarButton 
                  active={mode === 'mua-thi'} 
                  onClick={() => setMode('mua-thi')}
                  icon={<BookOpen size={18} />} 
                  title="Góc Mùa Thi" 
                  desc="Giảm lo âu & ôn thi hiệu quả" 
                  color="text-blue-500"
               />
            </div>
          </div>

          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">CÔNG CỤ HỖ TRỢ</p>
            <div className="space-y-3">
               <SidebarButton 
                  onClick={() => setShowBreathing(true)}
                  icon={<Wind size={18} />} 
                  title="Hít thở thư giãn" 
                  color="text-teal-500"
               />
               <SidebarButton 
                  onClick={onGoToResources}
                  icon={<Book size={18} />} 
                  title="Mẹo & Tài liệu" 
                  color="text-purple-500"
               />
            </div>
          </div>
        </div>

        <button 
          onClick={handleFinishSession}
          className="mt-8 flex items-center justify-center gap-2 px-6 py-3 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
        >
          <ArrowLeft size={20} /> Quay lại
        </button>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 bg-white relative flex flex-col">
        {/* Background Grid Pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.02]" 
           style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '24px 24px' }}></div>

        {/* Mobile Header */}
        <div className="md:hidden p-4 bg-[#FFF5F7] border-b flex justify-between items-center">
            <h2 className="font-black text-xl text-teal-600 uppercase italic">SOS Mood</h2>
            <button onClick={handleFinishSession} className="p-2 bg-white border-2 border-black rounded-lg shadow-comic-hover"><ArrowLeft size={18}/></button>
        </div>

        <div className="flex-1 p-6 md:p-10 overflow-y-auto z-10 space-y-6 custom-scrollbar">
           <AnimatePresence initial={false}>
             {messages.map((m, i) => (
               <motion.div 
                 key={i}
                 initial={{ opacity: 0, y: 10 }}
                 animate={{ opacity: 1, y: 0 }}
                 className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
               >
                 <div className={`flex gap-3 max-w-[85%] md:max-w-[70%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                   <div className="shrink-0 mt-1">
                      {m.role === 'model' ? (
                        <div className="w-10 h-10 bg-white rounded-full border-2 border-teal-200 flex items-center justify-center shadow-sm">
                           <GenYouBot mood="happy" className="w-8 h-8" />
                        </div>
                      ) : (
                        <div className="w-10 h-10 bg-black rounded-full border-2 border-white flex items-center justify-center text-white font-black text-[10px] shadow-sm">EM</div>
                      )}
                   </div>
                   <div className={`p-4 rounded-2xl font-bold text-lg shadow-sm leading-relaxed
                      ${m.role === 'user' 
                        ? 'bg-teal-500 text-white rounded-tr-none' 
                        : 'bg-gray-50 text-slate-800 border border-slate-200 rounded-tl-none'
                      }
                   `}>
                     {m.text}
                   </div>
                 </div>
               </motion.div>
             ))}
           </AnimatePresence>

           {loading && (
             <div className="flex justify-start gap-3">
                <div className="shrink-0"><GenYouBot mood="thinking" className="w-10 h-10" /></div>
                <div className="bg-white border-2 border-slate-100 rounded-full px-6 py-3 flex items-center gap-2 shadow-sm">
                   <RefreshCw size={14} className="animate-spin text-teal-500" />
                   <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">Mình đang lắng nghe...</span>
                </div>
             </div>
           )}
           <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="p-4 md:p-8 bg-white z-10 border-t border-gray-100">
           <div className="max-w-4xl mx-auto flex gap-4 items-center bg-gray-50 border-2 border-gray-200 p-2 rounded-2xl focus-within:border-teal-500 transition-all shadow-inner">
              <input 
                 type="text" 
                 placeholder="Chia sẻ điều bạn muốn cùng chuyên gia tâm lý AI..."
                 className="flex-1 bg-transparent border-none focus:ring-0 font-bold px-4 py-2 text-lg outline-none"
                 value={input}
                 onChange={(e) => setInput(e.target.value)}
                 onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="bg-teal-500 text-white p-4 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-comic-hover disabled:opacity-50"
              >
                <Send size={22} />
              </button>
           </div>
        </div>
      </main>

      {/* Breathing Modal Overlay */}
      <AnimatePresence>
        {showBreathing && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-teal-900/40 backdrop-blur-md flex items-center justify-center p-6"
          >
             <motion.div 
               initial={{ scale: 0.9 }}
               animate={{ scale: 1 }}
               exit={{ scale: 0.9 }}
               className="bg-white rounded-[3rem] border-4 border-black p-12 max-w-lg w-full text-center relative shadow-comic"
             >
                <button 
                   onClick={() => setShowBreathing(false)}
                   className="absolute top-6 right-6 p-2 bg-gray-100 rounded-full hover:bg-red-100 transition-colors"
                >
                  <ArrowLeft className="rotate-90" />
                </button>
                <h3 className="text-3xl font-black mb-8 uppercase tracking-tight">Hít thở sâu</h3>
                <div className="flex flex-col items-center gap-12">
                   <motion.div 
                     animate={{ 
                       scale: [1, 1.5, 1],
                     }}
                     transition={{ 
                       duration: 4, 
                       repeat: Infinity,
                       ease: "easeInOut"
                     }}
                     className="w-40 h-40 bg-teal-100 border-4 border-teal-500 rounded-full flex items-center justify-center relative"
                   >
                      <motion.div 
                        animate={{ 
                          opacity: [0, 1, 0],
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                        className="text-teal-600 font-black text-xl"
                      >
                         HÍT VÀO
                      </motion.div>
                   </motion.div>
                   <p className="text-gray-500 font-bold italic leading-relaxed">
                     Nhắm mắt lại, thả lỏng vai và theo dõi nhịp tròn xanh... <br/>
                     Bạn đang làm rất tốt!
                   </p>
                   <button 
                     onClick={() => setShowBreathing(false)}
                     className="px-8 py-3 bg-teal-500 text-white font-black rounded-xl border-2 border-black shadow-comic-hover"
                   >
                     HOÀN THÀNH
                   </button>
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SidebarButton = ({ active, onClick, icon, title, desc, color }: any) => (
  <button 
    onClick={onClick}
    className={`w-full text-left p-4 rounded-2xl border-2 transition-all flex items-center gap-4 group
      ${active 
        ? 'bg-white border-black shadow-comic-hover' 
        : 'bg-white/50 border-transparent hover:border-gray-200'
      }
    `}
  >
    <div className={`p-2 rounded-lg transition-transform group-hover:rotate-6 ${color}`}>
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-black text-gray-800 text-sm leading-none mb-1">{title}</h4>
      {desc && <p className="text-[10px] font-bold text-gray-400 leading-tight">{desc}</p>}
    </div>
    {active && <ChevronRight size={14} className="text-gray-300" />}
  </button>
);

export default SOSMoodScreen;
