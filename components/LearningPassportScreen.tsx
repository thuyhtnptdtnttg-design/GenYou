
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Star, Calendar, Zap, Heart, 
  Award, Clock, CheckCircle2, History,
  TrendingUp, Compass, Coffee, Sparkles, BookOpen
} from 'lucide-react';
import { getInteractionLogs, getResults } from '../services/storageService';
import { InteractionLog, StudentResult } from '../types';

interface Props {
  studentName: string;
  onBack: () => void;
}

const LearningPassportScreen: React.FC<Props> = ({ studentName, onBack }) => {
  const logs = useMemo(() => getInteractionLogs(), []);
  const results = useMemo(() => getResults(), []);

  // AI Analytics (Aggregate)
  const stats = useMemo(() => {
    const totalDuration = logs.reduce((acc, l) => acc + l.duration, 0);
    const uniqueDays = new Set(logs.map(l => new Date(l.timestamp).toLocaleDateString())).size;
    const modulesUsed = new Set(logs.map(l => l.module)).size;
    const studyCount = logs.filter(l => l.activityType === 'Học tập' || l.activityType === 'Ôn luyện').length;
    const chillCount = logs.filter(l => l.activityType === 'Thư giãn').length;

    // Title Logic
    let titles = [];
    if (uniqueDays >= 3) titles.push({ name: "Người học bền bỉ", icon: <History size={16}/>, desc: "Duy trì thói quen học tập liên tục trong nhiều ngày." });
    if (modulesUsed >= 4) titles.push({ name: "Nhà thám hiểm tri thức", icon: <Compass size={16}/>, desc: "Chủ động khám phá đa dạng các module học tập." });
    if (chillCount > 0 && studyCount > 0) titles.push({ name: "Học tập có cân bằng", icon: <Coffee size={16}/>, desc: "Biết cách điều chỉnh nhịp độ giữa học và nghỉ." });
    if (logs.length > 10) titles.push({ name: "Tinh thần tự học tích cực", icon: <Sparkles size={16}/>, desc: "Luôn nỗ lực hoàn thành các nhiệm vụ tự chọn." });

    return { totalDuration, uniqueDays, modulesUsed, titles };
  }, [logs]);

  return (
    <div className="min-h-screen bg-[#FFFDF5] font-sans p-4 md:p-8 flex flex-col items-center overflow-x-hidden">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* Header - Passport Look */}
        <header className="flex justify-between items-center bg-white border-4 border-black p-6 rounded-[2rem] shadow-comic">
          <div className="flex items-center gap-4">
             <div className="p-3 bg-indigo-500 rounded-2xl border-2 border-black rotate-[-2deg] shadow-comic-hover">
                <BookOpen size={32} className="text-white" />
             </div>
             <div>
                <h1 className="text-3xl font-black text-slate-900 leading-none">Learning Passport</h1>
                <p className="text-slate-500 font-bold text-sm italic">Ghi nhận nỗ lực của {studentName}</p>
             </div>
          </div>
          <button onClick={onBack} className="bg-white border-2 border-black p-3 rounded-xl hover:translate-y-1 transition-all shadow-comic-hover">
            <ArrowLeft size={24} />
          </button>
        </header>

        {/* 1. Nỗ lực nổi bật */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <StatBox icon={<Calendar className="text-blue-500" />} label="Ngày hoạt động" value={stats.uniqueDays} sub="Sự kiên trì" />
           <StatBox icon={<Clock className="text-rose-500" />} label="Phút nỗ lực" value={Math.floor(stats.totalDuration / 60)} sub="Thời gian tập trung" />
           <StatBox icon={<Zap className="text-yellow-500" />} label="Hoạt động" value={logs.length} sub="Mức độ tích cực" />
        </div>

        {/* 2. Danh hiệu nỗ lực */}
        <section className="bg-white border-4 border-black rounded-[3rem] p-8 shadow-comic">
           <h3 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
              <Award className="text-indigo-500" /> DANH HIỆU ĐÃ ĐẠT ĐƯỢC
           </h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.titles.length > 0 ? stats.titles.map((t, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }}
                  key={t.name} 
                  className="bg-indigo-50 border-2 border-indigo-100 p-4 rounded-2xl flex items-start gap-4"
                >
                   <div className="bg-white p-2 rounded-xl border-2 border-indigo-200 text-indigo-500 shadow-sm shrink-0">
                      {t.icon}
                   </div>
                   <div>
                      <h4 className="font-black text-indigo-900 text-lg leading-none mb-1">{t.name}</h4>
                      <p className="text-xs font-bold text-indigo-700/70 leading-snug">{t.desc}</p>
                   </div>
                </motion.div>
              )) : (
                <div className="col-span-2 py-10 text-center opacity-30 italic font-bold">
                   Cùng tham gia thêm các hoạt động để nhận danh hiệu nỗ lực đầu tiên nhé!
                </div>
              )}
           </div>
        </section>

        {/* 3. Timeline Hành trình */}
        <section className="space-y-6">
           <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3 uppercase tracking-tighter px-4">
              <TrendingUp className="text-emerald-500" /> Nhật ký hành trình tích cực
           </h3>
           <div className="space-y-4">
              {logs.length > 0 ? [...logs].reverse().slice(0, 10).map((log, i) => (
                <motion.div 
                  initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                  key={i} 
                  className="bg-white border-2 border-black p-5 rounded-[1.5rem] shadow-comic-hover flex items-center justify-between"
                >
                   <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-lg border-2 border-black ${log.module === 'BrainCandy' ? 'bg-pink-100' : log.module === 'SOSMood' ? 'bg-rose-100' : log.module === 'ChillZone' ? 'bg-cyan-100' : 'bg-emerald-100'}`}>
                         {log.module === 'BrainCandy' && <Zap size={18} />}
                         {log.module === 'SOSMood' && <Heart size={18} />}
                         {log.module === 'ChillZone' && <Coffee size={18} />}
                         {log.module === 'StudyHub' && <CheckCircle2 size={18} />}
                         {log.module === 'GenYou' && <Star size={18} />}
                      </div>
                      <div>
                         <p className="font-black text-slate-800 leading-none mb-1">{log.activityType} tại {log.module}</p>
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{new Date(log.timestamp).toLocaleString('vi-VN')}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <span className="text-[10px] font-black bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                        {log.status}
                      </span>
                   </div>
                </motion.div>
              )) : (
                <div className="bg-white border-4 border-dashed border-slate-200 p-20 rounded-[3rem] text-center opacity-40">
                   <p className="font-black text-xl">Hành trình của bạn sẽ bắt đầu khi bạn thực hiện hoạt động đầu tiên!</p>
                </div>
              )}
           </div>
        </section>

        {/* Lời nhắn động viên */}
        <div className="bg-amber-100 border-4 border-black p-8 rounded-[3rem] shadow-comic text-center relative overflow-hidden group">
            <Sparkles className="absolute top-4 left-4 text-amber-300" />
            <p className="text-xl font-black text-slate-800 leading-relaxed italic">
              "Hãy cứ tiến về phía trước, dù là bước đi nhỏ nhất. <br/> Learning Passport luôn ở đây để ghi nhận nỗ lực tuyệt vời của em!"
            </p>
        </div>

      </div>
    </div>
  );
};

const StatBox = ({ icon, label, value, sub }: any) => (
  <div className="bg-white border-4 border-black p-6 rounded-[2rem] shadow-comic flex flex-col items-center text-center gap-2">
     <div className="bg-slate-50 p-3 rounded-2xl border-2 border-slate-100 mb-2">
        {icon}
     </div>
     <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{label}</p>
     <p className="text-4xl font-black text-slate-900 leading-none my-1">{value}</p>
     <p className="text-[10px] font-bold text-slate-400 italic">{sub}</p>
  </div>
);

export default LearningPassportScreen;
