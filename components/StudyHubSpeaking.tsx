
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Mic, Square, Sparkles, Award, 
  BookOpen, User, RefreshCw, Send, CheckCircle2, 
  MessageCircle, Star, Brain
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onBack: () => void;
}

type SpeakingMode = 'eval' | 'dialogue' | 'chat';

interface SentenceFeedback {
  score: number;
  comment: string;
  transcription: string;
}

const StudyHubSpeaking: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<SpeakingMode>('eval');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Dialogue Mode State
  const [topic, setTopic] = useState('');
  const [dialogue, setDialogue] = useState<string[]>([]);
  const [dialogueFeedback, setDialogueFeedback] = useState<Record<number, SentenceFeedback>>({});
  
  // Chat Mode State
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isAiTalking, setIsAiTalking] = useState(false);

  const generateDialogue = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setDialogueFeedback({});
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tạo một đoạn hội thoại tiếng Anh ngắn (5-6 câu) về chủ đề: "${topic}". Trả lời chỉ bao gồm các câu thoại, mỗi câu một dòng.`,
      });
      setDialogue(response.text.split('\n').filter(s => s.trim().length > 3));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleFreeSpeech = async () => {
    setIsRecording(true);
    // Simulate recording...
    setTimeout(() => {
      setIsRecording(false);
      setLoading(true);
      setTimeout(() => {
        setMessages(prev => [...prev, { 
          role: 'user', 
          text: "I am really excited to improve my English skills with GenYou today!" 
        }]);
        setLoading(false);
      }, 1000);
    }, 2000);
  };

  const handleLineRecord = (index: number) => {
    if (isRecording) return;
    setRecordingIndex(index);
    setIsRecording(true);
    
    // Simulate line scoring
    setTimeout(async () => {
      setIsRecording(false);
      setLoading(true);
      
      const targetSentence = dialogue[index];
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Người học vừa nói câu: "${targetSentence}". Hãy giả vờ họ nói gần đúng. Đưa ra điểm từ 1-10 và 1 nhận xét cực ngắn về phát âm. JSON: {score: number, comment: string}`,
          config: { responseMimeType: "application/json" }
        });
        const fb = JSON.parse(response.text);
        setDialogueFeedback(prev => ({
          ...prev,
          [index]: { score: fb.score, comment: fb.comment, transcription: targetSentence }
        }));
      } catch (e) { console.error(e); }
      
      setLoading(false);
      setRecordingIndex(null);
    }, 2000);
  };

  const handleAiChatVoice = async () => {
    setIsRecording(true);
    // Simulate user speaking to AI
    setTimeout(async () => {
      setIsRecording(false);
      const userSpeech = "Can you tell me how to stay focused during study sessions?";
      setMessages(prev => [...prev, { role: 'user', text: userSpeech }]);
      
      setLoading(true);
      setIsAiTalking(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: userSpeech,
          config: { systemInstruction: "You are a supportive study mentor. Give short, inspiring advice in English." }
        });
        setMessages(prev => [...prev, { role: 'model', text: response.text }]);
      } catch (e) { console.error(e); }
      setIsAiTalking(false);
      setLoading(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA] p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <motion.div 
               animate={{ y: [0, -5, 0] }}
               transition={{ repeat: Infinity, duration: 3 }}
               className="p-3 bg-white rounded-2xl border-2 border-teal-100 shadow-sm"
             >
               <Mic className="text-teal-400" />
             </motion.div>
             <h2 className="text-2xl font-black text-teal-900 uppercase tracking-tight">Luyện Nói AI</h2>
           </div>
           <button onClick={onBack} className="text-teal-400 font-bold hover:text-teal-600 flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Quay lại
          </button>
        </header>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 mb-10 bg-white/50 p-2 rounded-[2rem] border-2 border-teal-50 shadow-sm backdrop-blur-sm">
           <ModeTab active={mode === 'eval'} onClick={() => setMode('eval')} icon={<Star size={16}/>} label="FREE SPEECH" />
           <ModeTab active={mode === 'dialogue'} onClick={() => setMode('dialogue')} icon={<BookOpen size={16}/>} label="HỘI THOẠI" />
           <ModeTab active={mode === 'chat'} onClick={() => setMode('chat')} icon={<Brain size={16}/>} label="AI PARTNER" />
        </div>

        <div className="space-y-8">
           <AnimatePresence mode="wait">
             {mode === 'eval' && (
               <motion.div key="eval" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-10">
                 <div className="bg-white border-2 border-teal-100 rounded-[2.5rem] p-10 shadow-xl text-center max-w-xl">
                    <h3 className="text-xl font-black text-teal-900 mb-4">Nói bất cứ điều gì bạn muốn!</h3>
                    <p className="text-teal-600 font-bold leading-relaxed mb-8">AI sẽ lắng nghe, chuyển thành văn bản và nhận xét độ lưu loát cho bạn.</p>
                    <div className="flex justify-center">
                       <BigRecordButton isRecording={isRecording} onClick={handleFreeSpeech} />
                    </div>
                 </div>
                 
                 {messages.length > 0 && (
                   <div className="w-full bg-white rounded-[2rem] border-2 border-teal-100 p-8 shadow-lg">
                      <div className="flex items-center gap-2 mb-4">
                         <CheckCircle2 className="text-green-500" />
                         <span className="font-black text-teal-900">KẾT QUẢ GẦN NHẤT</span>
                      </div>
                      <p className="italic font-bold text-teal-700 bg-teal-50 p-4 rounded-xl border border-teal-100">"{messages[messages.length-1].text}"</p>
                      <div className="mt-4 flex gap-4">
                         <div className="flex-1 bg-blue-50 p-4 rounded-xl border border-blue-100">
                            <span className="text-[10px] font-black text-blue-400 block mb-1">SCORE</span>
                            <span className="text-2xl font-black text-blue-600">8.5 / 10</span>
                         </div>
                         <div className="flex-[2] bg-purple-50 p-4 rounded-xl border border-purple-100">
                            <span className="text-[10px] font-black text-purple-400 block mb-1">COMMENT</span>
                            <span className="font-bold text-purple-600">Phát âm rất tự nhiên, tốc độ nói vừa phải!</span>
                         </div>
                      </div>
                   </div>
                 )}
               </motion.div>
             )}

             {mode === 'dialogue' && (
               <motion.div key="dialogue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="bg-white p-4 rounded-[2rem] border-2 border-teal-50 flex gap-4 shadow-sm">
                    <input 
                      type="text" placeholder="Nhập chủ đề hội thoại..." 
                      className="flex-1 px-6 py-3 bg-teal-50/30 border-2 border-teal-100 rounded-2xl font-bold text-teal-900 outline-none focus:border-teal-300"
                      value={topic} onChange={e => setTopic(e.target.value)}
                    />
                    <button onClick={generateDialogue} className="bg-teal-500 text-white px-8 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-teal-100 active:scale-95 transition-all">
                       {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18}/>} TẠO
                    </button>
                 </div>

                 <div className="space-y-4">
                   {dialogue.map((line, i) => (
                     <motion.div 
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white border-2 border-teal-50 p-6 rounded-[2rem] shadow-sm relative group"
                     >
                        <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 bg-teal-50 rounded-full flex items-center justify-center shrink-0 font-black text-teal-400 border border-teal-100">
                              {i + 1}
                           </div>
                           <div className="flex-1">
                              <p className="text-lg font-bold text-teal-900 leading-tight mb-4">{line}</p>
                              
                              {/* Action Row */}
                              <div className="flex items-center gap-4">
                                 <button 
                                   onClick={() => handleLineRecord(i)}
                                   disabled={isRecording}
                                   className={`flex items-center gap-2 px-6 py-2 rounded-full font-black text-xs transition-all
                                     ${recordingIndex === i 
                                       ? 'bg-red-500 text-white animate-pulse' 
                                       : 'bg-teal-50 text-teal-500 hover:bg-teal-100'
                                     }
                                   `}
                                 >
                                    <Mic size={14} /> {recordingIndex === i ? 'ĐANG LẮNG NGHE...' : 'LUYỆN NÓI'}
                                 </button>
                                 
                                 <AnimatePresence>
                                    {dialogueFeedback[i] && (
                                       <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 flex-1 bg-green-50 p-2 px-4 rounded-full border border-green-100">
                                          <div className="bg-white px-2 py-0.5 rounded-lg border border-green-200 font-black text-green-600 text-xs shadow-sm">
                                             {dialogueFeedback[i].score}/10
                                          </div>
                                          <p className="text-[11px] font-bold text-green-700 truncate">{dialogueFeedback[i].comment}</p>
                                       </motion.div>
                                    )}
                                 </AnimatePresence>
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                 </div>
               </motion.div>
             )}

             {mode === 'chat' && (
               <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[600px] gap-6">
                 <div className="flex-1 bg-white/70 backdrop-blur-sm border-2 border-teal-50 rounded-[2.5rem] shadow-xl p-8 overflow-y-auto space-y-6 custom-scrollbar">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                         <div className="p-6 bg-teal-50 rounded-full animate-bounce-slow">
                            <User size={48} className="text-teal-400" />
                         </div>
                         <p className="text-teal-400 font-black text-xl">Bấm Mic để trò chuyện tiếng Anh cùng AI!</p>
                      </div>
                    )}
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[80%] p-5 rounded-2xl font-bold shadow-sm flex items-start gap-3
                            ${m.role === 'user' 
                              ? 'bg-teal-500 text-white rounded-tr-none' 
                              : 'bg-white text-teal-900 border border-teal-100 rounded-tl-none'
                            }
                         `}>
                           {m.role === 'model' && <MessageCircle size={18} className="shrink-0 mt-1 opacity-50" />}
                           <p className="leading-relaxed">{m.text}</p>
                         </div>
                      </div>
                    ))}
                    {isAiTalking && (
                       <div className="flex items-center gap-2 text-teal-400 font-black animate-pulse">
                          <RefreshCw className="animate-spin" size={14} /> AI đang phản hồi...
                       </div>
                    )}
                 </div>

                 <div className="flex justify-center pb-4">
                    <div className="relative group">
                       <motion.div 
                          animate={isRecording ? { scale: [1, 1.4, 1], opacity: [1, 0.4, 1] } : { scale: 1, opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="absolute inset-0 bg-teal-400 rounded-full blur-xl"
                       />
                       <button 
                          onClick={handleAiChatVoice}
                          disabled={isRecording || isAiTalking}
                          className={`relative w-24 h-24 rounded-full flex items-center justify-center shadow-xl transition-all active:scale-90
                            ${isRecording ? 'bg-red-500' : 'bg-teal-500 hover:bg-teal-600'}
                            disabled:opacity-50
                          `}
                       >
                          {isRecording ? <Square size={32} fill="white" className="text-white" /> : <Mic size={32} className="text-white" />}
                       </button>
                    </div>
                 </div>
               </motion.div>
             )}
           </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const ModeTab = ({ active, onClick, icon, label }: any) => (
  <button onClick={onClick} className={`flex items-center justify-center gap-2 py-3 rounded-[1.5rem] font-black text-xs transition-all ${active ? 'bg-teal-500 text-white shadow-md' : 'text-teal-300 hover:text-teal-500'}`}>
     {icon} <span>{label}</span>
  </button>
);

const BigRecordButton = ({ isRecording, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`w-32 h-32 rounded-full border-4 border-white shadow-2xl flex flex-col items-center justify-center transition-all active:scale-95
      ${isRecording ? 'bg-red-500 scale-110' : 'bg-teal-500 hover:bg-teal-600'}
    `}
  >
     {isRecording ? (
       <Square size={40} fill="white" className="text-white" />
     ) : (
       <>
         <Mic size={40} className="text-white mb-1" />
         <span className="text-[10px] font-black text-white/70 uppercase">Bấm để nói</span>
       </>
     )}
  </button>
);

export default StudyHubSpeaking;
