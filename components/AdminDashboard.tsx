
import React, { useEffect, useState } from 'react';
import { getResults, clearResults, getInteractions } from '../services/storageService';
import { StudentResult, InteractionRecord } from '../types';
// Added missing Info icon import from lucide-react to fix 'Cannot find name Info' error on line 55.
import { ArrowLeft, Trash2, Users, TrendingUp, BookOpen, Clock, Info } from 'lucide-react';

interface Props {
  onBack: () => void;
}

const AdminDashboard: React.FC<Props> = ({ onBack }) => {
  const [results, setResults] = useState<StudentResult[]>([]);
  const [interactions, setInteractions] = useState<InteractionRecord[]>([]);

  useEffect(() => {
    setResults(getResults().reverse());
    setInteractions(getInteractions());
  }, []);

  const handleClear = () => {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ dữ liệu hệ thống?')) {
      clearResults();
      setResults([]);
      setInteractions([]);
    }
  };

  // Aggregated Trends Logic
  const totalStudents = new Set(results.map(r => r.studentId)).size;
  const totalLearningHours = Math.round(interactions.reduce((acc, curr) => acc + curr.duration, 0) / 3600);
  const studyVsChillRatio = interactions.filter(i => i.activityType === 'Học tập').length / (interactions.length || 1);

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen font-sans">
      <div className="flex justify-between items-center mb-10">
        <button onClick={onBack} className="flex items-center gap-2 text-gray-600 font-bold hover:text-teal-600">
          <ArrowLeft size={20} /> Thoát Admin
        </button>
        <h1 className="text-3xl font-black text-gray-800 uppercase tracking-tighter">Báo cáo xu hướng lớp học</h1>
        <button onClick={handleClear} className="flex items-center gap-2 text-red-500 bg-red-50 px-4 py-2 rounded-lg font-bold hover:bg-red-100">
          <Trash2 size={18} /> Reset Dữ Liệu
        </button>
      </div>

      {/* Aggregate Trends Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
         <TrendCard icon={<Users/>} label="Số học sinh tham gia" value={totalStudents.toString()} color="bg-blue-50 text-blue-600" />
         <TrendCard icon={<Clock/>} label="Tổng thời lượng học" value={`${totalLearningHours} giờ`} color="bg-purple-50 text-purple-600" />
         <TrendCard icon={<TrendingUp/>} label="Mức độ tham gia" value={interactions.length > 50 ? 'Rất Cao' : 'Bình thường'} color="bg-emerald-50 text-emerald-600" />
         <TrendCard icon={<BookOpen/>} label="Tỷ lệ Học / Nghỉ" value={`${Math.round(studyVsChillRatio * 100)}%`} color="bg-amber-50 text-amber-600" />
      </div>

      <div className="bg-slate-50 p-6 rounded-3xl border-2 border-dashed border-slate-200 mb-10">
         <h3 className="font-black text-slate-400 uppercase text-xs tracking-widest mb-4 flex items-center gap-2">
            <Info size={14}/> Nguyên tắc riêng tư (GDPR compliant)
         </h3>
         <p className="text-sm font-bold text-slate-500 leading-relaxed">
           Hệ thống Learning Passport chỉ hiển thị xu hướng chung để giáo viên điều chỉnh nhịp độ giảng dạy. <br/>
           Dữ liệu chi tiết về cảm xúc (SOS Mood) và Danh hiệu cá nhân được bảo mật để khuyến khích học sinh tự do khám phá bản thân.
         </p>
      </div>

      <div className="overflow-x-auto shadow-sm rounded-2xl border border-gray-100">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-4 px-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Thời gian</th>
              <th className="py-4 px-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Hoạt động lớp</th>
              <th className="py-4 px-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Module</th>
              <th className="py-4 px-6 text-left text-xs font-black text-gray-400 uppercase tracking-widest">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {interactions.slice().reverse().map((r) => (
              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                <td className="py-4 px-6 text-sm font-bold text-gray-400">
                  {new Date(r.timestamp).toLocaleDateString('vi-VN')}
                </td>
                <td className="py-4 px-6 font-black text-gray-700">
                  {r.activityType}
                </td>
                <td className="py-4 px-6">
                   <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-500">{r.module}</span>
                </td>
                <td className="py-4 px-6">
                   <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase ${r.state === 'Tích cực' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {r.state}
                   </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const TrendCard = ({ icon, label, value, color }: any) => (
  <div className={`${color} p-6 rounded-3xl border-2 border-black/5 flex flex-col gap-2`}>
     <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/5 mb-2">{icon}</div>
     <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{label}</span>
     <span className="text-3xl font-black tracking-tighter">{value}</span>
  </div>
);

export default AdminDashboard;
