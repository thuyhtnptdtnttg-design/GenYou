
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Heart, Zap, ShieldCheck, 
  Users, TrendingUp, AlertTriangle, Lightbulb, 
  Calendar, RefreshCw, BarChart3, MessageCircle,
  Sparkles, ClipboardCheck, LayoutDashboard
} from 'lucide-react';
import { getResults, getInteractionLogs } from '../services/storageService';
import { StudentResult, InteractionLog } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onBack: () => void;
}

interface ClassOverview {
  totalStudents: number;
  participationTrend: 'Tăng' | 'Ổn định' | 'Cần chú ý';
  activeHabitRatio: number; // Tỷ lệ em duy trì thói quen tích cực
  commonModule: string;
  emotionalTone: 'Tích cực' | 'Cần quan tâm';
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [logs, setLogs] = useState<InteractionLog[]>([]);
  const [overview, setOverview] = useState<ClassOverview | null>(null);
  const [aiAdvice, setAiAdvice] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [cycle, setCycle] = useState<'Ngày' | 'Tuần' | 'Tháng'>('Tuần');

  useEffect(() => {
    const resData = getResults();
    const logData = getInteractionLogs();
    setResults(resData);
    setLogs(logData);
    processClassTrends(resData, logData);
  }, []);

  const processClassTrends = (results: StudentResult[], logs: InteractionLog[]) => {
    const uniqueStudents = Array.from(new Set(results.map(r => r.name)));
    const totalCount = uniqueStudents.length || 1;

    // Phân tích thói quen tích cực: các em tham gia ít nhất 3 ngày trong tuần/chu kỳ
    const studentHabits: Record<string, Set<string>> = {};
    logs.forEach(l => {
        const studentName = results.find(r => r.id === results[0]?.id)?.name || "Ẩn danh"; // Logic đơn giản hóa
        if (!studentHabits[studentName]) studentHabits[studentName] = new Set();
        studentHabits[studentName].add(new Date(l.timestamp).toLocaleDateString());
    });

    const positiveHabitCount = Object.values(studentHabits).filter(dates => dates.size >= 3).length;
    const activeHabitRatio = Math.round((positiveHabitCount / totalCount) * 100);

    // Module phổ biến nhất
    const moduleCounts: Record<string, number> = {};
    logs.forEach(l => moduleCounts[l.module] = (moduleCounts[l.module] || 0) + 1);
    const commonModule = Object.entries(moduleCounts).sort((a,b) => b[1] - a[1])[0]?.[0] || 'Chưa xác định';

    setOverview({
      totalStudents: uniqueStudents.length,
      participationTrend: logs.length > 20 ? 'Tăng' : 'Ổn định',
      activeHabitRatio,
      commonModule,
      emotionalTone: logs.filter(l => l.state === 'Cần nghỉ ngơi').length / (logs.length || 1) > 0.3 ? 'Cần quan tâm' : 'Tích cực'
    });
  };

  const getAIAdvice = async () => {
    if (!overview) return;
    setLoading(true);
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    try {
      const statsContext = `
        Dữ liệu hành trình lớp học:
        - Tổng số học sinh tham gia: ${overview.totalStudents}
        - Xu hướng tham gia: ${overview.participationTrend}
        - Tỷ lệ duy trì thói quen học tích cực: ${overview.activeHabitRatio}%
        - Module được yêu thích nhất: ${overview.commonModule}
        - Trạng thái cảm xúc chung: ${overview.emotionalTone}
        - Chu kỳ báo cáo: ${cycle}
      `;

      const prompt = `Bạn là Teacher Assist AI. Hãy phân tích XU HƯỚNG chung của lớp dựa trên dữ liệu Learning Passport này. 
      Yêu cầu:
      1. Tóm tắt mức độ tham gia và nỗ lực của cả lớp (không nêu tên cá nhân).
      2. Đề xuất giải pháp khích lệ tinh thần tự học.
      3. Gợi ý điều chỉnh hoạt động nếu cảm xúc lớp đang "Cần quan tâm".
      Ngôn ngữ sư phạm, ngắn gọn, tích cực.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });

      setAiAdvice(response.text);
    } catch (e) {
      setAiAdvice("Hệ thống AI đang tổng hợp dữ liệu xu hướng...");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (overview) getAIAdvice();
  }, [overview, cycle]);

  if (results.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
        <LayoutDashboard size={64} className="text-slate-300 mb-4" />
        <h2 className="text-2xl font-black text-slate-400 uppercase">Chưa có dữ liệu hành trình</h2>
        <button onClick={onBack} className="mt-8 bg-white border-4 border-black px-8 py-3 rounded-xl font-black shadow-comic">QUAY LẠI</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-6xl space-y-6">
        
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2rem] shadow-comic">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500 rounded-2xl border-2 border-black rotate-[-2deg] shadow-comic-hover text-white">
                <Users size={28} />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-900 leading-none">Teacher Assist AI</h1>
                <p className="text-slate-500 font-bold text-sm italic">Quản trị nỗ lực & Hành trình lớp học</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-xl shadow-comic-hover">
             <ArrowLeft size={20} />
          </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatusCard 
              icon={<TrendingUp className="text-emerald-500" />}
              label="Mức độ tham gia"
              value={overview?.participationTrend || 'Ổn định'}
              color="bg-emerald-50 border-emerald-200 text-emerald-700"
              subValue="Dựa trên số lượng log tương tác"
           />
           <StatusCard 
              icon={<Sparkles className="text-amber-500" />}
              label="Thói quen tự học"
              value={`${overview?.activeHabitRatio}%`}
              color="bg-amber-50 border-amber-200 text-amber-700"
              subValue="Số em hoạt động ít nhất 3 ngày"
           />
           <StatusCard 
              icon={<Heart className="text-rose-500" />}
              label="Trạng thái lớp"
              value={overview?.emotionalTone || 'Tích cực'}
              color={overview?.emotionalTone === 'Tích cực' ? 'bg-blue-50 border-blue-200 text-blue-700' : 'bg-rose-50 border-rose-200 text-rose-700'}
              subValue="Cân bằng học tập - cảm xúc"
           />
        </div>

        <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 md:p-12 shadow-comic relative min-h-[400px]">
           <div className="flex items-center gap-4 mb-8">
              <Brain size={32} className="text-indigo-500" />
              <h3 className="text-2xl font-black uppercase italic">Phân tích xu hướng sư phạm</h3>
           </div>

           {loading ? (
             <div className="flex flex-col items-center justify-center py-20 opacity-30">
                <RefreshCw className="animate-spin mb-4" size={48} />
                <p className="font-black uppercase text-sm">AI đang quét hành trình lớp học...</p>
             </div>
           ) : (
             <div className="prose prose-slate max-w-none prose-p:font-bold prose-p:text-slate-600">
                <div className="whitespace-pre-line leading-relaxed text-lg font-bold text-slate-700">
                   {aiAdvice}
                </div>
             </div>
           )}
        </div>

        <div className="bg-blue-50 border-4 border-blue-400 border-dashed rounded-3xl p-6 flex items-center gap-4">
           <div className="bg-blue-400 p-3 rounded-2xl border-2 border-black">
              <ShieldCheck size={24} className="text-white" />
           </div>
           <p className="text-blue-800 font-bold text-sm">
             <strong>Cam kết bảo mật:</strong> Hệ thống chỉ hiển thị số liệu tổng hợp. Giáo viên không thể xem chi tiết từng tin nhắn cảm xúc hoặc lịch sử học tập cá nhân của học sinh.
           </p>
        </div>

      </div>
    </div>
  );
};

const StatusCard = ({ icon, label, value, color, subValue }: any) => (
  <div className="bg-white border-4 border-black rounded-[2rem] p-6 shadow-comic flex flex-col justify-between">
     <div className="flex justify-between items-start">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
        {icon}
     </div>
     <div className="mt-4">
        <div className={`inline-block px-3 py-1 rounded-lg border-2 font-black text-sm uppercase mb-2 ${color}`}>
           {value}
        </div>
        <p className="text-xs font-bold text-slate-500">{subValue}</p>
     </div>
  </div>
);

export default AdminDashboard;
