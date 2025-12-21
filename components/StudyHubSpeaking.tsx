
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Mic, Square, Sparkles, Award, 
  BookOpen, User, RefreshCw, Send, CheckCircle2, 
  MessageCircle, Star, Brain, History
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import GenYouBot from './GenYouBot';

interface Props {
  onBack: () => void;
}

type SpeakingMode = 'eval' | 'dialogue' | 'chat';

interface SentenceFeedback {
  score: number;
  comment: string;
  transcription: string;
}

// @ts-ignore
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const StudyHubSpeaking: React.FC<Props> = ({ onBack }) => {
  const [mode, setMode] = useState<SpeakingMode>('eval');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingIndex, setRecordingIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const recognitionRef = useRef<any>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  // Accumulated transcript for manual stop mode
  const [currentTranscript, setCurrentTranscript] = useState('');
  
  // Dialogue Mode State
  const [topic, setTopic] = useState('');
  const [dialogue, setDialogue] = useState<string[]>([]);
  const [dialogueFeedback, setDialogueFeedback] = useState<Record<number, SentenceFeedback>>({});
  
  // Chat Mode State
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [isAiTalking, setIsAiTalking] = useState(false);
  const [lastEvalFeedback, setLastEvalFeedback] = useState<SentenceFeedback | null>(null);

  useEffect(() => {
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiTalking]);

  // Cải thiện logic chấm điểm và xử lý văn bản bị nhiễu
  const scorePronunciation = async (transcription: string, targetText?: string) => {
    if (!transcription.trim()) return null;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      // Prompt nâng cao để AI tự làm sạch lỗi lặp từ và chấm điểm chuyên sâu
      const prompt = `Bạn là chuyên gia thẩm định ngôn ngữ tiếng Anh.
      Người học đã nói: "${transcription}"
      ${targetText ? `Câu mẫu yêu cầu: "${targetText}"` : 'Đây là hội thoại tự do.'}
      
      Nhiệm vụ của bạn:
      1. Phân tích độ chính xác, ngữ pháp và từ vựng.
      2. Tự động phát hiện và loại bỏ các từ bị lặp lại do lỗi thu âm (ví dụ: "let's let's" thành "let's").
      3. Chấm điểm từ 1-10 dựa trên năng lực thực tế.
      4. Đưa ra nhận xét cụ thể, khích lệ bằng tiếng Việt (ngắn gọn dưới 3 câu).

      Trả lời duy nhất dưới định dạng JSON: 
      { 
        "score": number, 
        "comment": "string",
        "refinedText": "văn bản đã được sửa lỗi lặp từ"
      }`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });
      
      const result = JSON.parse(response.text);
      return {
        ...result,
        transcription: result.refinedText || transcription
      };
    } catch (e) {
      return { score: 7, comment: "Kết nối AI bị gián đoạn, nhưng bạn nói rất tự tin!", transcription };
    } finally {
      setLoading(false);
    }
  };

  const handleFreeSpeechToggle = () => {
    if (!recognitionRef.current) return alert("Trình duyệt không hỗ trợ nhận diện giọng nói.");
    
    if (!isRecording) {
      setIsRecording(true);
      setCurrentTranscript('');
      
      // Khắc phục lỗi lặp từ bằng cách quản lý resultIndex
      recognitionRef.current.onresult = (event: any) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) setCurrentTranscript(prev => (prev + ' ' + final).trim());
      };
      
      recognitionRef.current.start();
    } else {
      setIsRecording(false);
      recognitionRef.current.stop();
      
      setTimeout(async () => {
        if (currentTranscript.trim()) {
           const feedback = await scorePronunciation(currentTranscript);
           if (feedback) setLastEvalFeedback(feedback);
        }
      }, 500);
    }
  };

  const handleAiChatToggle = () => {
    if (!recognitionRef.current || isAiTalking) return;

    if (!isRecording) {
      setIsRecording(true);
      setCurrentTranscript('');
      recognitionRef.current.onresult = (event: any) => {
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          }
        }
        if (final) setCurrentTranscript(prev => (prev + ' ' + final).trim());
      };
      recognitionRef.current.start();
    } else {
      setIsRecording(false);
      recognitionRef.current.stop();
      
      const speechToProcess = currentTranscript;
      if (!speechToProcess.trim()) return;

      setMessages(prev => [...prev, { role: 'user', text: speechToProcess }]);
      
      setLoading(true);
      setIsAiTalking(true);
      
      const processAiResponse = async () => {
        try {
          const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
          const chatHistory = messages.map(m => ({
            role: m.role === 'model' ? 'model' : 'user',
            parts: [{ text: m.text }]
          }));
          chatHistory.push({ role: 'user', parts: [{ text: speechToProcess }] });

          const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: chatHistory,
            config: { 
              systemInstruction: "You are a friendly and supportive English study partner. Respond concisely in simple English (B1/B2). Keep the conversation dynamic and encourage the student to share more. Ignore any obvious repetition in their input caused by transcription issues." 
            }
          });
          setMessages(prev => [...prev, { role: 'model', text: response.text }]);
        } catch (e) { console.error(e); }
        setIsAiTalking(false);
        setLoading(false);
      };
      processAiResponse();
    }
  };

  const generateDialogue = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    setDialogueFeedback({});
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Tạo một đoạn hội thoại tiếng Anh ngắn (4-5 câu) về chủ đề: "${topic}". Trả lời chỉ bao gồm các câu thoại, mỗi câu một dòng. Không ghi nhãn nhân vật.`,
      });
      setDialogue(response.text.split('\n').filter(s => s.trim().length > 3));
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const handleLineRecord = (index: number) => {
    if (!recognitionRef.current || isRecording) return;
    setRecordingIndex(index);
    setIsRecording(true);
    setCurrentTranscript('');
    
    recognitionRef.current.onresult = (event: any) => {
      let final = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
      }
      if (final) setCurrentTranscript(prev => (prev + ' ' + final).trim());
    };

    recognitionRef.current.start();
  };

  const stopLineRecord = async (index: number) => {
    setIsRecording(false);
    recognitionRef.current.stop();
    setRecordingIndex(null);
    
    setTimeout(async () => {
      if (currentTranscript.trim()) {
        const feedback = await scorePronunciation(currentTranscript, dialogue[index]);
        if (feedback) {
          setDialogueFeedback(prev => ({
            ...prev,
            [index]: feedback
          }));
        }
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#F0FDFA] p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <header className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-white rounded-2xl border-2 border-teal-100 shadow-sm">
               <Mic className="text-teal-400" />
             </div>
             <h2 className="text-2xl font-black text-teal-900 uppercase tracking-tight">LUYỆN NÓI AI</h2>
           </div>
           <button onClick={onBack} className="text-teal-400 font-bold hover:text-teal-600 flex items-center gap-2 transition-colors">
            <ArrowLeft size={20} /> Quay lại
          </button>
        </header>

        {/* Mode Selector */}
        <div className="grid grid-cols-3 gap-2 mb-10 bg-white/50 p-2 rounded-[2rem] border-2 border-teal-50 shadow-sm backdrop-blur-sm">
           <ModeTab active={mode === 'eval'} onClick={() => { setMode('eval'); setIsRecording(false); }} icon={<Star size={16}/>} label="FREE SPEECH" />
           <ModeTab active={mode === 'dialogue'} onClick={() => { setMode('dialogue'); setIsRecording(false); }} icon={<BookOpen size={16}/>} label="HỘI THOẠI" />
           <ModeTab active={mode === 'chat'} onClick={() => { setMode('chat'); setIsRecording(false); }} icon={<Brain size={16}/>} label="AI PARTNER" />
        </div>

        <div className="space-y-8">
           <AnimatePresence mode="wait">
             {mode === 'eval' && (
               <motion.div key="eval" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-10">
                 <div className="bg-white border-4 border-teal-50 rounded-[2.5rem] p-10 shadow-xl text-center max-w-xl w-full border-dashed relative">
                    <h3 className="text-xl font-black text-teal-900 mb-4 uppercase tracking-tighter italic">Nói bất cứ điều gì bạn muốn!</h3>
                    <p className="text-teal-600 font-bold leading-relaxed mb-8">Bấm để bắt đầu, bấm lần nữa để kết thúc và nhận xét chuyên sâu.</p>
                    
                    <div className="flex flex-col items-center gap-6">
                       <BigRecordButton isRecording={isRecording} onClick={handleFreeSpeechToggle} />
                       {isRecording && (
                          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-teal-500 font-black animate-pulse flex items-center gap-2">
                             <span className="w-3 h-3 bg-red-500 rounded-full"></span> ĐANG LẮNG NGHE...
                          </motion.div>
                       )}
                    </div>
                 </div>
                 
                 {lastEvalFeedback && (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-white rounded-[2rem] border-4 border-black p-8 shadow-comic">
                      <div className="flex items-center gap-2 mb-4">
                         <CheckCircle2 className="text-green-500" />
                         <span className="font-black text-teal-900 uppercase tracking-widest">KẾT QUẢ PHÂN TÍCH</span>
                      </div>
                      <p className="italic font-bold text-teal-700 bg-teal-50 p-6 rounded-2xl border border-teal-100 text-lg mb-6 leading-relaxed">
                        "{lastEvalFeedback.transcription}"
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                         <div className="bg-blue-50 p-5 rounded-2xl border-2 border-blue-100 flex flex-col justify-center items-center">
                            <span className="text-[10px] font-black text-blue-400 block mb-1 uppercase tracking-wider">SCORE</span>
                            <span className="text-4xl font-black text-blue-600">{lastEvalFeedback.score} / 10</span>
                         </div>
                         <div className="md:col-span-2 bg-purple-50 p-5 rounded-2xl border-2 border-purple-100 flex flex-col justify-center">
                            <span className="text-[10px] font-black text-purple-400 block mb-1 uppercase tracking-wider">COMMENT</span>
                            <span className="font-bold text-purple-600 text-lg">{lastEvalFeedback.comment}</span>
                         </div>
                      </div>
                   </motion.div>
                 )}
               </motion.div>
             )}

             {mode === 'dialogue' && (
               <motion.div key="dialogue" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                 <div className="bg-white p-3 rounded-[2.5rem] border-2 border-teal-50 flex gap-4 shadow-sm">
                    <input 
                      type="text" placeholder="Nhập chủ đề hội thoại (vd: shopping, travel...)" 
                      className="flex-1 px-8 py-4 bg-teal-50/20 border-2 border-teal-50 rounded-2xl font-bold text-teal-900 outline-none focus:border-teal-200 transition-all"
                      value={topic} onChange={e => setTopic(e.target.value)}
                      onKeyPress={e => e.key === 'Enter' && generateDialogue()}
                    />
                    <button onClick={generateDialogue} className="bg-teal-500 text-white px-10 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-teal-100 active:scale-95 transition-all">
                       {loading ? <RefreshCw className="animate-spin" /> : <Sparkles size={18}/>} TẠO
                    </button>
                 </div>

                 <div className="space-y-4 pb-20">
                   {dialogue.map((line, i) => (
                     <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white border-2 border-teal-50 p-6 rounded-[2rem] shadow-sm relative group">
                        <div className="flex gap-4 items-start">
                           <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center shrink-0 font-black text-teal-400 border border-teal-100 shadow-sm text-sm italic">
                              {i + 1}
                           </div>
                           <div className="flex-1 space-y-4">
                              <p className="text-lg font-bold text-teal-900 leading-snug">{line}</p>
                              <div className="flex items-center gap-4">
                                 <button 
                                   onClick={() => recordingIndex === i ? stopLineRecord(i) : handleLineRecord(i)}
                                   disabled={(isRecording && recordingIndex !== i) || loading}
                                   className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-black text-xs transition-all shadow-sm
                                     ${recordingIndex === i 
                                       ? 'bg-red-500 text-white animate-pulse' 
                                       : 'bg-teal-50 text-teal-500 hover:bg-teal-100 border border-teal-100'
                                     }
                                   `}
                                 >
                                    {recordingIndex === i ? <Square size={14} fill="white" /> : <Mic size={14} />} 
                                    {recordingIndex === i ? 'DỪNG ĐỂ CHẤM' : 'LUYỆN NÓI'}
                                 </button>
                                 
                                 {dialogueFeedback[i] && (
                                    <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl border border-green-100">
                                       <span className="font-black text-green-600 text-xs">{dialogueFeedback[i].score}/10</span>
                                       <span className="text-[10px] font-bold text-green-700">{dialogueFeedback[i].comment}</span>
                                    </div>
                                 )}
                              </div>
                           </div>
                        </div>
                     </motion.div>
                   ))}
                   {dialogue.length === 0 && !loading && (
                       <div className="py-20 text-center opacity-30 border-4 border-dashed border-teal-100 rounded-[3rem]">
                           <MessageCircle size={64} className="mx-auto mb-4" />
                           <p className="font-black uppercase text-lg italic">Nhập chủ đề để tạo kịch bản luyện tập!</p>
                       </div>
                   )}
                 </div>
               </motion.div>
             )}

             {mode === 'chat' && (
               <motion.div key="chat" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col h-[650px] gap-6 w-full">
                 <div className="flex-1 bg-white/80 backdrop-blur-sm border-2 border-teal-50 rounded-[3rem] shadow-xl p-8 overflow-y-auto space-y-6 custom-scrollbar flex flex-col relative border-dashed">
                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-6">
                         <div className="p-8 bg-teal-50 rounded-[2rem] shadow-sm animate-bounce-slow border-2 border-teal-100">
                            <Brain size={64} className="text-teal-400" />
                         </div>
                         <div className="space-y-2">
                            <p className="text-teal-900 font-black text-2xl uppercase tracking-tighter">AI Study Partner</p>
                            <p className="text-teal-500 font-bold italic">Bấm Mic để trò chuyện tiếng Anh lâu dài cùng GenYou!</p>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Support 20+ turns / No limit</span>
                         </div>
                      </div>
                    )}
                    {messages.map((m, i) => (
                      <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                         <div className={`max-w-[85%] p-5 rounded-[2rem] font-bold shadow-sm flex items-start gap-4 text-lg leading-relaxed
                            ${m.role === 'user' 
                              ? 'bg-teal-500 text-white rounded-tr-none' 
                              : 'bg-white text-teal-900 border border-teal-100 rounded-tl-none'
                            }
                         `}>
                           {m.role === 'model' && <GenYouBot mood="happy" className="w-8 h-8 shrink-0 mt-1" />}
                           <p>{m.text}</p>
                         </div>
                      </div>
                    ))}
                    {isAiTalking && (
                       <div className="flex items-center gap-3 text-teal-400 font-black animate-pulse px-4 py-2 bg-teal-50 w-fit rounded-full border border-teal-100">
                          <RefreshCw className="animate-spin" size={16} /> <span>Partner đang phản hồi...</span>
                       </div>
                    )}
                    <div ref={chatEndRef} />
                 </div>

                 <div className="flex flex-col items-center gap-4 pb-4">
                    <div className="relative group">
                       <motion.div 
                          animate={isRecording ? { scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] } : { scale: 1, opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 1.2 }}
                          className="absolute inset-0 bg-teal-400 rounded-full blur-2xl"
                       />
                       <button 
                          onClick={handleAiChatToggle}
                          disabled={isAiTalking || loading}
                          className={`relative w-24 h-24 rounded-full flex flex-col items-center justify-center shadow-xl transition-all active:scale-90 border-4 border-white
                            ${isRecording ? 'bg-red-500' : 'bg-teal-500 hover:bg-teal-600'}
                            disabled:opacity-50
                          `}
                       >
                          {isRecording ? <Square size={28} fill="white" /> : <Mic size={28} className="text-white" />}
                          <span className="text-[9px] font-black text-white/80 uppercase mt-1">
                              {isRecording ? 'BẤM ĐỂ GỬI' : 'BẤM ĐỂ NÓI'}
                          </span>
                       </button>
                    </div>
                    {isRecording && <p className="text-xs font-black text-teal-400 animate-pulse italic uppercase tracking-widest">Đang thu âm lời nhắn của bạn...</p>}
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
  <button onClick={onClick} className={`flex items-center justify-center gap-3 py-4 rounded-[1.5rem] font-black text-xs transition-all ${active ? 'bg-teal-500 text-white shadow-lg' : 'text-teal-400 hover:text-teal-600'}`}>
     {icon} <span className="tracking-widest">{label}</span>
  </button>
);

const BigRecordButton = ({ isRecording, onClick }: any) => (
  <button 
    onClick={onClick} 
    className={`w-32 h-32 rounded-full border-8 border-white shadow-2xl flex flex-col items-center justify-center transition-all active:scale-95 group relative
      ${isRecording ? 'bg-red-500 scale-110' : 'bg-teal-500 hover:bg-teal-600'}
    `}
  >
     {isRecording ? (
       <Square size={36} fill="white" className="text-white" />
     ) : (
       <>
         <Mic size={36} className="text-white mb-2 group-hover:scale-110 transition-transform" />
       </>
     )}
     <span className="text-[10px] font-black text-white/80 uppercase tracking-widest mt-1">
        {isRecording ? 'DỪNG LẠI' : 'BẮT ĐẦU NÓI'}
     </span>
  </button>
);

export default StudyHubSpeaking;
