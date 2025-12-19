
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Brain, Sparkles, FileText, GitBranch, Image as ImageIcon, X, RefreshCw } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  onBack: () => void;
}

const StudyHubSummary: React.FC<Props> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
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

  const handleProcess = async () => {
    if (!text.trim() && !image) return;
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const parts: any[] = [];
      if (image) {
        parts.push({
          inlineData: { data: image.split(',')[1], mimeType: 'image/jpeg' }
        });
        parts.push({ text: "Hãy đọc văn bản trong ảnh và tóm tắt. Nếu có văn bản đi kèm này nữa thì kết hợp lại: " + text });
      } else {
        parts.push({ text: `Hãy tóm tắt văn bản sau: ${text}` });
      }

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              summary: { type: Type.STRING },
              mindmap: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    node: { type: Type.STRING },
                    children: { type: Type.ARRAY, items: { type: Type.STRING } }
                  }
                }
              }
            }
          }
        }
      });
      setResult(JSON.parse(response.text));
    } catch (e) {
      console.error(e);
      alert("Lỗi khi xử lý. Thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F3FF] p-6 md:p-12 font-sans flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="flex justify-between items-center mb-8">
           <div className="flex items-center gap-3">
             <div className="p-3 bg-purple-100 rounded-2xl border-2 border-purple-500">
               <Brain className="text-purple-500" />
             </div>
             <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">Tóm Tắt & Mindmap AI</h2>
           </div>
           <button onClick={onBack} className="text-gray-500 font-bold hover:text-black flex items-center gap-2">
            <ArrowLeft size={20} /> Quay lại
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
           <div className="space-y-6">
              <div className="relative">
                <textarea 
                  className="w-full h-80 p-8 bg-white border-4 border-black rounded-[2.5rem] shadow-comic focus:ring-0 outline-none font-bold text-lg leading-relaxed resize-none"
                  placeholder="Dán nội dung bài học hoặc đăng ảnh chụp tài liệu..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                <div className="absolute bottom-6 right-6 flex gap-2">
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                   <button onClick={() => fileInputRef.current?.click()} className="bg-white border-2 border-black p-3 rounded-xl hover:bg-gray-50 shadow-sm" title="Đăng ảnh tài liệu">
                      <ImageIcon size={20} className="text-purple-500" />
                   </button>
                </div>
              </div>

              {image && (
                <div className="relative w-fit bg-white p-2 border-4 border-black rounded-2xl shadow-sm group">
                   <img src={image} alt="Document" className="h-32 rounded-lg object-cover" />
                   <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full border-2 border-black">
                      <X size={16} />
                   </button>
                </div>
              )}

              <button 
                onClick={handleProcess}
                disabled={loading || (!text.trim() && !image)}
                className="w-full bg-purple-600 text-white py-5 rounded-[1.5rem] border-2 border-black shadow-comic-hover font-black text-xl flex items-center justify-center gap-3 hover:scale-102 transition-all disabled:opacity-50"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <><Sparkles /> TẠO TÓM TẮT & MINDMAP</>}
              </button>
           </div>

           <div className="space-y-6">
              {result ? (
                <div className="space-y-6">
                   <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-comic">
                      <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                        <FileText className="text-purple-500" /> NỘI DUNG CÔ ĐỌNG
                      </h3>
                      <p className="font-bold text-gray-600 leading-relaxed italic">"{result.summary}"</p>
                   </div>

                   <div className="bg-white border-4 border-black rounded-[2.5rem] p-8 shadow-comic">
                      <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                        <GitBranch className="text-purple-500" /> SƠ ĐỒ TƯ DUY (MINDMAP)
                      </h3>
                      <div className="space-y-6">
                         {result.mindmap.map((item: any, i: number) => (
                           <div key={i} className="space-y-3">
                              <div className="bg-purple-600 text-white p-3 rounded-xl font-black inline-block border-2 border-black shadow-sm">
                                {item.node}
                              </div>
                              <div className="pl-6 border-l-4 border-dashed border-purple-200 space-y-2 ml-4">
                                 {item.children.map((child: string, j: number) => (
                                   <div key={j} className="bg-white border-2 border-purple-100 p-2.5 rounded-lg font-bold text-sm text-gray-600 shadow-sm relative">
                                      <span className="absolute -left-3 top-1/2 w-3 h-[2px] bg-purple-200"></span>
                                      {child}
                                   </div>
                                 ))}
                              </div>
                           </div>
                         ))}
                      </div>
                   </div>
                </div>
              ) : (
                <div className="h-[500px] bg-white border-4 border-black border-dashed rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center opacity-20">
                   <Brain size={80} className="mb-4" />
                   <p className="font-black text-xl">Xử lý xong sẽ hiển thị sơ đồ tại đây!</p>
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
};

export default StudyHubSummary;
