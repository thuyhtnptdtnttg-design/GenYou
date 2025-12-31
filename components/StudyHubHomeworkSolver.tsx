
'use client';
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Sparkles, ImageIcon, X, RefreshCw, List, AlertCircle, Send } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { solveHomeworkAction } from '../app/actions/ai';

interface Props {
  onBack: () => void;
}

const StudyHubHomeworkSolver: React.FC<Props> = ({ onBack }) => {
  const [image, setImage] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [solution, setSolution] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSolve = async () => {
    if (!image && !description.trim()) return;
    setLoading(true);
    
    // Chỉ lấy phần data base64
    const base64Data = image ? image.split(',')[1] : null;
    
    const result = await solveHomeworkAction(base64Data, description);
    
    if (result.success) {
      setSolution(result.text || "AI đã hoàn thành nhưng không có phản hồi.");
    } else {
      alert("Lỗi: " + result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#FFF8F0] p-6 md:p-12 font-hand flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-10 bg-white border-4 border-black p-6 rounded-[2.5rem] shadow-comic">
           <div className="flex items-center gap-4">
             <motion.div 
               animate={{ y: [0, -4, 0], rotate: [-3, 2, -3] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="p-3 bg-orange-400 rounded-2xl border-2 border-black shadow-comic-hover text-white"
             >
               <GraduationCap size={32} />
             </motion.div>
             <motion.div animate={{ x: [0, 2, 0] }} transition={{ duration: 4, repeat: Infinity }}>
                <h2 className="text-3xl font-black text-slate-900 leading-none uppercase italic">Giải Bài Tập AI</h2>
                <p className="text-slate-500 font-bold text-sm">Học tập thông minh hơn mỗi ngày</p>
             </motion.div>
           </div>
           <button 
             onClick={onBack} 
             className="flex items-center gap-2 px-8 py-3 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
           >
            <ArrowLeft size={24} /> Quay lại
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
           <div className="space-y-8">
              <div className="bg-white border-4 border-black rounded-[3rem] p-8 shadow-comic space-y-6">
                 <h3 className="text-2xl font-black text-slate-800 uppercase italic tracking-tighter">1. Tải lên đề bài</h3>
                 <div className="relative group">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className={`w-full aspect-video border-4 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center gap-4 transition-all
                        ${image ? 'border-orange-500 bg-orange-50' : 'border-slate-200 bg-slate-50 hover:border-orange-300 hover:bg-orange-50/30'}
                      `}
                    >
                       {image ? (
                         <div className="relative w-full h-full p-4">
                            <img src={image} alt="Homework" className="w-full h-full object-contain rounded-xl" />
                         </div>
                       ) : (
                         <>
                            <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="p-5 bg-white rounded-full border-4 border-black shadow-comic-hover">
                               <ImageIcon size={48} className="text-orange-400" />
                            </motion.div>
                            <span className="text-xl font-black text-slate-400 uppercase tracking-widest">Bấm để tải ảnh bài tập</span>
                         </>
                       )}
                    </button>
                    <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                    {image && (
                       <button onClick={() => setImage(null)} className="absolute -top-4 -right-4 bg-red-500 text-white p-2 rounded-full border-4 border-black shadow-comic hover:scale-110 transition-all z-10">
                          <X size={20} />
                       </button>
                    )}
                 </div>
                 <textarea 
                    className="w-full p-6 bg-slate-50 border-4 border-black rounded-2xl font-bold text-lg outline-none focus:bg-white transition-all resize-none h-32"
                    placeholder="Mô tả thêm yêu cầu..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                 />
                 <button 
                   onClick={handleSolve}
                   disabled={loading || (!image && !description.trim())}
                   className="w-full bg-orange-500 text-white py-6 rounded-[2rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                    {loading ? <RefreshCw className="animate-spin" /> : <Send size={24} />}
                    {loading ? 'ĐANG GIẢI QUYẾT...' : 'GIẢI BÀI TẬP NGAY'}
                 </button>
              </div>
           </div>
           <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-comic flex flex-col min-h-[600px] relative overflow-hidden">
              <div className="sticky top-0 bg-white pb-6 border-b-4 border-black mb-8 flex items-center justify-between z-10">
                 <h3 className="text-2xl font-black flex items-center gap-3 italic"><List className="text-orange-500" size={28} /> KẾT QUẢ & LỜI GIẢI</h3>
              </div>
              <div className="flex-1 overflow-y-auto custom-scrollbar font-sans">
                 {loading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-6">
                      <Sparkles size={48} className="text-orange-400 animate-spin" />
                      <p className="text-xl font-black text-slate-400 uppercase italic">AI đang giải đố...</p>
                   </div>
                 ) : solution ? (
                   <div className="prose prose-orange max-w-none prose-p:font-bold">
                     <ReactMarkdown>{solution}</ReactMarkdown>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                      <AlertCircle size={80} className="mb-6 mx-auto" />
                      <p className="text-2xl font-black uppercase">Đang đợi đề bài</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHubHomeworkSolver;
