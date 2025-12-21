
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Zap, RefreshCw, Sparkles, Book, PenTool, 
  Languages, Zap as Physics, FlaskConical, Beaker, History, Globe, 
  Heart, CheckCircle2, Award, HelpCircle, Brain,
  Trophy, Lightbulb, Calculator, Search, ExternalLink,
  ChevronDown, GraduationCap, Timer, Smile, Download, Eye, EyeOff
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { recordInteraction } from '../services/storageService';

interface Props { studentName: string; studentId: string; onBack: () => void; }
interface QuizQuestion { question: string; options: string[]; answer: string; explanation: string; }
interface Flashcard { front: string; back: string; }
interface Lesson { subject: string; grade: string; level: string; title: string; part1_core: string[]; part2_examples: { example: string; solution: string }[]; flashcards: Flashcard[]; quiz: QuizQuestion[]; }

const SUBJECTS = [
  { id: 'math', name: 'Toán học', icon: <Calculator className="text-blue-500" />, color: 'bg-blue-50' },
  { id: 'literature', name: 'Ngữ văn', icon: <PenTool className="text-rose-500" />, color: 'bg-rose-50' },
  { id: 'english', name: 'Tiếng Anh', icon: <Languages className="text-sky-500" />, color: 'bg-sky-50' },
  { id: 'physics', name: 'Vật lý', icon: <Physics className="text-purple-500" />, color: 'bg-purple-50' },
  { id: 'chemistry', name: 'Hóa học', icon: <FlaskConical className="text-emerald-500" />, color: 'bg-emerald-50' },
  { id: 'biology', name: 'Sinh học', icon: <Beaker className="text-green-500" />, color: 'bg-green-50' },
  { id: 'history', name: 'Lịch sử', icon: <History className="text-amber-500" />, color: 'bg-amber-50' },
  { id: 'geography', name: 'Địa lý', icon: <Globe className="text-cyan-500" />, color: 'bg-cyan-50' },
  { id: 'lifeskills', name: 'Kỹ năng sống', icon: <Heart className="text-pink-500" />, color: 'bg-pink-50' },
];

const BrainCandyScreen: React.FC<Props> = ({ studentName, studentId, onBack }) => {
  const [step, setStep] = useState<'setup' | 'study_core' | 'flashcards' | 'quiz' | 'personalization'>('setup');
  const [selectedSubject, setSelectedSubject] = useState(SUBJECTS[0].id);
  const [grade, setGrade] = useState('10');
  const [level, setLevel] = useState('Cơ bản');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(false);
  const [flashcardIdx, setFlashcardIdx] = useState(0);
  const [showFlashcardAnswer, setShowFlashcardAnswer] = useState(false);
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number>(0);
  const [confidence, setConfidence] = useState<'Thấp' | 'Trung bình' | 'Cao'>('Trung bình');
  const [personalFeedback, setPersonalFeedback] = useState<string>('');

  const generateLessonAI = async () => {
    setLoading(true);
    const subjectName = SUBJECTS.find(s => s.id === selectedSubject)?.name;
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Bạn là BrainCandy. Tạo bài học mô hình 4 tầng cho Lớp ${grade}, Môn ${subjectName}, Chủ đề ${searchQuery || 'Kiến thức trọng tâm'}. JSON format.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt, config: { responseMimeType: "application/json" } });
      const data = JSON.parse(response.text);
      setCurrentLesson({ ...data, subject: subjectName, grade, level });
      setStep('study_core');
      setStartTime(Date.now());
    } catch (e) { alert("Lỗi kết nối AI."); } finally { setLoading(false); }
  };

  const handleQuizAnswer = (ans: string) => {
    if (selectedAnswer) return;
    setSelectedAnswer(ans);
    if (ans === currentLesson?.quiz[quizIdx].answer) setQuizScore(prev => prev + 1);
    setShowExplanation(true);
  };

  const nextQuiz = () => {
    if (quizIdx < 4) { setQuizIdx(quizIdx + 1); setSelectedAnswer(null); setShowExplanation(false); } 
    else { generatePersonalization(); }
  };

  const generatePersonalization = async () => {
    setLoading(true);
    const duration = Math.floor((Date.now() - startTime) / 1000);
    const timeStr = `${Math.floor(duration / 60)} phút ${duration % 60} giây`;
    
    // RECORD INTERACTION HERE
    recordInteraction({
      timestamp: Date.now(),
      module: 'BrainCandy',
      activityType: 'Học tập',
      duration: duration,
      status: quizScore >= 4 ? 'Hoàn thành' : 'Một phần',
      state: quizScore >= 3 ? 'Tích cực' : 'Bình thường'
    });

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `BrainCandy Assessment cho ${studentName}. Kết quả ${quizScore}/5, thời gian ${timeStr}, tự tin ${confidence}. Đánh giá khích lệ.`;
      const response = await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: prompt });
      setPersonalFeedback(response.text);
      setStep('personalization');
    } catch (e) { setPersonalFeedback("Làm tốt lắm!"); setStep('personalization'); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-hand p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      <div className="w-full max-w-5xl z-10 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-6 rounded-3xl shadow-comic gap-4">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-pink-500 rounded-2xl border-2 border-black rotate-[-3deg] shadow-comic-hover"><Zap size={32} className="text-white" fill="white" /></div>
             <div>
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none tracking-tighter">BrainCandy</h1>
                <p className="text-slate-500 font-bold text-sm md:text-lg italic">Kiến thức CỐT LÕI - Học tập CÁ NHÂN HÓA</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-2xl hover:translate-y-1 transition-all shadow-comic-hover active:scale-95"><ArrowLeft size={24} /></button>
        </header>

        {step === 'setup' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 shadow-comic flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><GraduationCap size={14} /> Khối Lớp</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                     {['10', '11', '12'].map(g => (
                       <button key={g} onClick={() => setGrade(g)} className={`flex-1 py-2 rounded-xl font-black text-lg transition-all ${grade === g ? 'bg-black text-white shadow-md' : 'text-slate-400'}`}>Lớp {g}</button>
                     ))}
                  </div>
               </div>
               <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 shadow-comic flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Zap size={14} /> Trình độ</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                     {['Cơ bản', 'Trung bình', 'Khá'].map(l => (
                       <button key={l} onClick={() => setLevel(l)} className={`flex-1 py-2 rounded-xl font-black text-sm md:text-base transition-all ${level === l ? 'bg-pink-500 text-white shadow-md' : 'text-slate-400'}`}>{l}</button>
                     ))}
                  </div>
               </div>
               <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 shadow-comic flex flex-col gap-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Search size={14} /> Chủ đề cụ thể</label>
                  <input type="text" placeholder="VD: Quang hợp, Bất đẳng thức..." className="w-full bg-slate-50 border-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-lg outline-none focus:border-black transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
               {SUBJECTS.map(sub => (
                 <button key={sub.id} onClick={() => setSelectedSubject(sub.id)} className={`${sub.color} border-4 ${selectedSubject === sub.id ? 'border-pink-500 ring-4 ring-pink-100' : 'border-black'} rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center gap-4 transition-all shadow-comic hover:shadow-none h-full relative group`}>
                    <div className="bg-white p-4 rounded-2xl border-2 border-black shadow-sm group-hover:rotate-6 transition-transform">{sub.icon}</div>
                    <span className="text-lg font-black text-slate-800 uppercase tracking-tighter">{sub.name}</span>
                 </button>
               ))}
            </div>
            <button onClick={generateLessonAI} disabled={loading} className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-3xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50">
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />} {loading ? 'ĐANG CHUẨN BỊ...' : 'HỌC NGAY'}
            </button>
          </motion.div>
        )}

        {step === 'study_core' && currentLesson && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto w-full pb-10">
            <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-blue-400 via-pink-400 to-yellow-400"></div>
               <div className="mb-8 border-b-4 border-black pb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tighter">{currentLesson.title}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs mt-1">{currentLesson.subject} • Lớp {currentLesson.grade} • {currentLesson.level}</p>
                  </div>
                  <div className="hidden md:block"><Brain size={48} className="text-slate-200" /></div>
               </div>
               <div className="space-y-10">
                  <section>
                    <h3 className="text-xl font-black text-pink-600 uppercase mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-pink-500 rounded-full"></div> PHẦN 1: KIẾN THỨC CỐT LÕI</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {currentLesson.part1_core.map((point, i) => (
                         <div key={i} className="flex gap-3 items-start bg-slate-50 p-4 rounded-2xl border-2 border-slate-100">
                            <span className="bg-white w-6 h-6 rounded-full border-2 border-black flex items-center justify-center text-xs font-black shrink-0">{i + 1}</span>
                            <p className="text-sm font-bold text-slate-700 leading-snug">{point}</p>
                         </div>
                       ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-xl font-black text-blue-600 uppercase mb-6 flex items-center gap-2"><div className="w-2 h-8 bg-blue-500 rounded-full"></div> PHẦN 2: VÍ DỤ MINH HỌA</h3>
                    <div className="space-y-6">
                       {currentLesson.part2_examples.map((ex, i) => (
                         <div key={i} className="bg-blue-50 border-4 border-dashed border-blue-200 p-6 rounded-[2rem] space-y-3">
                            <p className="font-black text-lg text-blue-900">Ví dụ {i+1}: {ex.example}</p>
                            <div className="bg-white p-4 rounded-xl border-2 border-blue-100 text-sm font-bold text-slate-600"><span className="text-blue-500 uppercase text-[10px] block mb-1">Hướng dẫn giải:</span>{ex.solution}</div>
                         </div>
                       ))}
                    </div>
                  </section>
               </div>
               <div className="mt-12 flex justify-center"><button onClick={() => { setFlashcardIdx(0); setShowFlashcardAnswer(false); setStep('flashcards'); }} className="bg-black text-white px-12 py-5 rounded-[2rem] font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center gap-3">XEM THẺ GHI NHỚ (5 CARDS) <ArrowRight /></button></div>
            </div>
          </motion.div>
        )}

        {step === 'flashcards' && currentLesson && (
          <div className="flex flex-col items-center space-y-10 w-full max-w-2xl mx-auto pb-10">
             <div className="text-center"><h2 className="text-3xl font-black uppercase tracking-tighter mb-2">Tóm tắt kiến thức</h2><p className="text-slate-400 font-bold">Thẻ số {flashcardIdx + 1} / 5</p></div>
             <div className="w-full">
                <div className="bg-white border-4 border-black rounded-[3rem] shadow-comic flex flex-col p-10 text-center min-h-[400px] justify-center relative overflow-hidden transition-all duration-300">
                   <div className="absolute top-6 left-1/2 -translate-x-1/2"><div className="bg-pink-100 p-3 rounded-full"><Lightbulb size={32} className="text-pink-600" /></div></div>
                   <div className="space-y-8 mt-6">
                      <h3 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">{currentLesson.flashcards[flashcardIdx].front}</h3>
                      <AnimatePresence mode="wait">
                         {showFlashcardAnswer ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-50 border-4 border-dashed border-slate-200 p-8 rounded-[2rem]"><p className="text-2xl md:text-3xl font-bold text-teal-600 leading-relaxed italic">{currentLesson.flashcards[flashcardIdx].back}</p></motion.div> : <button onClick={() => setShowFlashcardAnswer(true)} className="w-full py-12 border-4 border-dotted border-pink-200 rounded-[2rem] flex flex-col items-center justify-center gap-3 text-pink-300 hover:text-pink-500 transition-all group"><Eye size={40} className="group-hover:scale-110" /><span className="text-xl font-black uppercase tracking-widest">Nhấn để hiện nội dung</span></button>}
                      </AnimatePresence>
                   </div>
                </div>
             </div>
             <div className="flex gap-6 w-full">
                <button onClick={() => { if(flashcardIdx > 0) { setFlashcardIdx(prev => prev -1); setShowFlashcardAnswer(false); } }} disabled={flashcardIdx === 0} className="flex-1 bg-white border-4 border-black p-5 rounded-2xl font-black shadow-comic-hover disabled:opacity-30">TRƯỚC</button>
                {flashcardIdx < 4 ? <button onClick={() => { setFlashcardIdx(prev => prev + 1); setShowFlashcardAnswer(false); }} className="flex-1 bg-white border-4 border-black p-5 rounded-2xl font-black shadow-comic-hover">TIẾP THEO</button> : <button onClick={() => { setQuizIdx(0); setQuizScore(0); setSelectedAnswer(null); setShowExplanation(false); setStep('quiz'); }} className="flex-1 bg-pink-500 text-white border-4 border-black p-5 rounded-2xl font-black shadow-comic">KIỂM TRA NHANH</button>}
             </div>
          </div>
        )}

        {step === 'quiz' && currentLesson && (
          <div className="flex flex-col items-center space-y-8 w-full max-w-3xl mx-auto pb-10">
             <header className="w-full flex justify-between items-center px-2">
                <div className="flex items-center gap-3"><div className="bg-white border-4 border-black w-14 h-14 rounded-2xl flex items-center justify-center shadow-comic-hover"><HelpCircle className="text-pink-500" /></div><h2 className="text-2xl font-black text-slate-900 uppercase">Câu hỏi {quizIdx + 1}/5</h2></div>
                <div className="bg-slate-100 px-6 py-2 rounded-full font-black text-slate-400 border-2 border-slate-200">Đúng: <span className="text-pink-500">{quizScore}</span></div>
             </header>
             <div className="w-full bg-white border-4 border-black rounded-[3rem] p-10 shadow-comic min-h-[180px] flex items-center justify-center text-center"><h3 className="text-2xl md:text-3xl font-black text-slate-800 leading-tight">{currentLesson.quiz[quizIdx].question}</h3></div>
             <div className="grid grid-cols-1 gap-4 w-full">
                {currentLesson.quiz[quizIdx].options.map((opt, i) => {
                  const isCorrect = opt === currentLesson.quiz[quizIdx].answer;
                  const isSelected = selectedAnswer === opt;
                  let btnStyle = "bg-white border-slate-200 text-slate-800 hover:border-black";
                  if (selectedAnswer) {
                    if (isCorrect) btnStyle = "bg-emerald-500 text-white border-black scale-95 shadow-none ring-4 ring-emerald-100";
                    else if (isSelected) btnStyle = "bg-red-500 text-white border-black scale-95 shadow-none";
                    else btnStyle = "opacity-40 grayscale pointer-events-none";
                  }
                  return <button key={i} onClick={() => handleQuizAnswer(opt)} className={`p-6 rounded-2xl border-4 font-black text-xl transition-all shadow-comic hover:shadow-none flex items-center justify-center text-center ${btnStyle}`}>{opt}</button>;
                })}
             </div>
             <AnimatePresence>{showExplanation && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-blue-50 border-4 border-dashed border-blue-200 p-6 rounded-[2rem] space-y-2"><p className="font-black text-blue-600 uppercase text-xs tracking-widest">Giải thích:</p><p className="font-bold text-blue-800">{currentLesson.quiz[quizIdx].explanation}</p><button onClick={nextQuiz} className="mt-4 w-full bg-blue-600 text-white py-4 rounded-xl font-black shadow-comic-hover transition-all">{quizIdx < 4 ? 'CÂU TIẾP THEO' : 'XEM KẾT QUẢ TỔNG HỢP'}</button></motion.div>}</AnimatePresence>
          </div>
        )}

        {step === 'personalization' && (
          <div className="flex flex-col items-center space-y-10 w-full max-w-4xl mx-auto pb-20">
             <div className="text-center space-y-2"><div className="inline-flex bg-pink-100 text-pink-600 px-6 py-1.5 rounded-full border-2 border-black font-black uppercase text-sm mb-4">PHẦN 4: ĐIỀU CHỈNH CÁ NHÂN HÓA</div><h2 className="text-5xl font-black text-slate-900 tracking-tighter">Báo cáo năng lực học tập</h2><p className="text-slate-400 font-bold text-xl">Dành cho {studentName}</p></div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="md:col-span-1 space-y-6">
                   <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-comic flex flex-col items-center gap-4 text-center"><div className={`w-24 h-24 rounded-full border-4 border-black flex items-center justify-center text-4xl font-black ${quizScore >= 4 ? 'bg-emerald-400' : quizScore >= 3 ? 'bg-yellow-400' : 'bg-red-400'}`}>{quizScore}/5</div><div><p className="font-black text-slate-900 uppercase">Độ chính xác</p><p className="text-slate-400 font-bold text-sm">Mục tiêu: 5/5</p></div></div>
                   <div className="bg-white border-4 border-black p-8 rounded-[2.5rem] shadow-comic flex flex-col items-center gap-2"><label className="text-xs font-black text-slate-400 uppercase">Tự tin của bạn</label><div className="flex gap-2 w-full">{['Thấp', 'Trung bình', 'Cao'].map(c => (<button key={c} onClick={() => setConfidence(c as any)} className={`flex-1 py-2 rounded-xl border-2 font-black text-xs transition-all ${confidence === c ? 'bg-black text-white border-black' : 'bg-slate-50 text-slate-300 border-slate-100 hover:border-black'}`}>{c}</button>))}</div></div>
                   <div className="bg-amber-100 border-4 border-black p-6 rounded-[2.5rem] shadow-comic flex items-center gap-4"><div className="bg-white p-3 rounded-xl border-2 border-black"><Timer size={24} className="text-amber-600" /></div><div><p className="text-[10px] font-black text-amber-800 uppercase">Thời gian học</p><p className="text-lg font-black text-slate-900">{Math.floor((Date.now() - startTime) / 60000)} phút</p></div></div>
                </div>
                <div className="md:col-span-2 bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic relative overflow-hidden flex flex-col"><div className="absolute top-0 right-0 bg-pink-500 text-white px-6 py-2 rounded-bl-3xl font-black text-sm border-l-4 border-b-4 border-black">BrainCandy Assessment</div><div className="flex-1 space-y-6"><div className="flex items-center gap-4 mb-4"><div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-500 border-2 border-pink-200"><Smile size={24} /></div><h3 className="text-2xl font-black text-slate-900 uppercase italic">Phân tích từ BrainCandy</h3></div><div className="prose prose-slate max-w-none"><p className="text-xl font-bold text-slate-700 leading-relaxed italic whitespace-pre-line">"{personalFeedback}"</p></div></div><div className="mt-10 pt-10 border-t-4 border-dashed border-slate-100 flex flex-col md:flex-row gap-4"><button onClick={() => { setStep('setup'); setCurrentLesson(null); }} className="flex-1 bg-black text-white py-5 rounded-2xl font-black shadow-comic uppercase">HỌC TIẾP CHỦ ĐỀ KHÁC</button><button onClick={onBack} className="flex-1 bg-white border-4 border-black text-slate-900 py-5 rounded-2xl font-black shadow-comic-hover flex items-center justify-center gap-2 uppercase"><Download size={18} /> LƯU PASSPORT</button></div></div>
             </div>
             <div className="text-center max-w-md"><p className="text-slate-400 font-bold text-sm italic">Lưu ý: Học tập là một hành trình dài. Nghỉ ngơi tại ChillZone hoặc chia sẻ cùng SOSMood nếu thấy mệt nhé!</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrainCandyScreen;
