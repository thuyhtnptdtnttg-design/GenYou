
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Plus, Sparkles, RefreshCw, Layers, Volume2, 
  X, Check, Brain, BookOpen, Award, Quote, HelpCircle, 
  ChevronRight, BookMarked, Lightbulb, Link2, Languages,
  Eye, EyeOff, Info, Target, ListChecks, Music
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Card {
  front: string;          // 1. Từ vựng chính
  ipa: string;            // 2. Phiên âm IPA (UK/US)
  pos: string;            // 4. Từ loại
  back: string;           // 5. Nghĩa tiếng Việt
  exampleEn: string;      // 6. Ví dụ tiếng Anh
  exampleVi: string;      // 7. Dịch ví dụ
  synonyms: string;       // 8. Từ đồng nghĩa
  antonyms: string;       // 9. Từ trái nghĩa
  collocations: string;   // 10. Collocations
  memoryTip: string;      // 11. Mẹo ghi nhớ
  visualHint: string;     // 12. Gợi ý hình ảnh
  audioHint: string;      // 13. Gợi ý âm thanh
  cefr: string;           // Cấp độ CEFR
  miniQuiz: {             // 14. Assessment Mini
    question: string;
    options: string[];
    answer: string;
  };
}

interface Props {
  onBack: () => void;
}

const StudyHubFlashcards: React.FC<Props> = ({ onBack }) => {
  const [step, setStep] = useState<'setup' | 'study' | 'quiz' | 'result'>('setup');
  const [mode, setMode] = useState<'topic' | 'manual'>('topic');
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState('B1');
  const [wordCount, setWordCount] = useState(5);
  const [manualWord, setManualWord] = useState('');
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentIndex, setCurrentIdx] = useState(0);
  const [showDetails, setShowDetails] = useState(false);
  
  // Quiz states
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizAnswered, setQuizAnswered] = useState<string | null>(null);
  const [totalScore, setTotalScore] = useState(0);
  const [showCertifiedStamp, setShowCertifiedStamp] = useState(false);

  // Trigger stamp on perfect score
  useEffect(() => {
    if (step === 'result' && totalScore === cards.length && cards.length > 0) {
      const timer = setTimeout(() => setShowCertifiedStamp(true), 600);
      return () => clearTimeout(timer);
    } else if (step !== 'result') {
      setShowCertifiedStamp(false);
    }
  }, [step, totalScore, cards.length]);

  // Hàm chuẩn hóa chuỗi cực kỳ mạnh mẽ để so sánh chính xác nhất
  const normalizeString = (str: string) => {
    if (!str) return "";
    return str.trim()
              .toLowerCase()
              .replace(/[.,!?;:]+$/, "") // Loại bỏ mọi dấu câu ở cuối chuỗi
              .replace(/\s+/g, " ");     // Thu gọn mọi khoảng trắng thừa thành 1 dấu cách duy nhất
  };

  const generateCardsFromAI = async (input: string, isSingleWord: boolean) => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `Bạn là chuyên gia ngôn ngữ học thiết kế học liệu quốc tế (CEFR, Cambridge, Oxford).
      Nhiệm vụ: Thiết kế bộ thẻ học từ vựng chuẩn quốc tế cho ${isSingleWord ? `từ: "${input}"` : `${wordCount} từ về chủ đề: "${input}"`} trình độ ${level}.
      
      Yêu cầu đầu ra JSON chuẩn xác gồm 14 thành phần cho mỗi thẻ:
      QUAN TRỌNG: Trong phần "miniQuiz", giá trị "answer" PHẢI khớp chính xác từng ký tự (không thừa dấu cách hay dấu chấm ở cuối) với 1 trong các giá trị trong mảng "options".
      
      [{
        "front": "Từ chính",
        "ipa": "IPA UK /.../ | US /.../",
        "pos": "Từ loại (Noun/Verb...)",
        "back": "Nghĩa tiếng Việt học thuật",
        "exampleEn": "Câu ví dụ CEFR ${level}",
        "exampleVi": "Dịch ví dụ",
        "synonyms": "Từ đồng nghĩa",
        "antonyms": "Từ trái nghĩa",
        "collocations": "Collocations thường gặp",
        "memoryTip": "Mẹo ghi nhớ Cognitive Science",
        "visualHint": "Mô tả hình ảnh minh họa",
        "audioHint": "Gợi ý ngữ điệu phát âm",
        "cefr": "${level}",
        "miniQuiz": {
          "question": "Câu hỏi kiểm tra nhanh (Fill-in-the-blank)",
          "options": ["Lựa chọn A", "Lựa chọn B", "Lựa chọn C", "Lựa chọn D"],
          "answer": "Lựa chọn đúng nhất (không chứa dấu câu cuối dòng)"
        }
      }]`;
      
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: { responseMimeType: "application/json" }
      });

      const data = JSON.parse(response.text);
      setCards(isSingleWord ? [...data, ...cards] : data);
      setCurrentIdx(0);
      setStep('study');
      setShowDetails(false);
    } catch (e) {
      console.error(e);
      alert("Lỗi triệu hồi AI. Thử lại sau nhé!");
    } finally {
      setLoading(false);
    }
  };

  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const handleStudyNext = () => {
    if (currentIndex < cards.length - 1) {
      setCurrentIdx(prev => prev + 1);
      setShowDetails(false);
    } else {
      // Finished all cards -> Trigger Assessment
      setStep('quiz');
      setQuizIdx(0);
      setQuizAnswered(null);
      setTotalScore(0);
    }
  };

  const handleQuizChoice = (option: string, answer: string) => {
    if (quizAnswered) return;
    setQuizAnswered(option);
    
    // Sử dụng chuẩn hóa chuỗi để kiểm tra đáp án chính xác
    const isCorrect = normalizeString(option) === normalizeString(answer);
    
    if (isCorrect) setTotalScore(prev => prev + 1);

    setTimeout(() => {
      if (quizIdx < cards.length - 1) {
        setQuizIdx(prev => prev + 1);
        setQuizAnswered(null);
      } else {
        setStep('result');
      }
    }, 1500);
  };

  if (step === 'setup') {
    return (
      <div className="min-h-screen bg-[#FDFCF7] p-4 md:p-8 flex flex-col items-center font-hand">
        <div className="w-full max-w-3xl space-y-8">
          <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-comic">
            <div className="flex items-center gap-4">
               <motion.div 
                 animate={{ y: [0, -3, 0], rotate: [-2, 2, -2] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="p-3 bg-teal-400 rounded-2xl border-2 border-black shadow-comic-hover text-white"
               >
                 <Languages size={32} />
               </motion.div>
               <div>
                  <h2 className="text-3xl font-black text-slate-900 leading-none uppercase italic">Vocab Master</h2>
                  <p className="text-slate-500 font-bold text-sm">International Standard Flashcards</p>
               </div>
            </div>
            <button 
              onClick={onBack} 
              className="flex items-center gap-2 px-8 py-3 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
            >
              <ArrowLeft size={24} /> Quay lại
            </button>
          </header>

          <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic space-y-10">
             <div className="flex gap-4 bg-slate-100 p-2 rounded-[2rem] border-2 border-black w-fit mx-auto">
                <button onClick={() => setMode('topic')} className={`px-8 py-3 rounded-full font-black transition-all ${mode === 'topic' ? 'bg-black text-white' : 'text-slate-400'}`}>CHỦ ĐỀ</button>
                <button onClick={() => setMode('manual')} className={`px-8 py-3 rounded-full font-black transition-all ${mode === 'manual' ? 'bg-black text-white' : 'text-slate-400'}`}>TỪ VỰNG</button>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">TRÌNH ĐỘ (CEFR)</label>
                  <div className="flex flex-wrap gap-2">
                     {['A2', 'B1', 'B2', 'C1'].map(l => (
                       <button key={l} onClick={() => setLevel(l)} className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${level === l ? 'bg-rose-500 text-white border-black shadow-comic-hover' : 'bg-white border-slate-200 text-slate-400 hover:border-black'}`}>{l}</button>
                     ))}
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">SỐ LƯỢNG THẺ</label>
                  <div className="flex gap-2">
                     {[5, 10, 15].map(n => (
                       <button key={n} onClick={() => setWordCount(n)} className={`flex-1 py-3 rounded-xl border-2 font-black transition-all ${wordCount === n ? 'bg-black text-white border-black' : 'bg-white border-slate-200 text-slate-400 hover:border-black'}`}>{n}</button>
                     ))}
                  </div>
                </div>
             </div>

             <div className="space-y-6">
                <div className="bg-slate-50 border-4 border-black rounded-[2rem] p-6 focus-within:ring-4 ring-teal-100 transition-all">
                   <input 
                    type="text" 
                    placeholder={mode === 'topic' ? "Nhập chủ đề (VD: Technology, Nature...)" : "Nhập từ tiếng Anh bạn muốn học..."}
                    className="w-full bg-transparent border-none outline-none font-black text-2xl placeholder:text-slate-300"
                    value={mode === 'topic' ? topic : manualWord}
                    onChange={(e) => mode === 'topic' ? setTopic(e.target.value) : setManualWord(e.target.value)}
                   />
                </div>
                <button 
                  onClick={() => generateCardsFromAI(mode === 'topic' ? topic : manualWord, mode === 'manual')}
                  disabled={loading || (mode === 'topic' ? !topic.trim() : !manualWord.trim())}
                  className="w-full bg-teal-400 text-black py-6 rounded-[2.5rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none active:scale-95 disabled:opacity-50 transition-all flex items-center justify-center gap-4"
                >
                  {loading ? <RefreshCw className="animate-spin" /> : <Brain />} 
                  {loading ? 'ĐANG BIÊN SOẠN...' : 'BẮT ĐẦU NGAY'}
                </button>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'study') {
    const card = cards[currentIndex];
    return (
      <div className="min-h-screen bg-[#F1F5F9] p-4 md:p-8 flex flex-col items-center font-sans overflow-x-hidden">
        <div className="w-full max-w-4xl space-y-6">
          <header className="flex justify-between items-center mb-2">
              <button 
                onClick={() => setStep('setup')} 
                className="flex items-center gap-2 px-6 py-2 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic-hover hover:shadow-none transition-all active:scale-95"
              >
                <ArrowLeft size={20} /> Thiết lập
              </button>
              <div className="flex flex-col items-end gap-1">
                <span className="text-xl font-black text-slate-900 tracking-tighter">Học tập: {currentIndex + 1} / {cards.length}</span>
                <div className="w-32 h-2.5 bg-white border-2 border-black rounded-full overflow-hidden">
                    <motion.div animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }} className="h-full bg-teal-400" />
                </div>
              </div>
          </header>

          <div className="bg-white border-4 border-black rounded-[3rem] shadow-comic overflow-hidden flex flex-col min-h-[600px]">
            {/* 1. TOP SECTION: THE WORD & IPA & AUDIO */}
            <div className="p-10 md:p-14 bg-white border-b-4 border-black text-center relative">
                <div className="absolute top-8 left-8 bg-black text-white px-4 py-1.5 rounded-full text-xs font-black border-2 border-black">
                    CEFR {card.cefr}
                </div>
                <motion.h2 
                  animate={{ y: [0, -4, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="text-6xl md:text-8xl font-black text-slate-900 mb-6 tracking-tighter uppercase"
                >
                  {card.front}
                </motion.h2>
                <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    <div className="bg-slate-50 px-8 py-4 rounded-3xl border-2 border-slate-200 shadow-sm flex items-center gap-4">
                        <p className="text-xl md:text-2xl font-bold text-slate-400 italic font-sans">{card.ipa}</p>
                        <button 
                            onClick={() => speak(card.front)}
                            className="p-3 bg-teal-400 rounded-2xl border-2 border-black hover:scale-110 active:scale-90 transition-all text-white shadow-comic-hover"
                        >
                            <Volume2 size={24} />
                        </button>
                    </div>
                    <span className="text-sm font-black text-rose-500 uppercase tracking-widest bg-rose-50 px-4 py-1.5 rounded-full border-2 border-rose-200 italic">
                        {card.pos}
                    </span>
                </div>
            </div>

            {/* 2. REVEALABLE CONTENT (No Flip) */}
            <div className="p-8 md:p-12 flex flex-col gap-10">
                {!showDetails ? (
                    <button 
                        onClick={() => setShowDetails(true)}
                        className="w-full py-20 border-4 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center gap-4 text-slate-400 hover:text-teal-500 hover:border-teal-200 transition-all group"
                    >
                        <motion.div 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="p-5 bg-slate-50 rounded-full group-hover:bg-teal-50 transition-colors"
                        >
                            <Eye size={48} />
                        </motion.div>
                        <span className="text-2xl font-black uppercase tracking-tighter">Click để hiện thông tin chi tiết</span>
                    </button>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }} 
                        animate={{ opacity: 1, y: 0 }} 
                        className="space-y-12"
                    >
                        <div className="flex flex-col items-center text-center">
                            <h3 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em] mb-2">Vietnamese Meaning</h3>
                            <motion.p 
                              animate={{ y: [0, -2, 0] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              className="text-4xl md:text-5xl font-black text-teal-600 tracking-tight leading-none"
                            >
                              {card.back}
                            </motion.p>
                        </div>

                        <div className="bg-slate-50 border-2 border-black p-8 rounded-[2.5rem] relative">
                            <Quote className="absolute -top-4 -left-4 text-teal-400 bg-white border-2 border-black rounded-full p-1" size={40} />
                            <div className="space-y-4">
                                <p className="text-xl md:text-2xl font-bold text-slate-800 leading-snug">"{card.exampleEn}"</p>
                                <p className="text-lg font-bold text-slate-400 italic">({card.exampleVi})</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <DetailItem icon={<Link2 size={16}/>} label="Collocations" value={card.collocations} color="bg-blue-50 text-blue-700" />
                                <DetailItem icon={<BookMarked size={16}/>} label="Synonyms" value={card.synonyms} color="bg-teal-50 text-teal-700" />
                                <DetailItem icon={<X size={16}/>} label="Antonyms" value={card.antonyms} color="bg-rose-50 text-rose-700" />
                            </div>

                            <div className="space-y-6">
                                <div className="bg-amber-50 border-4 border-amber-200 p-6 rounded-[2rem] flex gap-4 items-start shadow-sm">
                                    <motion.div
                                      animate={{ rotate: [0, 10, -10, 0] }}
                                      transition={{ duration: 4, repeat: Infinity }}
                                    >
                                      <Lightbulb className="text-amber-500 shrink-0 mt-1" size={28} />
                                    </motion.div>
                                    <div>
                                        <span className="text-[10px] font-black text-amber-600 uppercase tracking-widest block mb-1">Memory Tip (Cognitive)</span>
                                        <p className="text-sm font-bold text-amber-900 italic">"{card.memoryTip}"</p>
                                    </div>
                                </div>
                                <div className="bg-purple-50 border-2 border-purple-100 p-5 rounded-2xl flex gap-3 items-center">
                                    <Eye className="text-purple-400" size={20} />
                                    <p className="text-xs font-bold text-purple-700 leading-tight"><strong>Visual:</strong> {card.visualHint}</p>
                                </div>
                                <div className="bg-indigo-50 border-2 border-indigo-100 p-5 rounded-2xl flex gap-3 items-center">
                                    <Music className="text-indigo-400" size={20} />
                                    <p className="text-xs font-bold text-indigo-700 leading-tight"><strong>Intonation:</strong> {card.audioHint}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-10 flex justify-center">
                            <button 
                                onClick={handleStudyNext}
                                className="bg-black text-white px-16 py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:translate-y-1 hover:shadow-none active:scale-95 transition-all flex items-center gap-4"
                            >
                                {currentIndex < cards.length - 1 ? 'ĐÃ THUỘC (TIẾP TỤC)' : 'BẮT ĐẦU KIỂM TRA (QUIZ)'}
                                <ChevronRight size={28} />
                            </button>
                        </div>
                    </motion.div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'quiz') {
    const card = cards[quizIdx];
    const currentQ = card.miniQuiz;
    return (
      <div className="min-h-screen bg-[#F0F9FF] p-4 md:p-8 flex flex-col items-center font-hand relative">
         <div className="w-full max-w-2xl z-10 space-y-8 pt-10">
            <header className="w-full flex justify-between items-center">
               <h2 className="text-3xl font-black text-slate-800 flex items-center gap-3 uppercase tracking-tighter">
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                  >
                    <Brain size={32} className="text-blue-500" />
                  </motion.div> 
                  ASSESSMENT MINI
               </h2>
               <div className="text-xl font-black text-blue-500 bg-white px-6 py-2 rounded-full border-4 border-black shadow-sm">
                 {quizIdx + 1} / {cards.length}
               </div>
            </header>

            <div className="w-full bg-white border-4 border-black rounded-[3rem] p-10 md:p-14 shadow-comic text-center relative overflow-hidden">
               <div className="absolute top-4 left-6 text-xs font-black text-slate-300 uppercase tracking-widest">Testing word: {card.front}</div>
               <h3 className="text-2xl md:text-4xl font-black text-slate-800 leading-tight font-sans mt-4">
                  {currentQ.question}
               </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
               {currentQ.options.map((opt, i) => {
                 // So sánh đã chuẩn hóa để hiển thị trạng thái đúng/sai trực quan
                 const isCorrect = normalizeString(opt) === normalizeString(currentQ.answer);
                 const isSelected = quizAnswered === opt;
                 
                 let btnStyle = "bg-white text-slate-800 border-slate-200 hover:border-black";
                 if (quizAnswered) {
                   if (isCorrect) btnStyle = "bg-green-500 border-black text-white scale-95 shadow-none ring-4 ring-green-100";
                   else if (isSelected) btnStyle = "bg-red-500 border-black text-white scale-95 shadow-none";
                   else btnStyle = "opacity-40 grayscale pointer-events-none";
                 }

                 return (
                   <button 
                    key={i} 
                    onClick={() => handleQuizChoice(opt, currentQ.answer)} 
                    disabled={!!quizAnswered}
                    className={`p-6 rounded-[2rem] border-4 font-black text-xl transition-all shadow-comic hover:shadow-none flex items-center justify-center text-center ${btnStyle}`}
                   >
                      {opt}
                   </button>
                 );
               })}
            </div>

            {quizAnswered && (
               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
                  <p className={`font-black text-xl uppercase tracking-widest ${normalizeString(quizAnswered) === normalizeString(currentQ.answer) ? 'text-green-600' : 'text-red-600'}`}>
                    {normalizeString(quizAnswered) === normalizeString(currentQ.answer) ? 'Excellent!' : 'Keep trying!'}
                  </p>
               </motion.div>
            )}
         </div>
      </div>
    );
  }

  if (step === 'result') {
    const accuracy = Math.round((totalScore / cards.length) * 100);
    return (
      <div className="min-h-screen bg-white p-4 flex flex-col items-center justify-center font-hand relative">
         <div className="w-full max-w-lg bg-[#F8FAFC] border-4 border-black rounded-[4rem] p-12 shadow-comic text-center space-y-10 relative overflow-hidden">
            {/* Passport Stamp Effect */}
            <AnimatePresence>
              {showCertifiedStamp && (
                <motion.div 
                  initial={{ scale: 4, opacity: 0, rotate: 30 }}
                  animate={{ scale: 1, opacity: 0.9, rotate: -15 }}
                  className="absolute top-6 right-6 z-20 pointer-events-none"
                >
                  <div className="border-[6px] border-red-600 rounded-full w-32 h-32 flex flex-col items-center justify-center p-1 text-red-600 mix-blend-multiply drop-shadow-md">
                    <div className="border-2 border-dashed border-red-600 rounded-full w-full h-full flex flex-col items-center justify-center">
                       <span className="text-[8px] font-black uppercase tracking-widest mb-0.5">Passport</span>
                       <h1 className="text-2xl font-black leading-none uppercase text-center">PASSED</h1>
                       <span className="text-[6px] font-bold uppercase mt-0.5">Vocab Master AI</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10 }}>
               {accuracy === 100 ? (
                 <div className="relative inline-block">
                    <Award size={140} className="text-amber-400 mx-auto" fill="currentColor" />
                    <Sparkles className="absolute top-0 right-0 text-amber-500 animate-pulse" size={50} />
                 </div>
               ) : (
                 <BookOpen size={140} className="text-teal-400 mx-auto" />
               )}
            </motion.div>
            
            <div className="space-y-2">
               <h2 className="text-6xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                 {accuracy === 100 ? 'EXCELLENT!' : 'GOOD EFFORT!'}
               </h2>
               <p className="text-2xl font-bold text-slate-500 italic">"Knowledge is the foundation of success"</p>
            </div>

            <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-sm">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Final Score</span>
                <p className="text-5xl font-black text-teal-500">{accuracy}%</p>
                <div className="w-full h-3 bg-slate-100 rounded-full mt-4 border-2 border-black overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${accuracy}%` }} className="h-full bg-teal-400" />
                </div>
            </div>

            <div className="flex flex-col gap-4">
               <button onClick={() => { setStep('setup'); setTotalScore(0); }} className="w-full bg-black text-white py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-3 active:scale-95">
                 <RefreshCw size={24} /> THỬ LẠI CHỦ ĐỀ KHÁC
               </button>
               <button onClick={onBack} className="w-full bg-white text-black py-5 rounded-[2rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none transition-all active:scale-95">
                 VỀ STUDY HUB
               </button>
            </div>
         </div>
      </div>
    );
  }

  return null;
};

const DetailItem = ({ icon, label, value, color }: any) => (
  <div className={`p-5 rounded-2xl border-2 border-black shadow-sm ${color} transition-all hover:scale-102`}>
     <div className="flex items-center gap-2 mb-1">
        <motion.div 
          animate={{ y: [0, -2, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-white p-1 rounded-lg border-2 border-black/10"
        >
          {icon}
        </motion.div>
        <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
     </div>
     <p className="text-sm font-bold leading-tight">{value}</p>
  </div>
);

export default StudyHubFlashcards;
