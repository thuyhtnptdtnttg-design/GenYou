
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PenTool, Sparkles, List, AlertCircle, Camera, Image as ImageIcon, RefreshCw, X } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";

interface Props {
  onBack: () => void;
}

const StudyHubWriting: React.FC<Props> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
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

  const handleGrade = async () => {
    if (!text.trim() && !image) return;
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
        contents.push({ text: "Hãy đọc bài luận trong ảnh (nếu có) hoặc dựa vào nội dung nhập tay dưới đây để chấm điểm: " + text });
      } else {
        contents.push({ text: `Bạn là chuyên gia chấm bài IELTS. Hãy chấm bài luận sau: ${text}` });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-pro-preview",
        contents: { parts: contents },
        config: { systemInstruction: "Trả lời bằng tiếng Việt. Format Markdown. Đưa ra điểm (0-9), nhận xét Ngữ pháp, Từ vựng, Mạch lạc và các câu cần sửa cụ thể." }
      });
      setFeedback(response.text);
    } catch (e) {
      console.error(e);
      alert("Lỗi khi chấm bài. Thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-blue-100 rounded-2xl border-2 border-blue-500">
               <PenTool className="text-blue-500" />
             </div>
             <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Chấm Bài Viết AI</h2>
           </div>
           <button 
             onClick={onBack} 
             className="flex items-center gap-2 px-8 py-3 bg-white border-4 border-black rounded-xl font-black text-slate-900 shadow-comic hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all active:scale-95"
           >
            <ArrowLeft size={24} /> Quay lại
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="relative group">
                <textarea 
                  className="w-full h-[400px] p-8 bg-white border-4 border-black rounded-[2.5rem] shadow-comic focus:ring-0 outline-none font-bold text-lg leading-relaxed resize-none"
                  placeholder="Dán bài luận của bạn vào đây hoặc đăng ảnh bên dưới..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-6 right-6 flex gap-2">
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                   <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-black p-3 rounded-xl hover:bg-gray-50 shadow-sm transition-all" title="Đăng ảnh bài viết">
                      <ImageIcon size={20} className="text-blue-500" />
                   </button>
                </div>
              </div>

              {image && (
                <div className="relative w-fit bg-white p-2 border-4 border-black rounded-2xl shadow-sm group">
                   <img src={image} alt="Uploaded" className="h-32 rounded-lg object-cover" />
                   <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black hover:bg-red-600">
                      <X size={16} />
                   </button>
                </div>
              )}

              <button 
                onClick={handleGrade}
                disabled={loading || (!text.trim() && !image)}
                className="w-full bg-blue-600 text-white py-5 rounded-[1.5rem] border-2 border-black shadow-comic-hover font-black text-xl flex items-center justify-center gap-3 hover:scale-102 active:scale-98 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                BẮT ĐẦU CHẤM ĐIỂM
              </button>
           </div>

           <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-comic overflow-y-auto max-h-[600px] relative">
              <div className="sticky top-0 bg-white pb-4 border-b-2 border-gray-100 mb-6 flex items-center justify-between">
                 <h3 className="text-xl font-black flex items-center gap-2">
                   <List className="text-blue-500" size={20} /> KẾT QUẢ PHÂN TÍCH
                 </h3>
                 {feedback && <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-[10px] font-black uppercase">AI Evaluation</div>}
              </div>

              {feedback ? (
                <div className="prose prose-blue max-w-none font-bold text-gray-700 whitespace-pre-line leading-relaxed">
                  {feedback}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30 py-20">
                   <AlertCircle size={48} className="mb-4" />
                   <p className="font-bold">Hệ thống đang đợi nội dung của bạn đó!</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHubWriting;
