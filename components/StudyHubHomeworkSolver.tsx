
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Sparkles, ImageIcon, X, RefreshCw, List, AlertCircle, Send } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

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
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const contents: any[] = [];
      
      if (image) {
        contents.push({
          inlineData: {
            data: image.split(',')[1],
            mimeType: 'image/jpeg'
          }
        });
      }
      
      const promptText = `Bạn là một trợ lý giải bài tập chuyên nghiệp, tận tâm cho học sinh trung học Việt Nam.
      ${image ? "Hãy phân tích hình ảnh bài tập được đính kèm." : ""}
      Nhiệm vụ của bạn:
      1. Đọc kỹ yêu cầu bài tập ${description ? `và lưu ý thêm của học sinh: "${description}"` : ""}.
      2. Đưa ra câu trả lời CHÍNH XÁC.
      3. Cung cấp lời giải CHI TIẾT, từng bước một.
      4. Sử dụng ngôn ngữ DỄ HIỂU, gần gũi với học sinh.
      5. Nếu là môn Toán/Lý/Hóa, hãy trình bày rõ ràng các công thức và phép tính.
      6. Kết thúc bằng một lời nhắn khích lệ học sinh tự luyện tập thêm.
      
      Hãy trình bày theo định dạng Markdown đẹp mắt.`;

      contents.push({ text: promptText });

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: { parts: contents },
      });
      
      setSolution(response.text);
    } catch (e) {
      console.error(e);
      alert("Hệ thống gặp lỗi khi giải bài. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
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
           {/* Input Section */}
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
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[2rem]">
                               <span className="bg-white text-black px-4 py-2 rounded-full font-black text-sm border-2 border-black">THAY ĐỔI ẢNH</span>
                            </div>
                         </div>
                       ) : (
                         <>
                            <motion.div 
                              animate={{ scale: [1, 1.1, 1] }}
                              transition={{ duration: 2, repeat: Infinity }}
                              className="p-5 bg-white rounded-full border-4 border-black shadow-comic-hover"
                            >
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

                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Mô tả thêm (không bắt buộc)</label>
                    <textarea 
                       className="w-full p-6 bg-slate-50 border-4 border-black rounded-2xl font-bold text-lg outline-none focus:bg-white transition-all resize-none h-32"
                       placeholder="Nhập phần bạn chưa hiểu hoặc yêu cầu cụ thể..."
                       value={description}
                       onChange={(e) => setDescription(e.target.value)}
                    />
                 </div>

                 <button 
                   onClick={handleSolve}
                   disabled={loading || (!image && !description.trim())}
                   className="w-full bg-orange-500 text-white py-6 rounded-[2rem] border-4 border-black font-black text-2xl shadow-comic hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                 >
                    {loading ? <RefreshCw className="animate-spin" /> : <Send size={24} />}
                    {loading ? 'ĐANG GIẢI QUYẾT...' : 'GIẢI BÀI TẬP NGAY'}
                 </button>
              </div>
           </div>

           {/* Output Section */}
           <div className="bg-white border-4 border-black rounded-[3rem] p-10 shadow-comic flex flex-col min-h-[600px] relative overflow-hidden">
              <div className="sticky top-0 bg-white pb-6 border-b-4 border-black mb-8 flex items-center justify-between z-10">
                 <h3 className="text-2xl font-black flex items-center gap-3 italic">
                   <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}><List className="text-orange-500" size={28} /></motion.div> 
                   KẾT QUẢ & LỜI GIẢI
                 </h3>
                 {solution && (
                   <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-orange-100 text-orange-700 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border-2 border-orange-200"
                   >
                     AI Solved
                   </motion.div>
                 )}
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 font-sans">
                 {loading ? (
                   <div className="h-full flex flex-col items-center justify-center space-y-6">
                      <div className="w-24 h-24 bg-orange-50 rounded-full flex items-center justify-center border-4 border-orange-200 animate-pulse">
                         <Sparkles size={48} className="text-orange-400 animate-spin" />
                      </div>
                      <p className="text-xl font-black text-slate-400 uppercase italic animate-bounce">AI đang miệt mài giải đố...</p>
                   </div>
                 ) : solution ? (
                   <div className="prose prose-orange max-w-none prose-p:font-bold prose-p:text-slate-700 prose-headings:font-black prose-headings:text-slate-900 prose-li:font-bold">
                     <ReactMarkdown>{solution}</ReactMarkdown>
                   </div>
                 ) : (
                   <div className="h-full flex flex-col items-center justify-center text-center opacity-20 py-20">
                      <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
                        <AlertCircle size={80} className="mb-6 mx-auto" />
                      </motion.div>
                      <p className="text-2xl font-black uppercase tracking-widest">Đang đợi yêu cầu của bạn</p>
                      <p className="text-lg font-bold mt-2 italic max-w-xs mx-auto">Hãy đăng ảnh đề bài để nhận lời giải chuẩn xác nhất!</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>
      
      <footer className="mt-20 text-slate-400 font-black text-[10px] uppercase tracking-[0.5em] pb-10">
        Homework Solver Engine v1.0 • StudyHub Pro
      </footer>
    </div>
  );
};

export default StudyHubHomeworkSolver;
