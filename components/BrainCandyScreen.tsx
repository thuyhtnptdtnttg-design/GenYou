
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, ArrowRight, Zap, RefreshCw, Sparkles, Book, PenTool, 
  Languages, Zap as Physics, FlaskConical, Beaker, History, Globe, 
  Heart, CheckCircle2, Award, HelpCircle, Brain,
  Trophy, Lightbulb, Calculator, Search, ExternalLink,
  ChevronDown, GraduationCap, Timer, Smile, Download, Eye, EyeOff,
  BookMarked, UserCheck, GraduationCap as StudyIcon, MessageCircle, 
  ShieldCheck, Compass, Lightbulb as IdeaIcon, CheckCircle,
  AlertCircle, Star
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { recordInteraction } from '../services/storageService';

interface Props { studentName: string; studentId: string; onBack: () => void; }
interface QuizQuestion { question: string; options: string[]; answer: string; explanation: string; isSituational?: boolean; }
interface Flashcard { front: string; back: string; }
interface Lesson { subject: string; grade: string; level: string; title: string; part1_core: string[]; part2_examples: { example: string; solution: string }[]; flashcards: Flashcard[]; quiz: QuizQuestion[]; }

const ACADEMIC_SUBJECTS = [
  { id: 'math', name: 'Toán học', icon: <Calculator className="text-blue-500" />, color: 'bg-blue-50' },
  { id: 'literature', name: 'Ngữ văn', icon: <PenTool className="text-rose-500" />, color: 'bg-rose-50' },
  { id: 'english', name: 'Tiếng Anh', icon: <Languages className="text-sky-500" />, color: 'bg-sky-50' },
  { id: 'physics', name: 'Vật lý', icon: <Physics className="text-purple-500" />, color: 'bg-purple-50' },
  { id: 'chemistry', name: 'Hóa học', icon: <FlaskConical className="text-emerald-500" />, color: 'bg-emerald-50' },
  { id: 'biology', name: 'Sinh học', icon: <Beaker className="text-green-500" />, color: 'bg-green-50' },
  { id: 'history', name: 'Lịch sử', icon: <History className="text-amber-500" />, color: 'bg-amber-50' },
  { id: 'geography', name: 'Địa lý', icon: <Globe className="text-cyan-500" />, color: 'bg-cyan-50' },
];

const LIFE_SKILL_CATEGORIES = [
  { id: 'personal_skills', name: 'Kỹ năng cá nhân', icon: <UserCheck className="text-rose-500" />, color: 'bg-rose-50', subtitle: 'Học để hiểu mình – làm chủ bản thân – sống vững vàng' },
  { id: 'study_thinking', name: 'Học tập & Tư duy', icon: <StudyIcon className="text-blue-500" />, color: 'bg-blue-50', subtitle: 'Học để học tốt hơn – nghĩ đúng hơn – quyết định tốt hơn' },
  { id: 'social_comm', name: 'Giao tiếp & Xã hội', icon: <MessageCircle className="text-emerald-500" />, color: 'bg-emerald-50', subtitle: 'Học để nói đúng – nghe hiểu – sống hài hòa' },
  { id: 'values_ethics', name: 'Giá trị sống & Đạo đức', icon: <Heart className="text-pink-500" />, color: 'bg-pink-50', subtitle: 'Học để làm người – sống có trách nhiệm' },
  { id: 'safety_protection', name: 'An toàn & Bảo vệ bản thân', icon: <ShieldCheck className="text-amber-500" />, color: 'bg-amber-50', subtitle: 'Học để tự cứu mình – bảo vệ người khác – không hoảng loạn khi nguy cấp' },
  { id: 'future_orientation', name: 'Định hướng tương lai', icon: <Compass className="text-indigo-500" />, color: 'bg-indigo-50', subtitle: 'Học để chọn đúng – đi xa' },
];

const LIFE_SKILL_DETAILS: Record<string, { title: string; items: string[] }[]> = {
  personal_skills: [
    { title: "Nhận thức & làm chủ bản thân", items: ["Hiểu điểm mạnh – điểm yếu của mình", "Xây dựng sự tự tin đúng cách", "Vượt qua cảm giác tự ti", "Tự tạo động lực cho bản thân", "Ứng phó với áp lực và căng thẳng"] },
    { title: "Quản lý cảm xúc", items: ["Nhận diện cảm xúc của bản thân", "Kiểm soát cơn giận", "Đối diện với thất bại", "Cách vượt qua buồn chán, mất động lực", "Chăm sóc sức khỏe tinh thần hằng ngày"] },
    { title: "Kỷ luật & tự lập", items: ["Xây dựng thói quen tích cực", "Kỷ luật bản thân khi không ai nhắc", "Chịu trách nhiệm với hành vi của mình", "Biết nói “không” với cám dỗ", "Tự lập trong học tập và cuộc sống"] }
  ],
  study_thinking: [
    { title: "Kỹ năng học tập", items: ["Quản lý thời gian học tập", "Lập kế hoạch học hiệu quả", "Cách tập trung khi học", "Ghi nhớ và ôn tập thông minh", "Tự học mà không cần ép buộc"] },
    { title: "Tư duy hiệu quả", items: ["Tư duy tích cực", "Tư duy phản biện", "Tư duy giải quyết vấn đề", "Không sợ sai khi học", "Học từ sai lầm"] },
    { title: "Ra quyết định & lựa chọn", items: ["Ra quyết định khi phân vân", "Không chạy theo số đông", "Chịu trách nhiệm với lựa chọn", "Biết dừng lại khi cần", "Lựa chọn ưu tiên đúng"] }
  ],
  social_comm: [
    { title: "Kỹ năng giao tiếp", items: ["Cách nói để người khác lắng nghe", "Lắng nghe mà không phán xét", "Nói “không” một cách tôn trọng", "Giao tiếp khi không đồng ý", "Ứng xử khi bị hiểu lầm", "Giải quyết mâu thuẫn với bạn bè", "Làm việc nhóm hiệu quả", "Giao tiếp với thầy cô", "Giao tiếp với cha mẹ", "Ứng xử trên mạng xã hội"] }
  ],
  values_ethics: [
    { title: "Giá trị bản thân", items: ["Trung thực trong học tập và cuộc sống", "Chịu trách nhiệm với lựa chọn của mình", "Tôn trọng sự khác biệt", "Ứng xử khi mắc lỗi", "Biết xin lỗi và tha thứ", "Không chạy theo áp lực số đông", "Sống kỷ luật và tự lập", "Lòng biết ơn và sẻ chia", "Giữ lời hứa", "Ứng xử khi đứng trước cám dỗ"] }
  ],
  safety_protection: [
    { title: "I. NHẬN DIỆN NGUY CƠ & PHÒNG NGỪA", items: ["Nhận diện tình huống không an toàn", "Dấu hiệu nguy hiểm trong sinh hoạt hằng ngày", "Phòng tránh tai nạn tại trường – ở nhà – ngoài xã hội", "Nguyên tắc an toàn khi đi xa, đi một mình", "Biết khi nào cần tìm sự giúp đỡ"] },
    { title: "II. SƠ CỨU CƠ BẢN (BẮT BUỘC)", items: ["Nguyên tắc sơ cứu ban đầu", "Xử lý chảy máu, vết thương", "Sơ cứu khi bị ngất", "Sơ cứu khi bị bỏng", "Sơ cứu khi gãy xương, bong gân", "Sơ cứu khi bị hóc dị vật", "Sơ cứu khi bị điện giật", "Những điều KHÔNG được làm khi sơ cứu"] },
    { title: "III. THOÁT HIỂM & ỨNG PHÓ KHẨN CẤP", items: ["Khi bị lạc (Bình tĩnh, tìm vị trí, cầu cứu)", "Khi bị đuối nước (Cứu gián tiếp, sơ cứu)", "Khi xảy ra hỏa hoạn (Thoát hiểm, tránh khói)", "Khi thiên tai, tai nạn (Mưa lũ, động đất, tai nạn)"] },
    { title: "IV. AN TOÀN CÁ NHÂN & KHÔNG GIAN MẠNG", items: ["Bảo vệ thông tin cá nhân", "Nhận diện lừa đảo", "Phòng tránh bạo lực học đường", "Phòng tránh xâm hại", "Biết nói “không” và báo người lớn"] },
    { title: "V. KỸ NĂNG TÌM KIẾM HỖ TRỢ & BÁO ĐỘNG", items: ["Gọi cấp cứu đúng cách", "Cung cấp thông tin chính xác", "Liên hệ người lớn đáng tin cậy", "Hợp tác khi được hỗ trợ"] }
  ],
  future_orientation: [
    { title: "Hành trang tương lai", items: ["Khám phá điểm mạnh của bản thân", "Hiểu mình phù hợp với nhóm nghề nào", "Giá trị sống ảnh hưởng thế nào đến nghề nghiệp", "Áp lực chọn nghề từ gia đình", "Học đại học hay học nghề", "Quản lý thời gian cho mục tiêu dài hạn", "Kỹ năng cần có trong thế kỷ 21", "Quản lý tài chính cá nhân", "Chuẩn bị cho cuộc sống tự lập", "Thất bại đầu đời và cách đứng dậy"] }
  ]
};

const SUGGESTED_ACADEMIC_TOPICS: Record<string, Record<string, string[]>> = {
  math: {
    '10': ['Hàm số bậc hai', 'Vectơ', 'Hệ thức lượng trong tam giác', 'Phương trình bậc nhất và bậc hai'],
    '11': ['Hàm số lượng giác', 'Dãy số, Cấp số cộng, Cấp số nhân', 'Đạo hàm', 'Quan hệ vuông góc trong không gian'],
    '12': ['Nguyên hàm và Tích phân', 'Số phức', 'Hệ tọa độ Oxyz', 'Khối đa diện và Thể tích']
  }
};

const BrainCandyScreen: React.FC<Props> = ({ studentName, studentId, onBack }) => {
  const [mainCategory, setMainCategory] = useState<'selection' | 'life_skills' | 'academic'>('selection');
  const [step, setStep] = useState<'setup' | 'study_core' | 'flashcards' | 'quiz' | 'personalization'>('setup');
  const [selectedSubject, setSelectedSubject] = useState('');
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
  const [showCertifiedStamp, setShowCertifiedStamp] = useState(false);

  const generateLessonAI = async (customTopic?: string) => {
    setLoading(true);
    const topicToUse = customTopic || searchQuery || 'Kiến thức trọng tâm';
    const subjects = mainCategory === 'life_skills' ? LIFE_SKILL_CATEGORIES : ACADEMIC_SUBJECTS;
    const subjectData = subjects.find(s => s.id === selectedSubject);
    const subjectName = subjectData?.name;
    const categoryName = mainCategory === 'life_skills' ? "Kỹ năng sống" : "Kiến thức môn học";

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const prompt = `Bạn là BrainCandy – Hệ thống học tập thông minh cho học sinh Việt Nam. 
      Hãy tạo bài học cô đọng cho ${categoryName}, Nhóm: ${subjectName}, Chủ đề: ${topicToUse}.
      Yêu cầu CHUYÊN SÂU:
      - Tạo đúng 3 câu hỏi trắc nghiệm (quiz).
      - Trong đó ít nhất 1 câu là tình huống thực tế (scenario-based) để học sinh vận dụng kiến thức.
      - QUAN TRỌNG: Các câu trả lời trong mảng "options" và giá trị "answer" phải là văn bản thuần túy, tuyệt đối không kết thúc bằng dấu chấm (.) hoặc bất kỳ dấu câu nào ở cuối.
      - GIÁ TRỊ "answer" PHẢI LÀ NỘI DUNG CHỮ CỦA ĐÁP ÁN ĐÚNG, KHÔNG PHẢI LÀ A, B, C, D.
      Trả về định dạng JSON:
      {
        "title": "Tên bài học",
        "part1_core": ["Ý chính 1", "Ý chính 2", "Ý chính 3", "Ý chính 4"],
        "part2_examples": [{"example": "Tình huống ví dụ", "solution": "Hướng dẫn ứng dụng"}],
        "flashcards": [{"front": "Khái niệm", "back": "Giải thích ngắn"}],
        "quiz": [
           {"question": "Câu hỏi lý thuyết", "options": ["Lựa chọn 1", "Lựa chọn 2", "Lựa chọn 3", "Lựa chọn 4"], "answer": "Lựa chọn đúng", "explanation": "Giải thích", "isSituational": false},
           {"question": "Câu hỏi tình huống", "options": ["Cách giải quyết 1", "Cách giải quyết 2", "Cách giải quyết 3", "Cách giải quyết 4"], "answer": "Cách giải quyết đúng", "explanation": "Giải thích vì sao đúng", "isSituational": true},
           {"question": "Câu hỏi kiểm tra sâu", "options": ["Đáp án 1", "Đáp án 2", "Đáp án 3", "Đáp án 4"], "answer": "Đáp án đúng", "explanation": "Giải thích", "isSituational": false}
        ]
      }`;
      
      const response = await ai.models.generateContent({ 
        model: 'gemini-3-flash-preview', 
        contents: prompt, 
        config: { responseMimeType: "application/json" } 
      });
      const data = JSON.parse(response.text);
      setCurrentLesson({ ...data, subject: subjectName, grade, level });
      setStep('study_core');
      setStartTime(Date.now());
      setQuizScore(0); 
      setShowCertifiedStamp(false);
    } catch (e) { 
      console.error(e);
      alert("Lỗi kết nối AI. Vui lòng thử lại!"); 
    } finally { 
      setLoading(false); 
    }
  };

  // Hàm chuẩn hóa chuỗi cực kỳ mạnh mẽ để so sánh chính xác nhất
  const normalizeString = (str: string) => {
    if (!str) return "";
    return str.trim()
              .toLowerCase()
              .replace(/[.,!?;:]+$/, "") // Loại bỏ mọi dấu câu ở cuối chuỗi
              .replace(/\s+/g, " ");     // Thu gọn mọi khoảng trắng thừa thành 1 dấu cách duy nhất
  };

  const handleQuizAnswer = (opt: string) => {
    if (selectedAnswer || !currentLesson) return;
    
    setSelectedAnswer(opt);
    const correctAns = currentLesson.quiz[quizIdx].answer;
    
    // So sánh chuẩn hóa 2 phía
    const isCorrect = normalizeString(opt) === normalizeString(correctAns);
    
    if (isCorrect) {
      setQuizScore(prev => prev + 1);
    }
    setShowExplanation(true);
  };

  const nextQuiz = async () => {
    if (quizIdx < (currentLesson?.quiz.length || 0) - 1) {
      setQuizIdx(prev => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setLoading(true);
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      try {
        const durationMin = Math.floor((Date.now() - startTime) / 60000);
        const finalScore = quizScore;
        const totalQuestions = currentLesson?.quiz.length || 3;
        
        const prompt = `Bạn là BrainCandy AI. Hãy đưa ra nhận xét cá nhân hóa cho học sinh ${studentName}.
        Bài học: ${currentLesson?.title}
        Kết quả trắc nghiệm: ${finalScore}/${totalQuestions}
        Thời gian học: ${durationMin} phút
        Mức độ tự tin: ${confidence}
        
        Viết 2-3 câu khích lệ, nhận xét về sự tiến bộ và đưa ra lời khuyên học tập tiếp theo. Sử dụng emoji.`;
        
        const response = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: prompt
        });
        setPersonalFeedback(response.text || "Bạn đã hoàn thành rất tốt bài học hôm nay!");
        
        recordInteraction({
          timestamp: Date.now(),
          module: 'BrainCandy',
          activityType: 'Học tập',
          duration: Math.floor((Date.now() - startTime) / 1000),
          status: 'Hoàn thành',
          state: finalScore === totalQuestions ? 'Tích cực' : 'Bình thường'
        });
        
        setStep('personalization');
        if (finalScore === totalQuestions) {
          setTimeout(() => setShowCertifiedStamp(true), 800);
        }
      } catch (e) {
        setPersonalFeedback("Tuyệt vời! Bạn đã hoàn thành bài học và bài kiểm tra. Hãy tiếp tục phát huy nhé!");
        setStep('personalization');
      } finally {
        setLoading(false);
      }
    }
  };

  const currentAcademicTopics = mainCategory === 'academic' ? (SUGGESTED_ACADEMIC_TOPICS[selectedSubject]?.[grade] || []) : [];
  const selectedLifeSkillCategory = mainCategory === 'life_skills' ? LIFE_SKILL_CATEGORIES.find(c => c.id === selectedSubject) : null;
  const lifeSkillGroups = mainCategory === 'life_skills' && selectedSubject ? LIFE_SKILL_DETAILS[selectedSubject] : [];

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-hand p-4 md:p-8 flex flex-col items-center overflow-x-hidden relative">
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '40px 40px' }}></div>
      <div className="w-full max-w-5xl z-10 space-y-6">
        <header className="flex flex-col md:flex-row justify-between items-center bg-white border-4 border-black p-6 rounded-3xl shadow-comic gap-4">
          <div className="flex items-center gap-4">
             <motion.div 
                animate={{ rotate: [-3, 3, -3], scale: [1, 1.1, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="p-3 bg-pink-500 rounded-2xl border-2 border-black shadow-comic-hover"
             >
                <Zap size={32} className="text-white" fill="white" />
             </motion.div>
             <motion.div
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
             >
                <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-none tracking-tighter">BrainCandy</h1>
                <p className="text-slate-500 font-bold text-sm md:text-lg italic uppercase tracking-widest">Kiến thức nền tảng • Kỹ năng tương lai</p>
             </motion.div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-2xl hover:translate-y-1 transition-all shadow-comic-hover active:scale-95"><ArrowLeft size={24} /></button>
        </header>

        {step === 'setup' && mainCategory === 'selection' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10">
              <SelectionModeCard 
                title="Kỹ năng sống" 
                desc="Cá nhân, tư duy, đạo đức & bảo vệ bản thân"
                icon={<IdeaIcon size={48}/>}
                color="bg-rose-100"
                onClick={() => setMainCategory('life_skills')}
                index={0}
              />
              <SelectionModeCard 
                title="Kiến thức môn học" 
                desc="Hệ thống kiến thức trọng tâm các môn THPT"
                icon={<StudyIcon size={48}/>}
                color="bg-blue-100"
                onClick={() => setMainCategory('academic')}
                index={1}
              />
          </motion.div>
        )}

        {step === 'setup' && mainCategory === 'academic' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center gap-4">
               <button onClick={() => { setMainCategory('selection'); setSelectedSubject(''); }} className="p-2 bg-white border-2 border-black rounded-lg shadow-sm hover:bg-slate-50 transition-all"><ArrowLeft size={18}/></button>
               <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Học tập: Kiến thức môn học</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <div className="bg-white border-4 border-black rounded-[2.5rem] p-6 shadow-comic flex flex-col gap-3">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><GraduationCap size={14} /> Khối Lớp</label>
                  <div className="flex bg-slate-100 p-1.5 rounded-2xl border-2 border-slate-200">
                     {['10', '11', '12'].map(g => (
                       <button key={g} onClick={() => setGrade(g)} className={`flex-1 py-2 rounded-xl font-black text-lg transition-all ${grade === g ? 'bg-black text-white shadow-md' : 'text-slate-400'}`}>{g}</button>
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
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Search size={14} /> Tìm chủ đề</label>
                  <input type="text" placeholder="VD: Sóng dừng, Tích phân..." className="w-full bg-transparent border-b-2 border-slate-200 px-4 py-2 rounded-xl font-bold text-xl outline-none focus:border-black transition-all" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
               </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
               {ACADEMIC_SUBJECTS.map((sub, idx) => (
                 <button key={sub.id} onClick={() => setSelectedSubject(sub.id)} className={`${sub.color} border-4 ${selectedSubject === sub.id ? 'border-pink-500 ring-4 ring-pink-100' : 'border-black'} rounded-[2.5rem] p-6 md:p-8 flex flex-col items-center gap-4 transition-all shadow-comic hover:shadow-none group`}>
                    <motion.div 
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.1 }}
                      className="bg-white p-4 rounded-2xl border-2 border-black shadow-sm group-hover:rotate-6 transition-transform"
                    >
                      {sub.icon}
                    </motion.div>
                    <span className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tighter text-center">{sub.name}</span>
                 </button>
               ))}
            </div>

            {currentAcademicTopics.length > 0 && selectedSubject && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-comic">
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-6 flex items-center gap-2">
                  <BookMarked size={16} className="text-pink-500" /> Chủ đề gợi ý môn {ACADEMIC_SUBJECTS.find(s=>s.id===selectedSubject)?.name}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {currentAcademicTopics.map((t, idx) => (
                    <button key={idx} onClick={() => generateLessonAI(t)} className="px-6 py-2.5 bg-slate-50 border-2 border-slate-200 rounded-2xl font-bold text-slate-600 hover:border-black hover:text-black hover:bg-white transition-all text-lg">{t}</button>
                  ))}
                </div>
              </motion.div>
            )}

            <button onClick={() => generateLessonAI()} disabled={loading || !selectedSubject} className="w-full bg-black text-white py-6 rounded-[2.5rem] font-black text-3xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-30">
              {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />} {loading ? 'ĐANG CHUẨN BỊ...' : 'BẮT ĐẦU HỌC'}
            </button>
          </motion.div>
        )}

        {step === 'setup' && mainCategory === 'life_skills' && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
            <div className="flex items-center gap-4">
               <button onClick={() => { setMainCategory('selection'); setSelectedSubject(''); }} className="p-2 bg-white border-2 border-black rounded-lg shadow-sm hover:bg-slate-50 transition-all"><ArrowLeft size={18}/></button>
               <h3 className="text-3xl font-black text-slate-800 uppercase italic tracking-tighter">Học tập: Kỹ năng sống</h3>
            </div>

            {!selectedSubject ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {LIFE_SKILL_CATEGORIES.map((cat, idx) => (
                  <button key={cat.id} onClick={() => setSelectedSubject(cat.id)} className={`${cat.color} border-4 border-black p-6 rounded-[2.5rem] shadow-comic hover:shadow-none transition-all flex flex-col items-center gap-4 group text-center`}>
                    <motion.div 
                      animate={{ y: [0, -4, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.2 }}
                      className="bg-white p-5 rounded-3xl border-2 border-black shadow-sm group-hover:rotate-6 transition-transform"
                    >
                      {cat.icon}
                    </motion.div>
                    <div>
                      <h4 className="text-2xl font-black text-slate-900 uppercase leading-none tracking-tight mb-1">{cat.name}</h4>
                      <p className="text-sm font-bold text-slate-400 italic leading-snug">{cat.subtitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="space-y-8">
                 <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-comic relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-3 bg-pink-500"></div>
                    <div className="flex items-center gap-4 mb-2">
                       <motion.div 
                        animate={{ rotate: [-5, 5, -5] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="bg-pink-50 p-2 rounded-xl text-pink-500"
                       >
                         {selectedLifeSkillCategory?.icon}
                       </motion.div>
                       <h3 className="text-4xl font-black text-slate-900 uppercase italic tracking-tighter leading-none">{selectedLifeSkillCategory?.name}</h3>
                    </div>
                    <p className="text-xl font-bold text-slate-400 italic mb-10">{selectedLifeSkillCategory?.subtitle}</p>
                    
                    <div className="space-y-12">
                       {lifeSkillGroups.map((group, idx) => (
                         <div key={idx} className="space-y-6">
                            <h4 className="text-2xl font-black text-pink-600 uppercase flex items-center gap-2">
                               <div className="w-1.5 h-6 bg-pink-500 rounded-full"></div> {group.title}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                               {group.items.map((item, i) => (
                                 <button 
                                   key={i} 
                                   onClick={() => generateLessonAI(item)}
                                   className="group flex items-center justify-between bg-slate-50 border-4 border-black p-6 rounded-2xl hover:bg-black hover:text-white transition-all text-left shadow-sm hover:shadow-comic active:scale-95"
                                 >
                                    <span className="text-2xl font-black tracking-tight leading-tight">{item}</span>
                                    <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                                 </button>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 pt-10 border-t-4 border-dashed border-slate-100 flex flex-col md:flex-row gap-4">
                       <div className="flex-1 flex flex-col gap-2">
                          <label className="text-[10px] font-black text-slate-300 uppercase tracking-widest ml-4">Gợi ý khác cho bạn?</label>
                          <div className="flex gap-4">
                             <input type="text" placeholder="Gõ yêu cầu cụ thể tại đây..." className="flex-1 bg-transparent border-b-2 border-slate-200 px-6 py-4 rounded-2xl font-bold text-2xl outline-none focus:border-black transition-all" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                             <button onClick={() => generateLessonAI()} className="bg-black text-white px-8 py-4 rounded-2xl font-black shadow-comic active:scale-95 transition-all"><Sparkles /></button>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}
          </motion.div>
        )}

        {step === 'study_core' && currentLesson && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8 max-w-4xl mx-auto w-full pb-10">
            <div className="bg-white border-4 border-black rounded-[3rem] p-8 md:p-12 shadow-comic relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-4 bg-gradient-to-r from-rose-400 via-pink-400 to-amber-400"></div>
               <div className="mb-8 border-b-4 border-black pb-6 flex justify-between items-end">
                  <div className="max-w-[80%]">
                    <h2 className="text-5xl font-black text-slate-900 uppercase tracking-tighter leading-tight">{currentLesson.title}</h2>
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-sm mt-2">{currentLesson.subject}</p>
                  </div>
                  <motion.div 
                    animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="hidden md:block"
                  >
                    <Brain size={56} className="text-slate-200" />
                  </motion.div>
               </div>
               <div className="space-y-12">
                  <section>
                    <h3 className="text-3xl font-black text-pink-600 uppercase mb-6 flex items-center gap-3"><div className="w-2.5 h-10 bg-pink-500 rounded-full"></div> KIẾN THỨC CỐT LÕI</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {currentLesson.part1_core.map((point, i) => (
                         <div key={i} className="flex gap-4 items-start bg-slate-50 p-6 rounded-3xl border-2 border-slate-100 shadow-sm">
                            <span className="bg-black text-white w-8 h-8 rounded-full border-2 border-black flex items-center justify-center text-sm font-black shrink-0">{i + 1}</span>
                            <p className="text-2xl font-bold text-slate-700 leading-snug">{point}</p>
                         </div>
                       ))}
                    </div>
                  </section>
                  <section>
                    <h3 className="text-3xl font-black text-amber-600 uppercase mb-6 flex items-center gap-3"><div className="w-2.5 h-10 bg-amber-500 rounded-full"></div> MINH HỌA & ỨNG DỤNG</h3>
                    <div className="space-y-6">
                       {currentLesson.part2_examples.map((ex, i) => (
                         <div key={i} className="bg-amber-50 border-4 border-dashed border-amber-200 p-8 rounded-[2.5rem] space-y-4">
                            <p className="font-black text-3xl text-amber-900 italic font-sans">"{ex.example}"</p>
                            <div className="bg-white p-6 rounded-2xl border-2 border-amber-100 text-xl font-bold text-slate-600"><span className="text-amber-500 uppercase text-[10px] font-black block mb-2 tracking-widest">Lời khuyên ứng dụng:</span>{ex.solution}</div>
                         </div>
                       ))}
                    </div>
                  </section>
               </div>
               <div className="mt-16 flex justify-center"><button onClick={() => { setFlashcardIdx(0); setShowFlashcardAnswer(false); setStep('flashcards'); }} className="bg-black text-white px-12 py-6 rounded-[2.5rem] font-black text-3xl shadow-comic hover:shadow-none transition-all flex items-center gap-4 active:scale-95">XEM THẺ GHI NHỚ <ArrowRight size={32} /></button></div>
            </div>
          </motion.div>
        )}

        {step === 'flashcards' && currentLesson && (
          <div className="flex flex-col items-center space-y-10 w-full max-w-2xl mx-auto pb-10">
             <div className="text-center"><h2 className="text-4xl font-black uppercase tracking-tighter mb-2">Thẻ ghi nhớ trọng tâm</h2><p className="text-slate-400 font-black tracking-widest uppercase text-xs">Thẻ {flashcardIdx + 1} / {currentLesson.flashcards.length}</p></div>
             <div className="w-full">
                <div className="bg-white border-4 border-black rounded-[3.5rem] shadow-comic flex flex-col p-12 text-center min-h-[450px] justify-center relative overflow-hidden transition-all duration-300">
                   <motion.div 
                     animate={{ y: [0, -5, 0] }}
                     transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                     className="absolute top-8 left-1/2 -translate-x-1/2"
                   >
                     <div className="bg-pink-100 p-4 rounded-full border-2 border-black"><IdeaIcon size={40} className="text-pink-600" /></div>
                   </motion.div>
                   <div className="space-y-10 mt-10">
                      <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight uppercase italic">"{currentLesson.flashcards[flashcardIdx].front}"</h3>
                      <AnimatePresence mode="wait">
                         {showFlashcardAnswer ? <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="bg-slate-50 border-4 border-dashed border-slate-200 p-10 rounded-[2.5rem] shadow-inner"><p className="text-3xl md:text-4xl font-bold text-teal-600 leading-relaxed italic whitespace-pre-line">{currentLesson.flashcards[flashcardIdx].back}</p></motion.div> : <button onClick={() => setShowFlashcardAnswer(true)} className="w-full py-16 border-4 border-dotted border-pink-200 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-pink-300 hover:text-pink-500 transition-all group active:scale-95"><Eye size={56} className="group-hover:scale-110 transition-transform" /><span className="text-2xl font-black uppercase tracking-widest">Click để lật thẻ</span></button>}
                      </AnimatePresence>
                   </div>
                </div>
             </div>
             <div className="flex gap-6 w-full">
                <button onClick={() => { if(flashcardIdx > 0) { setFlashcardIdx(prev => prev -1); setShowFlashcardAnswer(false); } }} disabled={flashcardIdx === 0} className="flex-1 bg-white border-4 border-black p-6 rounded-3xl font-black text-xl shadow-comic-hover disabled:opacity-30 transition-all">LÙI LẠI</button>
                {flashcardIdx < currentLesson.flashcards.length - 1 ? <button onClick={() => { setFlashcardIdx(prev => prev + 1); setShowFlashcardAnswer(false); }} className="flex-1 bg-white border-4 border-black p-6 rounded-3xl font-black text-xl shadow-comic-hover transition-all">TIẾP THEO</button> : <button onClick={() => { setQuizIdx(0); setQuizScore(0); setSelectedAnswer(null); setShowExplanation(false); setStep('quiz'); }} className="flex-1 bg-pink-500 text-white border-4 border-black p-6 rounded-3xl font-black text-xl shadow-comic active:scale-95 transition-all">KIỂM TRA NHANH</button>}
             </div>
          </div>
        )}

        {step === 'quiz' && currentLesson && (
          <div className="flex flex-col items-center space-y-10 w-full max-w-3xl mx-auto pb-10">
             <header className="w-full flex justify-between items-center px-4">
                <div className="flex items-center gap-4"><motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="bg-white border-4 border-black w-16 h-16 rounded-2xl flex items-center justify-center shadow-comic-hover"><HelpCircle className="text-pink-500" size={32} /></motion.div><h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Câu hỏi {quizIdx + 1}/{currentLesson.quiz.length}</h2></div>
                <div className="bg-slate-100 px-8 py-3 rounded-full font-black text-slate-400 border-2 border-slate-200">Đúng: <span className="text-pink-500">{quizScore}</span></div>
             </header>
             
             <div className="w-full bg-white border-4 border-black rounded-[3.5rem] p-12 shadow-comic min-h-[220px] flex flex-col items-center justify-center text-center relative overflow-hidden">
                {currentLesson.quiz[quizIdx].isSituational && (
                  <div className="absolute top-4 left-6 flex items-center gap-2 bg-amber-100 px-3 py-1 rounded-full border-2 border-amber-400">
                    <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}><Star size={14} className="text-amber-600" /></motion.div>
                    <span className="text-[10px] font-black text-amber-700 uppercase tracking-widest">Tình huống ứng dụng</span>
                  </div>
                )}
                <h3 className="text-4xl md:text-5xl font-black text-slate-800 leading-tight font-sans italic">"{currentLesson.quiz[quizIdx].question}"</h3>
             </div>

             <div className="grid grid-cols-1 gap-5 w-full px-2">
                {currentLesson.quiz[quizIdx].options.map((opt, i) => {
                  const correctAns = currentLesson!.quiz[quizIdx].answer;
                  const isCorrect = normalizeString(opt) === normalizeString(correctAns);
                  const isSelected = selectedAnswer === opt;
                  
                  let btnStyle = "bg-white border-slate-200 text-slate-800 hover:border-black";
                  if (selectedAnswer) {
                    if (isCorrect) btnStyle = "bg-emerald-500 text-white border-black scale-95 shadow-none ring-4 ring-emerald-100";
                    else if (isSelected) btnStyle = "bg-red-500 text-white border-black scale-95 shadow-none";
                    else btnStyle = "opacity-40 grayscale pointer-events-none";
                  }
                  return <button key={i} onClick={() => handleQuizAnswer(opt)} className={`p-8 rounded-3xl border-4 font-black text-3xl transition-all shadow-comic hover:shadow-none flex items-center justify-center text-center ${btnStyle}`}>{opt}</button>;
                })}
             </div>
             <AnimatePresence>{showExplanation && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="w-full bg-blue-50 border-4 border-dashed border-blue-200 p-8 rounded-[3rem] space-y-4 shadow-inner"><p className="font-black text-blue-600 uppercase text-xs tracking-widest">💡 Phân tích từ BrainCandy:</p><p className="font-bold text-3xl text-blue-800 italic leading-relaxed whitespace-pre-line">{currentLesson.quiz[quizIdx].explanation}</p><button onClick={nextQuiz} className="mt-6 w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-3xl shadow-comic-hover transition-all active:scale-95 uppercase">{quizIdx < currentLesson!.quiz.length - 1 ? 'Câu kế tiếp' : 'Xem báo cáo'}</button></motion.div>}</AnimatePresence>
          </div>
        )}

        {step === 'personalization' && (
          <div className="flex flex-col items-center space-y-10 w-full max-w-4xl mx-auto pb-20">
             <div className="text-center space-y-4">
                <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">Kết quả nỗ lực</h2>
                <p className="text-slate-400 font-bold text-2xl tracking-[0.1em] uppercase">{studentName}</p>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
                <div className="md:col-span-1 space-y-6">
                   <div className="bg-white border-4 border-black p-10 rounded-[3rem] shadow-comic flex flex-col items-center gap-6 text-center relative overflow-hidden">
                      <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className={`w-28 h-28 rounded-full border-4 border-black flex items-center justify-center text-5xl font-black ${quizScore >= (currentLesson?.quiz.length || 3) ? 'bg-emerald-400' : 'bg-yellow-400'}`}>{quizScore}/{currentLesson?.quiz.length || 3}</motion.div>
                      <div><p className="font-black text-slate-900 uppercase text-lg">Độ thấu hiểu</p></div>
                   </div>
                   <div className="bg-white border-4 border-black p-8 rounded-[3rem] shadow-comic flex flex-col items-center gap-4"><label className="text-xs font-black text-slate-400 uppercase tracking-widest">Cảm nhận của bạn?</label><div className="flex gap-2 w-full">{['Thấp', 'Trung bình', 'Cao'].map(c => (<button key={c} onClick={() => setConfidence(c as any)} className={`flex-1 py-3 rounded-2xl border-2 font-black text-sm transition-all ${confidence === c ? 'bg-black text-white border-black shadow-md' : 'bg-slate-50 text-slate-300 border-slate-100 hover:border-black'}`}>{c}</button>))}</div></div>
                   <div className="bg-amber-100 border-4 border-black p-8 rounded-[3rem] shadow-comic flex items-center gap-6"><motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 3, repeat: Infinity }} className="bg-white p-4 rounded-2xl border-2 border-black shadow-sm"><Timer size={32} className="text-amber-600" /></motion.div><div><p className="text-[10px] font-black text-amber-800 uppercase tracking-widest">Thời lượng học</p><p className="text-2xl font-black text-slate-900 leading-none mt-1">{Math.floor((Date.now() - startTime) / 60000)} phút</p></div></div>
                </div>
                
                <div className="md:col-span-2 bg-white border-4 border-black rounded-[4rem] p-10 md:p-14 shadow-comic relative overflow-hidden flex flex-col">
                   {/* Certified Stamp */}
                   <AnimatePresence>
                     {showCertifiedStamp && (
                       <motion.div 
                        initial={{ scale: 3, opacity: 0, rotate: 20 }}
                        animate={{ scale: 1, opacity: 0.9, rotate: -15 }}
                        className="absolute top-10 right-10 z-20 pointer-events-none"
                       >
                          <div className="border-[8px] border-red-600 rounded-full w-40 h-40 flex flex-col items-center justify-center p-2 text-red-600 mix-blend-multiply drop-shadow-lg">
                             <div className="border-4 border-dashed border-red-600 rounded-full w-full h-full flex flex-col items-center justify-center">
                                <span className="text-[10px] font-black uppercase tracking-widest mb-1">Passport</span>
                                <h1 className="text-3xl font-black leading-none uppercase text-center">PASSED</h1>
                                <span className="text-[8px] font-bold uppercase mt-1">BrainCandy AI</span>
                             </div>
                          </div>
                       </motion.div>
                     )}
                   </AnimatePresence>

                   <div className="absolute top-0 right-0 bg-pink-500 text-white px-8 py-3 rounded-bl-[3rem] font-black text-sm border-l-4 border-b-4 border-black uppercase tracking-widest italic">Phân tích nỗ lực</div>
                   <div className="flex-1 space-y-8">
                      <div className="flex items-center gap-5 mb-4">
                         <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-16 h-16 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-500 border-2 border-black shadow-sm"><Smile size={32} /></motion.div>
                         <h3 className="text-3xl font-black text-slate-900 uppercase italic leading-none">Từ BrainCandy AI</h3>
                      </div>
                      <div className="prose prose-slate max-w-none">
                         <p className="text-3xl font-bold text-slate-700 leading-relaxed italic whitespace-pre-line">"{personalFeedback}"</p>
                      </div>
                   </div>
                   <div className="mt-12 pt-10 border-t-4 border-dashed border-slate-100 flex flex-col md:flex-row gap-6">
                      <button onClick={() => { setStep('setup'); setCurrentLesson(null); setMainCategory('selection'); setSelectedSubject(''); }} className="flex-1 bg-black text-white py-6 rounded-3xl font-black text-3xl shadow-comic uppercase tracking-wider transition-all active:scale-95">HỌC CHỦ ĐỀ KHÁC</button>
                   </div>
                </div>
             </div>
             <div className="text-center max-w-lg"><p className="text-slate-400 font-bold text-sm italic tracking-wide leading-relaxed">Hãy biến mỗi bài học thành một "viên kẹo" ngọt ngào cho tương lai của bạn. Tuyệt vời vì bạn đã không ngừng cố gắng!</p></div>
          </div>
        )}
      </div>
    </div>
  );
};

const SelectionModeCard = ({ title, desc, icon, color, onClick, index }: any) => (
  <motion.button 
    whileHover={{ scale: 1.05, rotate: 1 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`${color} border-4 border-black p-12 rounded-[4rem] shadow-comic flex flex-col items-center gap-8 group`}
  >
     <motion.div 
        animate={{ y: [0, -5, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: index * 0.3 }}
        className="bg-white p-8 rounded-full border-4 border-black shadow-comic-hover group-hover:rotate-12 transition-transform"
     >
        {icon}
     </motion.div>
     <div className="text-center">
        <h3 className="text-4xl font-black text-slate-900 uppercase tracking-tighter italic mb-3 leading-none">{title}</h3>
        <p className="text-2xl font-bold text-slate-500 italic font-sans max-w-xs">{desc}</p>
     </div>
     <div className="mt-4 bg-black text-white px-10 py-4 rounded-full font-black text-2xl uppercase tracking-widest flex items-center gap-3 shadow-md">
        Khám phá ngay <ArrowRight size={20}/>
     </div>
  </motion.button>
);

export default BrainCandyScreen;
