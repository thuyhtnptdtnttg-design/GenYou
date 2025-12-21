
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, Brain, Sparkles, FileText, GitBranch, 
  Image as ImageIcon, X, RefreshCw, Copy, Download,
  Target, Zap, HelpCircle, Info, Layout, Layers, 
  Lightbulb, AlertTriangle, PlayCircle, BookOpen, ChevronRight
} from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";

interface Props {
  onBack: () => void;
}

interface MindmapNode {
  branchTitle: string;
  branchType: 'Concept' | 'Process' | 'Application' | 'Revision';
  nodes: {
    label: 'Định nghĩa' | 'Quy trình' | 'Ví dụ' | 'Lưu ý' | 'Công thức' | 'Lỗi thường gặp' | 'Mẹo nhớ';
    text: string;
  }[];
}

interface ProcessedResult {
  mainTopic: string;
  mindmap: MindmapNode[];
  summarySnapshot: string[];
}

const StudyHubSummary: React.FC<Props> = ({ onBack }) => {
  const [text, setText] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<ProcessedResult | null>(null);
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
      }
      
      const prompt = `Bạn là chuyên gia thiết kế sơ đồ tư duy học thuật cao cấp cho học sinh Việt Nam.
      Nhiệm vụ: Chuyển đổi nội dung bài học thành một Sơ đồ tư duy (Mind Map) phân tầng chuyên nghiệp.

      QUY TẮC NGHIÊM NGẶT (STRICT):
      1. Bố cục: 1 Chủ đề chính -> 3-7 Nhánh (Branch).
      2. Độ dài: Mỗi nút (node) tuyệt đối không quá 15 từ. KHÔNG viết đoạn văn.
      3. Phân tầng logic: Ưu tiên Nguyên nhân -> Kết quả hoặc Định nghĩa -> Công thức -> Ứng dụng.
      4. Phân loại nhánh (branchType): Chọn trong [Concept, Process, Application, Revision].
      5. Nhãn nút (label): Chọn trong [Định nghĩa, Quy trình, Ví dụ, Lưu ý, Công thức, Lỗi thường gặp, Mẹo nhớ].
      6. Ngôn ngữ: Tiếng Việt học thuật, trung tính. KHÔNG sử dụng chữ tiếng Hàn hay emoji trong nội dung text.
      7. Snapshot: Trích xuất 3 điểm quan trọng nhất để ôn thi.

      Nội dung cần xử lý: ${text}`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: { parts: [...parts, { text: prompt }] },
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              mainTopic: { type: Type.STRING },
              mindmap: { 
                type: Type.ARRAY, 
                items: {
                  type: Type.OBJECT,
                  properties: {
                    branchTitle: { type: Type.STRING },
                    branchType: { type: Type.STRING },
                    nodes: {
                      type: Type.ARRAY,
                      items: {
                        type: Type.OBJECT,
                        properties: {
                          label: { type: Type.STRING },
                          text: { type: Type.STRING }
                        }
                      }
                    }
                  }
                }
              },
              summarySnapshot: { 
                type: Type.ARRAY, 
                items: { type: Type.STRING }
              }
            },
            required: ["mainTopic", "mindmap", "summarySnapshot"]
          }
        }
      });

      setResult(JSON.parse(response.text));
    } catch (e) {
      console.error(e);
      alert("Lỗi phân tích AI. Vui lòng kiểm tra lại nội dung đầu vào.");
    } finally {
      setLoading(false);
    }
  };

  const getBranchColor = (type: string) => {
    switch(type) {
      case 'Concept': return { bg: 'bg-blue-50', border: 'border-blue-400', text: 'text-blue-700', icon: <BookOpen size={16}/> };
      case 'Process': return { bg: 'bg-emerald-50', border: 'border-emerald-400', text: 'text-emerald-700', icon: <Layers size={16}/> };
      case 'Application': return { bg: 'bg-amber-50', border: 'border-amber-400', text: 'text-amber-700', icon: <Zap size={16}/> };
      default: return { bg: 'bg-rose-50', border: 'border-rose-400', text: 'text-rose-700', icon: <AlertTriangle size={16}/> };
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans flex flex-col items-center relative overflow-x-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

      <div className="w-full max-w-6xl space-y-8 z-10">
        
        {/* Header */}
        <header className="flex justify-between items-center bg-white border-4 border-slate-900 p-6 rounded-[2.5rem] shadow-comic">
           <div className="flex items-center gap-4">
             <div className="p-3 bg-violet-600 rounded-2xl shadow-sm text-white rotate-[-2deg]">
               <GitBranch size={28} />
             </div>
             <div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-900 uppercase tracking-tight">Mindmap Thông Minh</h2>
                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center gap-1">
                  <Layout size={12}/> AI Learning Scaffolding
                </p>
             </div>
           </div>
           <button onClick={onBack} className="bg-slate-50 border-2 border-slate-200 hover:border-slate-900 p-3 rounded-2xl transition-all hover:bg-white active:scale-95">
            <ArrowLeft size={24} className="text-slate-600" />
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
           
           {/* Left: Input Sidebar */}
           <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border-4 border-slate-900 rounded-[2.5rem] p-6 shadow-comic relative overflow-hidden group">
                <div className="flex items-center gap-2 mb-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">
                  <FileText size={14}/> Tài liệu bài học
                </div>
                <textarea 
                  className="w-full h-80 bg-transparent border-none focus:ring-0 outline-none font-bold text-lg leading-relaxed resize-none placeholder:text-slate-200 font-sans"
                  placeholder="Dán bài học, ghi chú hoặc nội dung PDF vào đây để AI tóm tắt..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                />
                
                <div className="absolute bottom-6 right-6 flex items-center gap-2">
                   <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={handleImageUpload} />
                   <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white hover:bg-slate-50 text-slate-400 hover:text-violet-600 p-3 rounded-xl border-2 border-slate-100 hover:border-violet-200 transition-all shadow-sm"
                    title="Tải ảnh tài liệu"
                   >
                      <ImageIcon size={20} />
                   </button>
                </div>
              </div>

              {image && (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="relative w-fit">
                   <img src={image} alt="Source" className="h-24 w-24 object-cover rounded-2xl border-4 border-slate-900 shadow-sm" />
                   <button onClick={() => setImage(null)} className="absolute -top-2 -right-2 bg-rose-500 text-white p-1 rounded-full border-2 border-slate-900 shadow-sm">
                      <X size={14} />
                   </button>
                </motion.div>
              )}

              <button 
                onClick={handleProcess}
                disabled={loading || (!text.trim() && !image)}
                className="w-full bg-violet-600 text-white py-6 rounded-[2rem] border-4 border-slate-900 shadow-comic hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black text-xl flex items-center justify-center gap-3 disabled:opacity-50 uppercase"
              >
                {loading ? <RefreshCw className="animate-spin" /> : <Sparkles />}
                {loading ? 'ĐANG PHÂN TÍCH...' : 'VẼ SƠ ĐỒ TƯ DUY'}
              </button>
              
              <div className="bg-slate-100 p-5 rounded-[2rem] border-2 border-dashed border-slate-300">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Info size={12}/> Chế độ NotebookLM
                </p>
                <ul className="text-[11px] font-bold text-slate-400 space-y-2 leading-relaxed">
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-1.5 shrink-0"/> Trình bày phân tầng đa cấp trực quan.</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-1.5 shrink-0"/> Tự động phân loại Concept và Process.</li>
                  <li className="flex gap-2"><div className="w-1.5 h-1.5 bg-violet-400 rounded-full mt-1.5 shrink-0"/> Giới hạn 15 từ mỗi node để ôn tập nhanh.</li>
                </ul>
              </div>
           </div>

           {/* Right: Visual Output */}
           <div className="lg:col-span-8">
              {result ? (
                <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                   
                   {/* Main Interactive Map Area */}
                   <div className="bg-white border-4 border-slate-900 rounded-[3rem] p-8 md:p-12 shadow-comic relative overflow-hidden">
                      {/* Grid Background Effect */}
                      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                      {/* Central Concept Node */}
                      <div className="flex flex-col items-center mb-20 relative">
                         <motion.div 
                           initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                           className="bg-slate-900 text-white px-12 py-6 rounded-[2.5rem] shadow-2xl border-4 border-violet-400 relative z-10 text-center"
                         >
                            <span className="text-[9px] font-black text-violet-300 uppercase tracking-[0.4em] block mb-1">Chủ đề trung tâm</span>
                            <h3 className="text-3xl md:text-4xl font-black uppercase leading-tight tracking-tighter">{result.mainTopic}</h3>
                         </motion.div>
                         {/* Downward Connector Line */}
                         <div className="w-1.5 h-16 bg-slate-200 mt-[-2px] rounded-b-full"></div>
                      </div>

                      {/* Visual Branches Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16 relative">
                         {result.mindmap.map((branch, i) => {
                           const style = getBranchColor(branch.branchType);
                           return (
                             <motion.div 
                               key={i} 
                               initial={{ opacity: 0, y: 20 }} 
                               animate={{ opacity: 1, y: 0 }}
                               transition={{ delay: i * 0.1 }}
                               className="relative group"
                             >
                                {/* Branch Header Node */}
                                <div className={`${style.bg} border-4 border-slate-900 p-5 rounded-[1.5rem] flex items-center gap-4 shadow-sm mb-8 relative z-10 hover:-rotate-1 transition-transform`}>
                                   <div className={`p-2.5 rounded-xl bg-white border-2 border-slate-900 shadow-sm ${style.text}`}>
                                     {style.icon}
                                   </div>
                                   <h4 className="font-black text-slate-900 uppercase tracking-tight text-lg leading-none">{branch.branchTitle}</h4>
                                   <div className={`absolute -top-10 left-1/2 w-0.5 h-10 bg-slate-100 group-hover:bg-slate-200 transition-colors`}></div>
                                </div>

                                {/* Nodes List with connection lines */}
                                <div className="space-y-4 pl-6 border-l-4 border-slate-100 group-hover:border-slate-200 transition-colors ml-6">
                                   {branch.nodes.map((node, j) => (
                                     <div key={j} className="flex gap-4 items-start animate-in fade-in slide-in-from-left-2" style={{ animationDelay: `${(i*0.1) + (j*0.05)}s` }}>
                                        <div className="mt-3 w-4 h-0.5 bg-slate-200 rounded-full"></div>
                                        <div className="bg-white border-2 border-slate-200 p-4 rounded-2xl flex-1 hover:border-slate-900 hover:shadow-sm transition-all">
                                           <div className="flex items-center gap-1.5 mb-2">
                                              <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md border ${style.border} ${style.bg} ${style.text}`}>
                                                {node.label}
                                              </span>
                                           </div>
                                           <p className="text-slate-600 font-bold text-sm leading-relaxed">{node.text}</p>
                                        </div>
                                     </div>
                                   ))}
                                </div>
                             </motion.div>
                           );
                         })}
                      </div>

                      {/* Summary Snapshot - UPDATED: Korean text (핵심) removed */}
                      <div className="mt-24 pt-10 border-t-4 border-dashed border-slate-100">
                         <div className="flex items-center gap-3 mb-8">
                            <Target className="text-rose-500" size={24} />
                            <h4 className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">Summary Snapshot</h4>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {result.summarySnapshot.map((ss, i) => (
                              <div key={i} className="bg-slate-900 text-white p-6 rounded-3xl relative overflow-hidden group">
                                 {/* Accent Decor */}
                                 <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:rotate-12 transition-transform">
                                    <Target size={60} />
                                 </div>
                                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest block mb-3 border-b border-white/10 pb-2">Key Point 0{i+1}</span>
                                 <p className="font-bold text-sm leading-snug text-slate-100">{ss}</p>
                              </div>
                            ))}
                         </div>
                      </div>
                   </div>

                   {/* Quick Actions Footer */}
                   <div className="flex flex-wrap justify-center gap-4 pt-4 pb-10">
                      <button 
                        onClick={() => window.print()}
                        className="flex items-center gap-2 bg-white border-4 border-slate-900 px-8 py-4 rounded-2xl font-black text-xs hover:bg-slate-50 transition-all shadow-comic active:translate-y-1 active:shadow-none"
                      >
                        <Download size={16} /> LƯU VÀO PASSPORT
                      </button>
                      <button 
                        onClick={() => {
                          const plain = `${result.mainTopic}\n\n` + result.mindmap.map(b => `[${b.branchTitle}]\n` + b.nodes.map(n => `- ${n.label}: ${n.text}`).join('\n')).join('\n\n');
                          navigator.clipboard.writeText(plain);
                          alert("Đã sao chép nội dung văn bản!");
                        }}
                        className="flex items-center gap-2 bg-white border-2 border-slate-200 px-8 py-4 rounded-2xl font-black text-xs hover:border-slate-900 transition-all active:scale-95"
                      >
                        <Copy size={16} /> SAO CHÉP TEXT
                      </button>
                   </div>
                </motion.div>
              ) : (
                <div className="h-full min-h-[600px] bg-white border-4 border-slate-900 border-dashed rounded-[3rem] flex flex-col items-center justify-center text-center p-12 space-y-6">
                   <motion.div 
                     animate={{ rotate: [0, 5, -5, 0], y: [0, -5, 0] }}
                     transition={{ repeat: Infinity, duration: 6 }}
                     className="w-32 h-32 bg-slate-50 rounded-full flex items-center justify-center border-4 border-slate-100 shadow-inner"
                   >
                     <Brain size={64} className="text-slate-200" />
                   </motion.div>
                   <div className="space-y-2">
                     <h3 className="text-2xl font-black text-slate-300 uppercase tracking-widest italic">Hệ thống đang chờ lệnh</h3>
                     <p className="text-sm font-bold text-slate-300 max-w-xs mx-auto leading-relaxed">
                       Dán nội dung bài học vào bảng bên trái để AI bắt đầu thiết kế sơ đồ tư duy phân tầng cho bạn.
                     </p>
                   </div>
                </div>
              )}
           </div>

        </div>
      </div>
      
      <footer className="mt-12 text-slate-400 font-black text-[10px] uppercase tracking-[0.5em] pb-10">
        StudyHub Hierarchy Engine v3.2 • NotebookLM Style
      </footer>
    </div>
  );
};

export default StudyHubSummary;
